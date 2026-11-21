import "server-only";

/* ---------------------------------------------------------------------------
   Turning errors into log lines that cannot contain a visitor's data.

   The forms collect names, contact details and free text about a family's
   circumstances. None of it may reach console output or Vercel logs — only
   that a submission succeeded or failed.
--------------------------------------------------------------------------- */

/**
 * Renders an unknown thrown/returned value as a readable line.
 *
 * Passing the raw value to console.error is not enough: Error instances and the
 * SDK's error objects carry non-enumerable properties, so they serialise to a
 * bare `{}` in structured logs — which is exactly as useful as no log at all.
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
