"use server";

import { after } from "next/server";

import { site } from "@/content/site";
import { hashRequestIp } from "@/lib/hash-ip";
import { describeDbError, describeError } from "@/lib/log-safe";
import { notifyCareEnquiry } from "@/lib/notify-enquiry";
import { supabaseAdmin } from "@/lib/supabase";
import {
  errorSummary,
  parseEnquiryForm,
  validateEnquiry,
  type EnquiryFormState,
  type EnquiryValues,
} from "@/lib/validate-enquiry";

/* ---------------------------------------------------------------------------
   Care enquiry submissions.

   Submissions are persisted to public.care_enquiries in Supabase through the
   submit_care_enquiry() function, which performs the consent check, the
   throttle check and the insert in a single statement — see
   supabase/care_enquiries.sql. Doing them in one round trip is what stops two
   simultaneous requests from each passing a check-then-insert race.

   On success the founders are alerted and the enquirer gets a confirmation,
   both via Resend — see lib/notify-enquiry.ts. That happens in after(), so it
   runs once the response has been sent: email latency never delays the success
   screen, and a mail failure cannot turn a saved row into an error message.

   NOTHING in this file may log a field value. The enquiry carries a parent's
   care level and free text about a family's circumstances; only the outcome and
   the row id belong in the logs. That is why both error paths go through
   lib/log-safe.ts rather than passing the error straight to console.error.

   Credentials live in environment variables (.env.local locally, `vercel env
   add` for deployments), never in this file.
--------------------------------------------------------------------------- */

/** Max submissions per hashed IP per hour, enforced in Postgres. */
const RATE_LIMIT_MESSAGE =
  `You have already sent us a few messages in the last hour, so this one was ` +
  `not saved. If something did not come through, email us at ` +
  `${site.contactEmail} and we will pick it up from there.`;

const FAILURE_MESSAGE =
  `Something went wrong on our end and your details were not saved. Please ` +
  `try again in a moment, or email us at ${site.contactEmail}.`;

/**
 * The throttle in submit_care_enquiry() signals refusal with
 * `raise exception 'rate_limited'`. Match on the message rather than the
 * SQLSTATE: a bare RAISE EXCEPTION is P0001 by default, so the code alone
 * would also catch the consent guard in the same function.
 *
 * Note this READS error.message, which describeDbError deliberately withholds
 * from the logs. Reading it here is fine — emitting it is the prohibited act.
 * Do not "fix" the inconsistency by logging what this matches on.
 */
function isRateLimited(error: { message?: string | null }): boolean {
  return (error.message ?? "").includes("rate_limited");
}

function failure(message: string, values: EnquiryValues): EnquiryFormState {
  return { status: "error", message, fieldErrors: {}, values };
}

export async function submitCareEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  // Honeypot: a real person never sees or fills this field. Return success so
  // a bot cannot distinguish a rejection from an accepted submission.
  if (typeof formData.get("website") === "string" && formData.get("website")) {
    return { status: "success" };
  }

  const values = parseEnquiryForm(formData);

  // Re-validate on the server. The browser's required attributes are not a
  // control: Server Actions accept direct POST requests.
  const fieldErrors = validateEnquiry(values);

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: errorSummary(fieldErrors),
      fieldErrors,
      // Echoed back so a failed submit never makes the user retype anything.
      values,
    };
  }

  try {
    const { data, error } = await supabaseAdmin().rpc("submit_care_enquiry", {
      p_full_name: values.fullName,
      p_email: values.email,
      p_phone: values.phone,
      p_country: values.country,
      p_parent_location: values.parentLocation,
      p_care_type: values.careType,
      // Optional selects arrive as "" when skipped; nullif() inside the
      // function turns that into NULL. A chosen "Not sure" is a real value.
      p_care_level: values.careLevel,
      p_timing: values.timing,
      p_budget_band: values.budgetBand,
      p_situation: values.situation,
      p_open_to_call: values.openToCall,
      // validateEnquiry has already rejected anything but "on", and the
      // function rejects a false a third time — stored as the record that
      // consent was given.
      p_consent: values.consent === "on",
      p_ip_hash: await hashRequestIp(),
    });

    if (error) {
      if (isRateLimited(error)) {
        return failure(RATE_LIMIT_MESSAGE, values);
      }

      // A check violation here is a deploy bug, not a visitor mistake: the
      // option lists in lib/enquiry-options.ts have drifted from the CHECK
      // constraints, so one option is unsubmittable. Its own line, because
      // nothing else in the codebase produces this string and it is worth
      // alerting on. describeDbError names the constraint and nothing else.
      if (error.code === "23514") {
        console.error(
          `[BackHome] care_enquiries CHECK rejected a valid-looking submission ` +
            `— option lists have drifted from the constraints: ` +
            describeDbError(error),
        );
      } else {
        console.error(
          `[BackHome] Supabase rejected care enquiry: ${describeDbError(error)}`,
        );
      }

      return failure(FAILURE_MESSAGE, values);
    }

    // Only past the error check: notifying about a row that was never written
    // would be worse than not notifying at all.
    const submissionId = typeof data === "string" ? data : null;
    after(() => notifyCareEnquiry(values, submissionId));

    return { status: "success" };
  } catch (error) {
    // Thrown rather than returned: missing env vars, DNS, network. Reaching
    // here means nothing was written, so it must never report success — an
    // earlier version of this file did exactly that, and lost the submission.
    //
    // describeError, not the raw object: these values do not carry the payload
    // today, but "no raw error object reaches console in the submit path" is a
    // rule worth being able to state without qualification.
    console.error(
      `[BackHome] Failed to record care enquiry: ${describeError(error)}`,
    );

    return failure(FAILURE_MESSAGE, values);
  }
}
