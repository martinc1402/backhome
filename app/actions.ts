"use server";

import { after } from "next/server";

import { site } from "@/content/site";
import { hashRequestIp } from "@/lib/hash-ip";
import { notifyPilotInterest } from "@/lib/notify-interest";
import { supabaseAdmin } from "@/lib/supabase";
import {
  errorSummary,
  parseInterestForm,
  validateInterest,
  type InterestFormState,
  type InterestValues,
} from "@/lib/validate-interest";

/* ---------------------------------------------------------------------------
   Pilot interest submissions.

   Submissions are persisted to public.pilot_interest in Supabase through the
   submit_pilot_interest() function, which performs the throttle check and the
   insert in a single statement — see the SQL in that project. Doing both in one
   round trip is what stops two simultaneous requests from each passing a
   check-then-insert race.

   On success the founders are alerted and the applicant gets a confirmation,
   both via Resend — see lib/notify-interest.ts. That happens in after(), so it
   runs once the response has been sent: email latency never delays the success
   screen, and a mail failure cannot turn a saved row into an error message.

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
 * The throttle in submit_pilot_interest() signals refusal with
 * `raise exception 'rate_limited'`. Match on the message rather than the
 * SQLSTATE: a bare RAISE EXCEPTION is P0001 by default, so the code alone
 * would also catch unrelated exceptions added to that function later.
 */
function isRateLimited(error: { message?: string | null }): boolean {
  return (error.message ?? "").includes("rate_limited");
}

function failure(
  message: string,
  values: InterestValues,
): InterestFormState {
  return { status: "error", message, fieldErrors: {}, values };
}

export async function submitPilotInterest(
  _prevState: InterestFormState,
  formData: FormData,
): Promise<InterestFormState> {
  // Honeypot: a real person never sees or fills this field. Return success so
  // a bot cannot distinguish a rejection from an accepted submission.
  if (typeof formData.get("website") === "string" && formData.get("website")) {
    return { status: "success" };
  }

  const values = parseInterestForm(formData);

  // Re-validate on the server. The client runs the same checks, but Server
  // Actions accept direct POST requests, so client validation is not a control.
  const fieldErrors = validateInterest(values);

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
    const { data, error } = await supabaseAdmin().rpc("submit_pilot_interest", {
      p_full_name: values.fullName,
      p_email: values.email,
      p_phone: values.phone,
      p_country: values.country,
      p_cebu_location: values.cebuLocation,
      p_who_you_help: values.whoYouHelp,
      p_recent_situation: values.recentSituation,
      p_first_service: values.firstService,
      p_research_call: values.researchCall,
      // validateInterest has already rejected anything but "on", so this is
      // always true here — stored anyway as the record that consent was given.
      p_consent: values.consent === "on",
      p_ip_hash: await hashRequestIp(),
    });

    if (error) {
      if (isRateLimited(error)) {
        return failure(RATE_LIMIT_MESSAGE, values);
      }

      // Log the real reason server-side; show the visitor something useful.
      console.error("[BackHome] Supabase rejected pilot interest:", error);
      return failure(FAILURE_MESSAGE, values);
    }

    // Only past the error check: notifying about a row that was never written
    // would be worse than not notifying at all.
    //
    // submit_pilot_interest() returns the inserted id from migration 0002
    // onward. Null means that migration has not been applied to this
    // environment yet, which notifyPilotInterest degrades gracefully around.
    const submissionId = typeof data === "string" ? data : null;
    after(() => notifyPilotInterest(values, submissionId));

    return { status: "success" };
  } catch (error) {
    // Thrown rather than returned: missing env vars, DNS, network. Reaching
    // here means nothing was written, so it must never report success — the
    // previous version of this file did exactly that, and lost the submission.
    console.error("[BackHome] Failed to record pilot interest:", error);

    return failure(FAILURE_MESSAGE, values);
  }
}
