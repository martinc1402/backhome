"use server";

import {
  errorSummary,
  parseInterestForm,
  validateInterest,
  type InterestFormState,
} from "@/lib/validate-interest";

/* ---------------------------------------------------------------------------
   ██  TODO: WIRE UP REAL SUBMISSION HANDLING BEFORE LAUNCH  ██

   Right now this action validates the submission, logs it to the server
   console and returns success. Nothing is persisted — if the site goes live
   in this state, every expression of interest is lost.

   Three things to add, in priority order:

   1. PERSIST the submission.
      Provision a database through the Vercel Marketplace (`vercel integration
      add neon`) or point at Airtable / Google Sheets if the founders prefer to
      read entries in a spreadsheet. Insert `values` in the marked block below.

   2. NOTIFY the founders.
      Resend or Postmark, sending to site.contactEmail in content/site.ts.
      Send the confirmation to the applicant too, since the success screen
      promises follow-up.

   3. PROTECT the endpoint.
      There is a honeypot below, which stops naive bots only. Add Vercel BotID
      or an IP rate limit (Upstash) before this URL is public. Server Actions
      are reachable by direct POST, so this is the only line of defence.

   Store all credentials as environment variables (`vercel env add`), never in
   this file.
--------------------------------------------------------------------------- */

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
    // ── REPLACE THIS BLOCK ────────────────────────────────────────────────
    // e.g. await db.insert(pilotInterest).values({ ...values, createdAt: new Date() })
    //      await resend.emails.send({ ... })
    console.info("[BackHome] Pilot interest received (not persisted):", {
      ...values,
      submittedAt: new Date().toISOString(),
    });
    // ── END REPLACE ───────────────────────────────────────────────────────

    return { status: "success" };
  } catch (error) {
    console.error("[BackHome] Failed to record pilot interest:", error);

    return {
      status: "error",
      message:
        "Something went wrong on our end and your details were not saved. Please try again, or email us directly.",
      fieldErrors: {},
      values,
    };
  }
}
