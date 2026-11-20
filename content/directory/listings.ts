import { sampleListings } from "@/content/directory/samples";
import type { Listing } from "@/content/directory/types";

/* ---------------------------------------------------------------------------
   Every provider in the directory. One object per provider; see
   content/directory/types.ts for what each field means.

   Never add a provider, price, licence number or piece of feedback that has
   not actually been checked. A listing with checkLevel "listed" must say only
   what the provider told us.
--------------------------------------------------------------------------- */

const realListings: Listing[] = [
  // Add real providers here.
];

/**
 * Samples appear in local and preview builds only, never in production.
 * VERCEL_ENV is "production" only on production deployments; locally it is
 * unset, so `next build` and `next dev` include them.
 */
export const includeSamples = process.env.VERCEL_ENV !== "production";

export const listings: Listing[] = [
  ...realListings,
  // TEST DATA. Delete this line and content/directory/samples.ts to remove the samples.
  ...(includeSamples ? sampleListings : []),
];
