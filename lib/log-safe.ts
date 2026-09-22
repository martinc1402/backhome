import "server-only";

/* ---------------------------------------------------------------------------
   Turning errors into log lines that cannot contain a visitor's data.

   The care enquiry form collects a parent's care level and free text about a
   family's circumstances. Neither may reach console output, Vercel logs or any
   error tracker — only that a submission succeeded or failed, and its id.

   The trap this module exists to close: PostgREST surfaces the Postgres error
   verbatim, and for SQLSTATE class 23 (integrity constraint violation) Postgres
   writes "Failing row contains (...)" — THE ENTIRE ROW, including `situation`
   and `care_level` — into the DETAIL field. `console.error("...", error)` on a
   PostgrestError therefore prints the whole submission. Adding CHECK
   constraints to care_enquiries is what makes that reachable, so the
   constraints and this module ship together.
--------------------------------------------------------------------------- */

/**
 * Renders an unknown thrown/returned value as a readable line.
 *
 * Passing the raw value to console.error is not enough: Error instances and the
 * SDK's error objects carry non-enumerable properties, so they serialise to a
 * bare `{}` in structured logs — which is exactly as useful as no log at all.
 *
 * Safe for values that never carry row data: network, DNS and missing-env
 * failures. For anything Supabase returned, use describeDbError instead.
 */
export function describeError(error: unknown): string {
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

/** Names the constraint in a check-violation message, e.g. care_type. */
const CHECK_CONSTRAINT = /violates check constraint "(care_enquiries_[a-z_]+)"/;

/**
 * A log line for an error returned by Supabase that cannot contain row data.
 *
 * NEVER reads `details` or `hint` — see the file header. `message` is withheld
 * for SQLSTATE classes 22 (data exception) and 23 (integrity constraint
 * violation), the two classes whose messages can quote a column value. For
 * every other class the message is a Postgres or PostgREST string that carries
 * no visitor data, and withholding it would make a real outage undiagnosable.
 *
 * The constraint NAME is safe and is the single most useful thing available: it
 * says exactly which option list has drifted from lib/enquiry-options.ts.
 */
export function describeDbError(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);

  const { code, message } = error as { code?: string; message?: string };
  const parts = [`code=${code ?? "unknown"}`];

  const constraint = message?.match(CHECK_CONSTRAINT)?.[1];
  if (constraint) {
    // Only the capture — never the surrounding message, which quotes the value.
    parts.push(`constraint=${constraint}`);
  }

  // Classes 22 and 23 are the ones that quote values back. Everything else
  // (connection, permission, undefined function, PostgREST routing) is safe.
  const withheld = code?.startsWith("22") || code?.startsWith("23");
  if (!withheld && message) {
    parts.push(`message=${message}`);
  }

  return parts.join(" ");
}
