import "server-only";

import {
  recordNotificationOutcome,
  sendInterestEmails,
  type NotifyTargets,
} from "@/lib/notify-interest";
import { supabaseAdmin } from "@/lib/supabase";
import { type InterestValues } from "@/lib/validate-interest";

/* ---------------------------------------------------------------------------
   Retry sweep for notifications that never went out.

   The send in app/actions.ts is best-effort: it runs in after(), there is no
   retry, and a transient Resend failure means a submission nobody is told
   about. The row is never lost, but "saved and unnoticed" is the exact problem
   the notification exists to prevent. This closes that.

   Driven by a daily cron (see vercel.ts -> app/api/notify-sweep/route.ts).
   Claiming is race-safe in Postgres, so a cron firing while a manual run is
   still going cannot double-send — see claim_pending_notifications() in
   supabase/migrations/0002_notification_state.sql.
--------------------------------------------------------------------------- */

/** Shape of the rows claim_pending_notifications() returns. */
type PendingRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string;
  cebu_location: string;
  who_you_help: string;
  recent_situation: string | null;
  first_service: string;
  research_call: boolean;
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
 * The nullable text columns come back as null where the form supplied an empty
 * optional field, because submit_pilot_interest() stores them through nullif.
 */
function toInterestValues(row: PendingRow): InterestValues {
  return {
    fullName: row.full_name,
    email: row.email,
    phone: row.phone ?? "",
    country: row.country,
    cebuLocation: row.cebu_location,
    whoYouHelp: row.who_you_help,
    recentSituation: row.recent_situation ?? "",
    firstService: row.first_service,
    consent: row.consent ? "on" : "",
    researchCall: row.research_call,
  };
}

/**
 * Re-sends only what is outstanding for a row.
 *
 * Deriving targets from the timestamps rather than re-sending both is what
 * stops a half-failed submission from mailing the founders a second time every
 * night until the applicant's dead address happens to start working.
 */
function pendingTargets(row: PendingRow): NotifyTargets {
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

  let rows: PendingRow[];

  try {
    const { data, error } = await supabaseAdmin().rpc(
      "claim_pending_notifications",
      { p_limit: limit },
    );

    if (error) {
      summary.error = error.message ?? "claim failed";
      console.error("[BackHome] Sweep could not claim rows:", error);
      return summary;
    }

    rows = (data ?? []) as PendingRow[];
  } catch (error) {
    summary.error = error instanceof Error ? error.message : String(error);
    console.error("[BackHome] Sweep could not claim rows:", error);
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

    const outcome = await sendInterestEmails(
      toInterestValues(row),
      // The row id, so the idempotency key matches the original attempt and
      // Resend suppresses anything it already accepted.
      row.id,
      targets,
    );

    await recordNotificationOutcome(row.id, outcome);

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
