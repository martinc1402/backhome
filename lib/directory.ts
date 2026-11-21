import { listings } from "@/content/directory/listings";
import {
  AREAS,
  CARE_MODES,
  CATEGORIES,
  LANGUAGES,
  PRICE_BANDS,
  PRICE_UNITS,
  type AreaSlug,
  type LaunchCategorySlug,
  type PriceBandSlug,
} from "@/content/directory/taxonomy";
import type { IsoDate, Listing, Price } from "@/content/directory/types";
import type { ListingCardData } from "@/components/directory/listing-card";
import { checkStatus } from "@/lib/check";

export { checkStatus, formatDate, CHECK_VALID_MONTHS, type CheckStatus } from "@/lib/check";

/* ---------------------------------------------------------------------------
   Read-side of the directory: lookups, the check badge, and display helpers.

   Pure functions over the data in content/directory/. Pages that show a badge
   set `revalidate` so a check lapses on time without a redeploy.
--------------------------------------------------------------------------- */

/** Seconds between regenerations of pages that show check badges. */
export const BADGE_REVALIDATE_SECONDS = 86_400;

/* ---------- Taxonomy lookups -------------------------------------------- */

export const launchCategories = CATEGORIES.filter(
  (c): c is Extract<(typeof CATEGORIES)[number], { phase: "launch" }> =>
    c.phase === "launch",
);

export function getLaunchCategory(slug: string) {
  return launchCategories.find((c) => c.slug === slug);
}

export function getArea(slug: string) {
  return AREAS.find((a) => a.slug === slug);
}

export function categoryName(slug: LaunchCategorySlug): string {
  return getLaunchCategory(slug)!.name;
}

export function areaName(slug: AreaSlug): string {
  return getArea(slug)!.name;
}

export function subcategoryName(slug: string): string {
  for (const c of launchCategories) {
    const sub = c.subcategories.find((s) => s.slug === slug);
    if (sub) return sub.name;
  }
  return slug;
}

export function languageName(slug: string): string {
  return LANGUAGES.find((l) => l.slug === slug)?.name ?? slug;
}

export function careModeName(slug: string): string {
  return CARE_MODES.find((m) => m.slug === slug)?.name ?? slug;
}

/* ---------- Listing queries --------------------------------------------- */

export function allListings(): Listing[] {
  return listings;
}

export function listingsInCategory(category: string, area?: string): Listing[] {
  return sortByCheck(
    listings.filter(
      (l) => l.category === category && (area === undefined || l.area === area),
    ),
  );
}

export function getListing(category: string, slug: string): Listing | undefined {
  return listings.find((l) => l.category === category && l.slug === slug);
}

export function getListingBySlug(slug: string): Listing | undefined {
  return listings.find((l) => l.slug === slug);
}

export function listingHref(listing: Pick<Listing, "category" | "slug">): string {
  return `/cebu/${listing.category}/${listing.slug}`;
}

/**
 * Real listings only. Samples may appear on preview builds, but must never
 * count toward anything that tells families how big the directory is, or be
 * offered to search engines. Use this for counts, "Recently checked", the
 * sitemap and structured data.
 */
export function realListings(): Listing[] {
  return listings.filter((l) => !l.sample);
}

/**
 * Whether a category or area-category page should be indexed: only once it
 * holds at least one real listing. Empty pages are thin content, and a page
 * holding only samples is test data. The sitemap uses the same rule.
 */
export function hasRealListings(
  category: string | undefined,
  area?: string,
): boolean {
  return realListings().some(
    (l) =>
      (category === undefined || l.category === category) &&
      (area === undefined || l.area === area),
  );
}

/**
 * Most recently checked first, among real listings with a current check.
 * Suspended listings are excluded because their status is "suspended", not
 * "current".
 */
export function recentlyChecked(limit: number, now = new Date()): Listing[] {
  return realListings()
    .filter((l) => checkStatus(l, now).state === "current")
    .sort((a, b) => (b.checkDate ?? "").localeCompare(a.checkDate ?? ""))
    .slice(0, limit);
}

/** Real providers with a current Visited or Called check (not suspended). */
export function checkedCount(now = new Date()): number {
  return realListings().filter((l) => checkStatus(l, now).state === "current").length;
}

/** The most recent check date across real listings, if any. */
export function lastUpdated(): IsoDate | undefined {
  return realListings()
    .map((l) => l.checkDate)
    .filter((d): d is IsoDate => Boolean(d))
    .sort()
    .at(-1);
}

/**
 * Current checks first (Visited, then Called, newest first), then lapsed, then
 * unchecked, then under review. Families should meet the best-evidenced
 * options first.
 */
