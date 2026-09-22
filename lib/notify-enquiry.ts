import "server-only";

import { randomUUID } from "node:crypto";

import { site } from "@/content/site";
import { requireEnv } from "@/lib/env";
import {
  BUDGET_BAND_OPTIONS,
  CARE_LEVEL_OPTIONS,
  CARE_TYPE_OPTIONS,
  PARENT_LOCATION_OPTIONS,
  TIMING_OPTIONS,
  labelFor,
} from "@/lib/enquiry-options";
import { describeError } from "@/lib/log-safe";
import { isEmailConfigured, resendClient } from "@/lib/resend";
import { supabaseAdmin } from "@/lib/supabase";
import { type EnquiryValues } from "@/lib/validate-enquiry";

/* ---------------------------------------------------------------------------
   Notification email for care enquiry submissions.

   Two messages per submission:
     - an alert to the founders, so an enquiry is not something you have to go
       looking for in the Supabase dashboard;
     - a confirmation to the enquirer, because the success screen already
       promises "we will reply personally" and an empty inbox undercuts that.

   NOTHING IN HERE MAY BREAK A SUBMISSION. By the time this runs the row is
   already committed, so a failed send must never surface as "your details were
   not saved" — that would be a lie that also makes people submit twice. Every
   path is caught and logged; the caller runs it inside after() so it is not
   even on the response path. See app/actions.ts.

   The founder alert carries the parent's care level and the free-text
   situation. That is the point of the alert and it goes to a controlled inbox.
   The enquirer's confirmation carries NEITHER — see applicantHtml.
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
 * `situation` is a straightforward injection point into an email the founders
 * are expected to trust.
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

/** A text field the visitor left blank. */
const NOT_PROVIDED = "Not provided";
/** A select the visitor did not answer — distinct from choosing "Not sure". */
const NOT_SPECIFIED = "Not specified";

/**
 * Field order and labels for the founder alert.
 *
 * The five select-backed fields hold slugs, so every one is resolved back to
 * its label here — an alert reading "bedridden_or_high_care" would be a worse
 * version of the thing this email exists to deliver. labelFor falls back to the
 * raw slug if it is no longer listed, so a retired option degrades to something
 * readable rather than a blank cell.
 *
 * `situation` is deliberately NOT here: it is free text, often several
 * paragraphs, and the table cells below are single-line. It gets its own block
 * under the table instead — see founderHtml.
 *
 * Two different placeholders on purpose. "Not provided" means a text field was
 * left blank; "Not specified" means a select was skipped. For care level that
 * distinction matters: choosing "Not sure" is a real answer about the parent,
 * skipping the question is not, and flattening them loses a triage signal.
 */
function summaryRows(values: EnquiryValues): Array<[string, string]> {
  return [
    ["Name", values.fullName],
    ["Email", values.email],
    ["Phone / WhatsApp", values.phone || NOT_PROVIDED],
    ["Lives in", values.country],
    ["Parent is in", labelFor(PARENT_LOCATION_OPTIONS, values.parentLocation)],
    ["Looking for", labelFor(CARE_TYPE_OPTIONS, values.careType)],
    [
      "Level of care",
      values.careLevel
        ? labelFor(CARE_LEVEL_OPTIONS, values.careLevel)
        : NOT_SPECIFIED,
    ],
    ["Timing", labelFor(TIMING_OPTIONS, values.timing)],
    [
      "Monthly budget",
      values.budgetBand
        ? labelFor(BUDGET_BAND_OPTIONS, values.budgetBand)
        : NOT_SPECIFIED,
    ],
    ["Open to a call", values.openToCall ? "Yes" : "No"],
  ];
}

/**
 * The free-text answer, as its own block.
 *
 * escapeHtml FIRST, then newlines to <br />. That order is load-bearing:
 * escaping after the replace would turn the tags we just inserted into visible
 * text, and the obvious "fix" for that is to stop escaping — which reopens the
 * injection this function exists to prevent. `situation` is the largest
 * attacker-controlled string that reaches the founders' mail client.
 */
function situationHtml(situation: string): string {
  // Browsers submit textarea content with CRLF, so match \r\n and lone \r
  // too — matching \n alone leaves a stray \r sitting before each <br />.
  const body = escapeHtml(situation).replace(/\r\n|\r|\n/g, "<br />");

  return (
    `<p style="margin:24px 0 6px;color:#5b5b55;font-size:14px;">` +
    `What is happening right now</p>` +
    `<p style="margin:0;padding:12px 16px;background:#f7f5ee;border-radius:8px;` +
    `color:#1c1c19;font-size:14px;line-height:1.6;">${body}</p>`
  );
}

function founderHtml(values: EnquiryValues): string {
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
    `New care enquiry</h2>` +
    `<p style="margin:0 0 20px;color:#5b5b55;font-size:14px;">` +
    `Reply to this email to reach ${escapeHtml(values.fullName)} directly.</p>` +
    `<table cellpadding="0" cellspacing="0" role="presentation">${rows}</table>` +
    // Omitted entirely when blank: a heading over "Not provided" is noise.
    `${values.situation ? situationHtml(values.situation) : ""}` +
    `</div>`
  );
}

