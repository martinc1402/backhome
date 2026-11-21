import "server-only";

import { createHash } from "node:crypto";

/* ---------------------------------------------------------------------------
   A simple in-memory rate limit: at most LIMIT submissions per IP per form
   per WINDOW.

   Deliberately simple, and its limits are worth knowing. The counts live in
   the memory of one function instance. Vercel's Fluid Compute reuses
   instances, so for a small site the same instance handles most requests and
   this works well, but a determined sender who lands on several instances
   gets several allowances. For a hard, platform-wide limit, add a Vercel WAF
   rate-limit rule on POST /api/forms/* in the dashboard (Firewall → Rules).

   IPs are hashed before they are used as keys, and nothing here is written
   anywhere: it all disappears when the instance stops.
--------------------------------------------------------------------------- */

const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
/** Stop the map growing without bound under a flood of distinct IPs. */
const MAX_KEYS = 5_000;

const hits = new Map<string, number[]>();

export function clientIp(request: Request): string {
  // On Vercel, x-forwarded-for is set by the platform; the first entry is the client.
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Records a submission and reports whether it is over the limit. */
export function isRateLimited(form: string, ip: string, now = Date.now()): boolean {
  const key = createHash("sha256").update(`${form}:${ip}`).digest("hex");
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= LIMIT) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    // Map iteration is insertion order, so this drops the oldest key.
    hits.delete(hits.keys().next().value!);
  }

  return false;
}
