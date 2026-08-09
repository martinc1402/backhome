import "server-only";

import { randomUUID } from "node:crypto";

import { site } from "@/content/site";
import { requireEnv } from "@/lib/env";
import { isEmailConfigured, resendClient } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";
import { type InterestValues } from "@/lib/validate-interest";

/* ---------------------------------------------------------------------------
   Notification email for pilot interest submissions.

   Two messages per submission:
     - an alert to the founders, so a submission is not something you have to
       go looking for in the Supabase dashboard;
     - a confirmation to the applicant, because the success screen already
       promises "we will be in touch" and an empty inbox undercuts that.

   NOTHING IN HERE MAY BREAK A SUBMISSION. By the time this runs the row is
   already committed, so a failed send must never surface as "your details were
   not saved" — that would be a lie that also makes people submit twice. Every
   path is caught and logged; the caller runs it inside after() so it is not
   even on the response path. See app/actions.ts.
--------------------------------------------------------------------------- */

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escapes user input for interpolation into an HTML email body.
 *
 * Not optional. Every field below is free text typed by an anonymous visitor,
 * and it lands in the founders' mail client — which renders HTML. Without this,
 * `recent_situation` is a straightforward injection point into an email the
 * founders are expected to trust.
 */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

/**
 * Strips newlines from anything interpolated into a subject line. The Resend
 * API takes JSON rather than raw SMTP, so this is belt-and-braces against
 * header injection rather than the only thing standing in its way.
 */
function singleLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Renders an unknown thrown/returned value as a readable line.
 *
 * Passing the raw value to console.error is not enough: Error instances and the
 * SDK's error objects carry non-enumerable properties, so they serialise to a
 * bare `{}` in structured logs — which is exactly as useful as no log at all.
 */
function describeError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (error && typeof error === "object") {
    const { name, message } = error as { name?: string; message?: string };

    if (name || message) {
      return `${name ?? "Error"}: ${message ?? "(no message)"}`;
    }
  }

  return String(error);
}

const NOT_PROVIDED = "Not provided";

/** Field order and labels for the founder alert. */
function summaryRows(values: InterestValues): Array<[string, string]> {
  return [
    ["Name", values.fullName],
    ["Email", values.email],
    ["Phone / WhatsApp", values.phone || NOT_PROVIDED],
    ["Lives in", values.country],
    ["Family or property in", values.cebuLocation],
    ["Who they help", values.whoYouHelp],
    ["Recent difficult situation", values.recentSituation || NOT_PROVIDED],
    ["Would use first", values.firstService],
    ["Open to a research call", values.researchCall ? "Yes" : "No"],
  ];
}

function founderHtml(values: InterestValues): string {
  const rows = summaryRows(values)
    .map(
      ([label, value]) =>
        `<tr>` +
        `<td style="padding:6px 16px 6px 0;vertical-align:top;color:#5b5b55;` +
        `font-size:14px;white-space:nowrap;">${escapeHtml(label)}</td>` +
        `<td style="padding:6px 0;vertical-align:top;color:#1c1c19;` +
        `font-size:14px;">${escapeHtml(value)}</td>` +
        `</tr>`,
    )
    .join("");

  return (
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;` +
    `max-width:560px;">` +
    `<h2 style="font-size:18px;margin:0 0 4px;color:#0c310a;">` +
    `New pilot interest</h2>` +
    `<p style="margin:0 0 20px;color:#5b5b55;font-size:14px;">` +
    `Reply to this email to reach ${escapeHtml(values.fullName)} directly.</p>` +
    `<table cellpadding="0" cellspacing="0" role="presentation">${rows}</table>` +
    `</div>`
  );
}

function founderText(values: InterestValues): string {
  const rows = summaryRows(values)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return `New pilot interest\n\n${rows}\n`;
}

function applicantHtml(fullName: string): string {
  return (
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;` +
    `max-width:560px;color:#1c1c19;">` +
    `<p style="font-size:15px;">Hi ${escapeHtml(fullName)},</p>` +
    `<p style="font-size:15px;line-height:1.6;">Thank you for expressing ` +
    `interest in the ${site.name} Cebu pilot. We have your details.</p>` +
    `<p style="font-size:15px;line-height:1.6;">We will be in touch as the ` +
    `pilot takes shape. If you offered a short research call, we may reach out ` +
    `to hear more about your situation.</p>` +
    `<p style="font-size:15px;line-height:1.6;">Nothing is committed and no ` +
    `payment is required. If you would like your details removed, just reply ` +
    `to this email and we will delete them.</p>` +
    `<p style="font-size:15px;">— The ${site.name} team</p>` +
    `</div>`
  );
}

function applicantText(fullName: string): string {
  return (
    `Hi ${fullName},\n\n` +
    `Thank you for expressing interest in the ${site.name} Cebu pilot. We have ` +
    `your details.\n\n` +
    `We will be in touch as the pilot takes shape. If you offered a short ` +
    `research call, we may reach out to hear more about your situation.\n\n` +
    `Nothing is committed and no payment is required. If you would like your ` +
    `details removed, just reply to this email and we will delete them.\n\n` +
    `— The ${site.name} team\n`
  );
}

/** Which of the two emails a given attempt should try to send. */
export type NotifyTargets = {
  founder: boolean;
  applicant: boolean;
};

/**
 * What actually got through. A target that was not attempted comes back false,
 * so `sent` is always "delivered to Resend on this attempt" and never "assumed
 * fine because we did not try".
 */
export type NotifyOutcome = {
  founderSent: boolean;
  applicantSent: boolean;
  error: string | null;
};

const NOTHING_ATTEMPTED: NotifyOutcome = {
  founderSent: false,
  applicantSent: false,
  error: null,
};