function founderText(values: EnquiryValues): string {
  const rows = summaryRows(values)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  const situation = values.situation
    ? `\nWhat is happening right now:\n${values.situation}\n`
    : "";

  return `New care enquiry\n\n${rows}\n${situation}`;
}

/*
 * The enquirer's confirmation takes ONLY the name — deliberately.
 *
 * That address is unverified: it is whatever was typed into the form, and it is
 * frequently mistyped or shared within a household. Echoing the care level
 * ("Dementia or memory care") or the situation text back to it would mail
 * health-adjacent detail about a third party — the parent, who never filled in
 * anything — to an inbox nobody has confirmed. The founder alert goes to a
 * controlled address; this does not.
 */
function applicantHtml(fullName: string): string {
  return (
    `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;` +
    `max-width:560px;color:#1c1c19;">` +
    `<p style="font-size:15px;">Hi ${escapeHtml(fullName)},</p>` +
    `<p style="font-size:15px;line-height:1.6;">Thank you for telling us about ` +
    `your parent. We have your details.</p>` +
    `<p style="font-size:15px;line-height:1.6;">We will send verified care ` +
    `options as we confirm them, and we will reply personally. If you asked for ` +
    `a call, we will suggest a time.</p>` +
    `<p style="font-size:15px;line-height:1.6;">There is no cost to families ` +
    `and no payment is required. If you would like your details removed, just ` +
    `reply to this email and we will delete them.</p>` +
    `<p style="font-size:15px;">— The ${site.name} team</p>` +
    `</div>`
  );
}

function applicantText(fullName: string): string {
  return (
    `Hi ${fullName},\n\n` +
    `Thank you for telling us about your parent. We have your details.\n\n` +
    `We will send verified care options as we confirm them, and we will reply ` +
    `personally. If you asked for a call, we will suggest a time.\n\n` +
    `There is no cost to families and no payment is required. If you would ` +
    `like your details removed, just reply to this email and we will delete ` +
    `them.\n\n` +
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
 * care_enquiries row id rather than a fresh value per attempt: the retry sweep
 * re-sends with the same key, so a message Resend already accepted is not
 * duplicated even when our record of it failed to save.
 */
export async function sendEnquiryEmails(
  values: EnquiryValues,
  submissionId: string,
  targets: NotifyTargets,
): Promise<NotifyOutcome> {
  if (!targets.founder && !targets.applicant) {
    return NOTHING_ATTEMPTED;
  }

  if (!isEmailConfigured()) {
    console.warn(
      "[BackHome] Care enquiry saved, but no notification sent: set " +
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
    console.error(`[BackHome] Could not send care enquiry email: ${message}`);
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
            // Lets the founders reply straight to the enquirer from the alert.
            replyTo: values.email,
            // Timing goes in the subject so "Urgently" is visible in the inbox
            // list without opening the mail — which is the whole reason for
            // asking about timing at all.
            subject:
              `New care enquiry ` +
              `(${singleLine(labelFor(TIMING_OPTIONS, values.timing))}) — ` +
              `${singleLine(values.fullName)}`,
            html: founderHtml(values),
            text: founderText(values),
          },
          { idempotencyKey: `care-enquiry/${submissionId}/founder` },
        ),
    });
  }

  if (targets.applicant) {
    jobs.push({
      key: "applicant",
      label: "enquirer confirmation",
      run: () =>
        resend.emails.send(
          {
            from,
            to: values.email,
            replyTo: site.contactEmail,
            subject: `Thank you — ${site.name} has your details`,
            html: applicantHtml(values.fullName),
            text: applicantText(values.fullName),
          },
          { idempotencyKey: `care-enquiry/${submissionId}/applicant` },
        ),
    });
  }

  // allSettled, not all: the enquirer's confirmation failing (a typo'd or
  // bouncing address, which is entirely likely) must not stop the founders
  // being told that an enquiry arrived. That alert is the important one.
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
export async function recordCareNotificationOutcome(
  submissionId: string,
  outcome: NotifyOutcome,
): Promise<void> {
  try {
    const { error } = await supabaseAdmin().rpc("mark_care_notification_sent", {
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
 * `submissionId` is null when submit_care_enquiry() did not return an id, which
 * in practice means the migration has not been applied to this environment.
 * Mail still goes out; only the bookkeeping is skipped, so an unmigrated
 * deployment degrades to best-effort rather than failing.
 */
export async function notifyCareEnquiry(
  values: EnquiryValues,
  submissionId: string | null,
): Promise<void> {
  if (!submissionId) {
    console.warn(
      "[BackHome] submit_care_enquiry returned no id; sending without retry " +
        "tracking. Apply supabase/migrations/0003_care_enquiries.sql.",
    );

    await sendEnquiryEmails(values, randomUUID(), {
      founder: true,
      applicant: true,
    });
    return;
  }

  const outcome = await sendEnquiryEmails(values, submissionId, {
    founder: true,
    applicant: true,
  });

  await recordCareNotificationOutcome(submissionId, outcome);
}
