import type { VercelConfig } from "@vercel/config/v1";

// Vercel project configuration.
//
// Only the notification retry sweep lives here so far. Everything else about
// this project is framework defaults, and stating them again would just be a
// second place to keep in sync.
//
// The schedule is DAILY on purpose. Hobby plans cap cron jobs at once per day
// and FAIL THE DEPLOYMENT — not the cron, the deployment — on anything more
// frequent, so an hourly expression here would take the site down at the next
// push. Hobby also fires at an arbitrary minute within the hour, which is fine
// for a backlog sweep. On Pro, a six-hourly schedule ("0 0,6,12,18 * * *")
// would cut the worst-case delay between a failed send and its retry from 24
// hours to 6.
//
// Line comments rather than a block: cron expressions contain "*/", which
// closes a /* */ comment early and breaks the file in a genuinely baffling way.

export const config: VercelConfig = {
  framework: "nextjs",
  crons: [
    {
      path: "/api/notify-sweep",
      schedule: "0 7 * * *",
    },
  ],
};
