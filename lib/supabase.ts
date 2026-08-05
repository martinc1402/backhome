import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { requireEnv } from "@/lib/env";

/* ---------------------------------------------------------------------------
   Supabase client for server-side writes.

   SUPABASE_SECRET_KEY is the `sb_secret_...` key (the replacement for the
   legacy `service_role` key). It BYPASSES row level security, so it must never
   reach the browser. Two things enforce that:

     - the `server-only` import above, which makes importing this module from a
       Client Component a build error rather than a silent leak;
     - the variable name, which deliberately has no NEXT_PUBLIC_ prefix, so
       Next will not inline it into the client bundle.

   Bypassing RLS is the point rather than a shortcut. public.pilot_interest has
   RLS enabled with NO policies at all, so the publishable key — the one that is
   designed to be shipped to browsers — can neither read nor write it. The rows
   hold names, emails, phone numbers and free text about family circumstances,
   so "unreachable without the secret key" is the posture we want, and it is
   stricter than the usual anon-insert-only pattern.
--------------------------------------------------------------------------- */

let client: SupabaseClient | undefined;

export function supabaseAdmin(): SupabaseClient {
  // Memoised rather than per-call, but still lazy: the env vars are read on the
  // first submission, not when this module is imported. See lib/env.ts.
  client ??= createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SECRET_KEY"),
    {
      // There are no user sessions here — one anonymous form, one insert.
      // Without these the client keeps refresh timers alive for nothing.
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );

  return client;
}
