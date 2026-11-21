import "server-only";

import { Resend } from "resend";

import { requireEnv } from "@/lib/env";

/* ---------------------------------------------------------------------------
   Resend client for outbound notification email.

   `server-only` so an accidental client import is a build error rather than a
   leaked API key, no NEXT_PUBLIC_ prefix so Next never inlines it into the
   browser bundle, and lazy construction so a missing key fails the send rather
   than the build.

   RESEND_API_KEY is a full-access sending key. It can read your Resend account,
   so treat it as a secret.
--------------------------------------------------------------------------- */

let client: Resend | undefined;

export function resendClient(): Resend {
  client ??= new Resend(requireEnv("RESEND_API_KEY"));

  return client;
}

/**
 * Whether email is configured at all.
 *
 * Checked before constructing the client so an unconfigured deployment logs one
 * clear line and tells the visitor their message was not sent, instead of
 * throwing on every submission.
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM);
}