/**
 * Sends the requested notification emails. Never throws.
 *
 * `submissionId` seeds the Resend idempotency keys, which is why it must be the
 * pilot_interest row id rather than a fresh value per attempt: the retry sweep
 * re-sends with the same key, so a message Resend already accepted is not
 * duplicated even when our record of it failed to save.
 */
export async function sendInterestEmails(
  values: InterestValues,
  submissionId: string,
  targets: NotifyTargets,
): Promise<NotifyOutcome> {
  if (!targets.founder && !targets.applicant) {
    return NOTHING_ATTEMPTED;
  }

  if (!isEmailConfigured()) {
    console.warn(
      "[BackHome] Pilot interest saved, but no notification sent: set " +
        "RESEND_API_KEY and RESEND_FROM to enable email.",
    );
    return { ...NOTHING_ATTEMPTED, error: "email not configured" };
  }

  let resend: ReturnType<typeof resendClient>;
  let from: string;

  try {
    resend = resendClient();
    from = requireEnv("RESEND_FROM");
  } catch (error) {
    // Missing env var or a malformed client. The row is already saved, and the
    // sweep will pick it up again once configuration is fixed.
    const message = describeError(error);
    console.error(`[BackHome] Could not send pilot interest email: ${message}`);
    return { ...NOTHING_ATTEMPTED, error: message };
  }

  // A dedicated inbox can be set with FOUNDER_EMAIL; otherwise the address
  // already published on the site is the right default.
  const founderTo = process.env.FOUNDER_EMAIL || site.contactEmail;

  const jobs: Array<{
    key: keyof NotifyTargets;
    label: string;
    run: () => Promise<{ error: unknown }>;
  }> = [];

  if (targets.founder) {
    jobs.push({
      key: "founder",
      label: "founder alert",
      run: () =>
        resend.emails.send(
          {
            from,
            to: founderTo,
            // Lets the founders reply straight to the applicant from the alert.
            replyTo: values.email,
            subject: `New pilot interest — ${singleLine(values.fullName)}`,
            html: founderHtml(values),
            text: founderText(values),
          },
          { idempotencyKey: `pilot-interest/${submissionId}/founder` },
        ),
    });
  }

  if (targets.applicant) {
    jobs.push({
      key: "applicant",
      label: "applicant confirmation",
      run: () =>
        resend.emails.send(
          {
            from,
            to: values.email,
            replyTo: site.contactEmail,
            subject: `Thank you for your interest in the ${site.name} Cebu pilot`,
            html: applicantHtml(values.fullName),
            text: applicantText(values.fullName),
          },
          { idempotencyKey: `pilot-interest/${submissionId}/applicant` },
        ),
    });
  }

  // allSettled, not all: the applicant's confirmation failing (a typo'd or
  // bouncing address, which is entirely likely) must not stop the founders
  // being told that a submission arrived. That alert is the important one.
  const results = await Promise.allSettled(jobs.map((job) => job.run()));

  const outcome: NotifyOutcome = { ...NOTHING_ATTEMPTED };
  const failures: string[] = [];

  results.forEach((result, index) => {
    const { key, label } = jobs[index];

    // The SDK reports API failures in the resolved value rather than by
    // throwing, so a fulfilled promise is not the same as an accepted email —
    // both have to be unpacked or failures go unnoticed.
    if (result.status === "rejected") {
      const message = describeError(result.reason);
      console.error(`[BackHome] ${label} threw: ${message}`);
      failures.push(`${label}: ${message}`);
      return;
    }

    if (result.value.error) {
      const message = describeError(result.value.error);
      console.error(`[BackHome] ${label} rejected by Resend: ${message}`);
      failures.push(`${label}: ${message}`);
      return;
    }

    if (key === "founder") {
      outcome.founderSent = true;
    } else {
      outcome.applicantSent = true;
    }
  });

  outcome.error = failures.length > 0 ? failures.join("; ") : null;
  return outcome;
}

/**
 * Persists what was delivered, so the sweep knows what is still outstanding.
 *
 * Never throws: failing to RECORD a send must not be mistaken for failing to
 * SEND one. The cost of a lost record is one duplicate-suppressed retry on the
 * next sweep, which the shared idempotency key already absorbs.
 */
export async function recordNotificationOutcome(
  submissionId: string,
  outcome: NotifyOutcome,
): Promise<void> {
  try {
    const { error } = await supabaseAdmin().rpc("mark_notification_sent", {
      p_id: submissionId,
      p_founder: outcome.founderSent,
      p_applicant: outcome.applicantSent,
      p_error: outcome.error,
    });

    if (error) {
      console.error(
        `[BackHome] Could not record notification state for ${submissionId}: ` +
          describeError(error),
      );
    }
  } catch (error) {
    console.error(
      `[BackHome] Could not record notification state for ${submissionId}: ` +
        describeError(error),
    );
  }
}

/**
 * Sends both emails for a fresh submission and records the result.
 *
 * `submissionId` is null when submit_pilot_interest() did not return an id —
 * which means migration 0002 has not been applied yet. Mail still goes out;
 * only the bookkeeping is skipped, so an unmigrated deployment degrades to the
 * previous best-effort behaviour rather than failing.
 */
export async function notifyPilotInterest(
  values: InterestValues,
  submissionId: string | null,
): Promise<void> {
  if (!submissionId) {
    console.warn(
      "[BackHome] submit_pilot_interest returned no id; sending without " +
        "retry tracking. Apply supabase/migrations/0002_notification_state.sql.",
    );

    await sendInterestEmails(values, randomUUID(), {
      founder: true,
      applicant: true,
    });
    return;
  }

  const outcome = await sendInterestEmails(values, submissionId, {
    founder: true,
    applicant: true,
  });

  await recordNotificationOutcome(submissionId, outcome);
}
