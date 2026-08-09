import type { NextRequest } from "next/server";

import { runNotificationSweep } from "@/lib/notify-sweep";

/* ---------------------------------------------------------------------------
   Cron entry point for the notification retry sweep.

   Scheduled daily in vercel.ts. Vercel sends `Authorization: Bearer
   $CRON_SECRET` when that variable is set on the project, which is the only
   thing standing between this route and the open internet — the path is
   guessable and the handler sends email, so an unauthenticated caller could
   otherwise use it to make us mail people.

   Deliberately NOT a Vercel Workflow. Durable execution buys retries and
   crash-safety, but the retry state here already lives in Postgres where it can
   be queried, and a daily sweep over a table that is normally empty does not
   justify a second orchestration system to reason about.
--------------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // Both halves matter. Without the first, an unset CRON_SECRET would compare
  // `Bearer undefined` and let anyone in who guessed that.
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const summary = await runNotificationSweep();

    // 200 even when sends are still failing: this reports the sweep ran, and a
    // non-2xx would make Vercel's cron log flag an outage that is not one. The
    // counts are the signal, and stillFailing is the one to watch.
    return Response.json(summary);
  } catch (error) {
    // runNotificationSweep catches its own failures, so reaching here means
    // something genuinely unexpected. Log it rather than returning an opaque
    // 500 with nothing in the cron log to explain it.
    console.error("[BackHome] Notification sweep crashed:", error);

    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
