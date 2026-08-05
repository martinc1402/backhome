import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";

import { requireEnv } from "@/lib/env";

/**
 * Bucket used when no client IP can be determined. Deliberately a real, stable
 * value rather than null: everyone without a resolvable IP shares one throttle
 * bucket, so a missing header tightens the limit instead of opening a hole in
 * it. The alternative — skipping the check — would be a trivial bypass.
 */
const UNKNOWN_IP = "unknown";

/**
 * A salted SHA-256 of the submitter's IP address, used only to rate limit
 * submissions in public.pilot_interest.
 *
 * The raw address is never stored. That matters: an unsalted hash of an IP is
 * not anonymous, because the entire IPv4 space is small enough to brute force
 * in seconds — you could rainbow-table it back to the address. IP_HASH_SALT is
 * therefore required rather than optional, and the throw is intentional; a
 * silently unsalted hash would look like privacy without being it.
 */
export async function hashRequestIp(): Promise<string> {
  // headers() is async in Next 16 — see node_modules/next/dist/docs.
  const headerList = await headers();

  // Vercel and most proxies set x-forwarded-for as a client-to-proxy chain;
  // the first entry is the original client. x-real-ip is the common fallback.
  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || headerList.get("x-real-ip")?.trim() || UNKNOWN_IP;

  return createHash("sha256")
    .update(`${requireEnv("IP_HASH_SALT")}:${ip}`)
    .digest("hex");
}
