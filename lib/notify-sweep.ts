import "server-only";

import { describeDbError, describeError } from "@/lib/log-safe";
import {
  recordCareNotificationOutcome,
  sendEnquiryEmails,
  type NotifyTargets,
} from "@/lib/notify-enquiry";
import { supabaseAdmin } from "@/lib/supabase";
import { type EnquiryValues } from "@/lib/validate-enquiry";

/* ---------------------------------------------------------------------------
   Retry sweep for notifications that never went out.

   The send in app/actions.ts is best-effort: it runs in after(), there is no
   retry, and a transient Resend failure means a submission nobody is told
   about. The row is never lost, but "saved and unnoticed" is the exact problem
   the notification exists to prevent. This closes that.

   Driven by a daily cron (see vercel.ts -> app/api/notify-sweep/route.ts).
   Claiming is race-safe in Postgres, so a cron firing while a manual run is
   still going cannot double-send — see claim_pending_care_notifications() in
   supabase/care_enquiries.sql.

   THIS FILE MAY LOG COUNTS AND ROW IDS, NEVER A ROW. The claim returns every
   column, including care_level and the free-text situation — unavoidable, since
   the founder alert cannot be rebuilt without them. Do not add a
   console.error("row failed:", row) here, and do not pass a raw Supabase error
   object to console: see lib/log-safe.ts for why.
--------------------------------------------------------------------------- */

/** Shape of the rows claim_pending_care_notifications() returns. */
type PendingEnquiryRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string;
  parent_location: string;
  care_type: string;
  care_level: string | null;
  timing: string;
  budget_band: string | null;
  situation: string | null;
  open_to_call: boolean;
  consent: boolean;
  founder_notified_at: string | null;
  applicant_notified_at: string | null;
  notify_attempts: number;
};

export type SweepSummary = {
  claimed: number;
  founderSent: number;
  applicantSent: number;
  stillFailing: number;
  error: string | null;
};

/**
 * Rebuilds the value object the email templates expect from a database row.
 *
 * The nullable columns come back as null where the form supplied an empty
 * optional field, because submit_care_enquiry() stores them through nullif.
 * Mapping them back to "" reproduces the original email exactly — including
 * which fields showed "Not specified".
 */
function toEnquiryValues(row: PendingEnquiryRow): EnquiryValues {
  return {
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    country: row.country,
    parentLocation: row.parent_location,
    careType: row.care_type,
    careLevel: row.care_level ?? "",
    timing: row.timing,
    budgetBand: row.budget_band ?? "",
    situation: row.situation ?? "",
    consent: row.consent ? "on" : "",
    openToCall: row.open_to_call,
  };
}

/**
 * Re-sends only what is outstanding for a row.
 *
 * Deriving targets from the timestamps rather than re-sending both is what
 * stops a half-failed submission from mailing the founders a second time every
 * night until the enquirer's dead address happens to start working.
 */
function pendingTargets(row: PendingEnquiryRow): NotifyTargets {
  return {
    founder: row.founder_notified_at === null,
    applicant: row.applicant_notified_at === null,
  };
}

export async function runNotificationSweep(
  limit = 25,
): Promise<SweepSummary> {
  const summary: SweepSummary = {
    claimed: 0,
    founderSent: 0,
    applicantSent: 0,
    stillFailing: 0,
    error: null,
  };

  let rows: PendingEnquiryRow[];

  try {
    const { data, error } = await supabaseAdmin().rpc(
      "claim_pending_care_notifications",
      { p_limit: limit },
    );

    if (error) {
      summary.error = describeDbError(error);
      console.error(`[BackHome] Sweep could not claim rows: ${summary.error}`);
      return summary;
    }

    rows = (data ?? []) as PendingEnquiryRow[];
  } catch (error) {
    summary.error = describeError(error);
    console.error(`[BackHome] Sweep could not claim rows: ${summary.error}`);
    return summary;
  }

  summary.claimed = rows.length;

  if (rows.length === 0) {
    return summary;
  }

  // Sequential, not concurrent. The backlog is small by construction (this only
  // ever holds sends that already failed), and a burst of parallel requests
  // against Resend's per-second limit is a good way to manufacture the very
  // failures the sweep exists to repair.
  for (const row of rows) {
    const targets = pendingTargets(row);

    const outcome = await sendEnquiryEmails(
      toEnquiryValues(row),
      // The row id, so the idempotency key matches the original attempt and
      // Resend suppresses anything it already accepted.
      row.id,
      targets,
    );

    await recordCareNotificationOutcome(row.id, outcome);

    if (outcome.founderSent) summary.founderSent += 1;
    if (outcome.applicantSent) summary.applicantSent += 1;
    if (outcome.error) summary.stillFailing += 1;
  }

  console.log(
    `[BackHome] Notification sweep: claimed ${summary.claimed}, ` +
      `founder ${summary.founderSent}, applicant ${summary.applicantSent}, ` +
      `still failing ${summary.stillFailing}`,
  );

  return summary;
}
