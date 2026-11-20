import type { CheckLevel } from "@/content/directory/taxonomy";
import type { IsoDate, Listing } from "@/content/directory/types";

/* ---------------------------------------------------------------------------
   The check badge's rules and date formatting. Kept apart from
   lib/directory.ts because client components import it, and this module must
   not pull the listing data into the browser bundle.
--------------------------------------------------------------------------- */

/** How long a check stays current. */
export const CHECK_VALID_MONTHS = 6;

const TIME_ZONE = "Asia/Manila";

export type CheckStatus =
  | { state: "current"; level: "visited" | "called"; date: IsoDate; expires: Date }
  | { state: "lapsed"; level: "visited" | "called"; date: IsoDate; expires: Date }
  | { state: "unchecked" };

function parseIsoDate(date: IsoDate): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function addMonths(date: Date, months: number): Date {
  const out = new Date(date);
  out.setUTCMonth(out.getUTCMonth() + months);
  return out;
}

export function checkStatus(
  listing: Pick<Listing, "checkLevel" | "checkDate">,
  now = new Date(),
): CheckStatus {
  const level: CheckLevel = listing.checkLevel;
  if (level === "listed" || !listing.checkDate) return { state: "unchecked" };

  const expires = addMonths(parseIsoDate(listing.checkDate), CHECK_VALID_MONTHS);
  return {
    state: now < expires ? "current" : "lapsed",
    level,
    date: listing.checkDate,
    expires,
  };
}

/* ---------- Formatting --------------------------------------------------- */

export function formatDate(date: IsoDate | Date): string {
  const d = typeof date === "string" ? parseIsoDate(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: typeof date === "string" ? "UTC" : TIME_ZONE,
  }).format(d);
}