function sortByCheck(items: Listing[], now = new Date()): Listing[] {
  const rank = (l: Listing) => {
    const s = checkStatus(l, now);
    if (s.state === "current") return s.level === "visited" ? 0 : 1;
    if (s.state === "lapsed") return 2;
    if (s.state === "unchecked") return 3;
    return 4;
  };
  return [...items].sort(
    (a, b) =>
      rank(a) - rank(b) ||
      (b.checkDate ?? "").localeCompare(a.checkDate ?? "") ||
      a.name.localeCompare(b.name),
  );
}

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

export function formatPrice(price: Price): string {
  if (price.kind === "quote") return "Ask for a quote";
  const unit = PRICE_UNITS.find((u) => u.slug === price.per)!.name;
  const range = price.to
    ? `${peso.format(price.from)}–${peso.format(price.to)}`
    : `From ${peso.format(price.from)}`;
  return `${range} ${unit}`;
}

/** Which price-filter bands a listing falls in. */
export function priceBandsFor(price: Price): PriceBandSlug[] {
  if (price.kind === "quote") return ["quote"];
  return PRICE_BANDS.filter(
    (b) => b.unit === price.per && price.from >= b.min && price.from <= b.max,
  ).map((b) => b.slug);
}

/** "tel:" / "https://wa.me/" links from an E.164 number. */
export function telHref(e164: string): string {
  return `tel:${e164}`;
}

export function whatsappHref(e164: string, text?: string): string {
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${e164.replace(/\D/g, "")}${q}`;
}

export function formatPhone(e164: string): string {
  // +63 917 555 0101 for Philippine mobiles; anything else as given.
  const m = e164.match(/^\+63(\d{3})(\d{3})(\d{4})$/);
  return m ? `+63 ${m[1]} ${m[2]} ${m[3]}` : e164;
}

/* ---------- Data integrity ---------------------------------------------- */

/**
 * Throws at build time if the data breaks a rule the types cannot express.
 * Called from the directory pages' generateStaticParams, so a bad edit fails
 * the deploy instead of shipping a broken page.
 */
export function assertDirectoryIntegrity(): void {
  const problems: string[] = [];

  const areaSlugs = new Set<string>(AREAS.map((a) => a.slug));
  for (const c of CATEGORIES) {
    if (areaSlugs.has(c.slug)) {
      problems.push(`Category slug "${c.slug}" is also an area slug.`);
    }
  }

  const seen = new Set<string>();
  for (const l of listings) {
    const key = `${l.category}/${l.slug}`;
    if (seen.has(key)) problems.push(`Duplicate listing ${key}.`);
    seen.add(key);

    const cat = getLaunchCategory(l.category)!;
    for (const sub of l.subcategories) {
      if (!cat.subcategories.some((s) => s.slug === sub)) {
        problems.push(`${l.slug}: subcategory "${sub}" is not in ${l.category}.`);
      }
    }
    if (l.checkLevel !== "listed" && !l.checkDate) {
      problems.push(`${l.slug}: checkLevel "${l.checkLevel}" needs a checkDate.`);
    }
    if (l.suspended && !/^\d{4}-\d{2}-\d{2}$/.test(l.suspended.since)) {
      problems.push(`${l.slug}: suspended.since must be a YYYY-MM-DD date.`);
    }
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.slug)) {
      problems.push(`${l.slug}: slug must be lowercase words joined by hyphens.`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Directory data problems:\n- ${problems.join("\n- ")}`);
  }
}

/* ---------- Card data ---------------------------------------------------- */

/**
 * Flattens a listing into what a card and the filters need. Runs on the
 * server; the result is passed to the client-side filter as plain data.
 */
export function toCardData(
  listing: Listing,
  { showCategory = false, now = new Date() } = {},
): ListingCardData {
  const status = checkStatus(listing, now);
  const firstSubs = listing.subcategories.slice(0, 2).map(subcategoryName);
  const where = areaName(listing.area);

  return {
    key: `${listing.category}/${listing.slug}`,
    href: listingHref(listing),
    name: listing.name,
    sample: Boolean(listing.sample),
    kicker: `${showCategory ? categoryName(listing.category) : firstSubs[0] ?? categoryName(listing.category)} · ${where}`,
    status,
    summary: listing.services.slice(0, 2).join(". ") + ".",
    priceText: formatPrice(listing.price),
    languagesText: listing.languages.map(languageName).join(", "),
    photo: listing.photos[0]
      ? { src: listing.photos[0].src, alt: listing.photos[0].alt }
      : undefined,
    filter: {
      checkState:
        status.state === "unchecked"
          ? "listed"
          : status.state === "current"
            ? status.level
            : status.state,
      languages: listing.languages,
      priceBands: priceBandsFor(listing.price),
      careModes: listing.careModes,
      philHealth: listing.acceptsPhilHealth,
      hmo: listing.acceptsHMO,
      dementia: listing.dementiaExperience,
    },
  };
}
