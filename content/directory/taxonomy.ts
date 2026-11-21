/* ---------------------------------------------------------------------------
   Directory taxonomy: the fixed vocabularies every listing is built from.

   Slugs are URL segments and are permanent once published — renaming one
   breaks every inbound link. Change the `name`, never the `slug`.

   Area slugs and category slugs MUST NOT overlap. /cebu/[a]/[b] serves both
   /cebu/[area]/[category] and /cebu/[category]/[provider], and tells them
   apart by which list `a` appears in. lib/directory.ts asserts this at build.
--------------------------------------------------------------------------- */

export const AREAS = [
  { slug: "cebu-city", name: "Cebu City" },
  { slug: "mandaue", name: "Mandaue" },
  { slug: "lapu-lapu", name: "Lapu-Lapu" },
  { slug: "talisay", name: "Talisay" },
] as const;

export type AreaSlug = (typeof AREAS)[number]["slug"];

export type CategoryIcon =
  | "home"
  | "nurse"
  | "doctor"
  | "building"
  | "hospital"
  | "pill"
  | "car"
  | "document";

type CategoryDef = {
  slug: string;
  name: string;
  /** One line under the name on tiles and the category page. */
  blurb: string;
  icon: CategoryIcon;
  /** "launch" groups have pages; "coming-soon" groups appear only as tiles. */
  phase: "launch" | "coming-soon";
  subcategories: readonly { slug: string; name: string }[];
};

export const CATEGORIES = [
  {
    slug: "care-at-home",
    name: "Care at home",
    blurb: "Live-in and visiting caregivers, night and respite care.",
    icon: "home",
    phase: "launch",
    subcategories: [
      { slug: "live-in-caregivers", name: "Live-in caregivers" },
      { slug: "visiting-caregivers", name: "Visiting caregivers (hourly or daily)" },
      { slug: "night-respite-care", name: "Night and respite care" },
      { slug: "caregiver-agencies", name: "Caregiver agencies" },
      { slug: "dementia-caregivers", name: "Dementia-experienced caregivers" },
    ],
  },
  {
    slug: "nursing-and-therapy",
    name: "Nursing and therapy at home",
    blurb: "Home nurses, physio, wound care and lab tests at home.",
    icon: "nurse",
    phase: "launch",
    subcategories: [
      { slug: "home-nursing", name: "Home nursing" },
      { slug: "physiotherapy", name: "Physiotherapy" },
      { slug: "occupational-speech-therapy", name: "Occupational and speech therapy" },
      { slug: "wound-catheter-care", name: "Wound and catheter care" },
      { slug: "lab-tests-at-home", name: "Lab tests at home" },
    ],
  },
  {
    slug: "doctors-and-specialists",
    name: "Doctors and specialists",
    blurb: "Geriatricians, home-visit doctors and memory assessments.",
    icon: "doctor",
    phase: "launch",
    subcategories: [
      { slug: "geriatricians", name: "Geriatricians" },
      { slug: "home-visit-doctors", name: "Home-visit doctors" },
      { slug: "memory-dementia-assessment", name: "Memory and dementia assessment" },
      { slug: "telehealth", name: "Telehealth for seniors" },
    ],
  },
  {
    slug: "care-homes",
    name: "Care homes and day centres",
    blurb: "Nursing homes, assisted living and adult day care.",
    icon: "building",
    phase: "launch",
    subcategories: [
      { slug: "nursing-homes", name: "Nursing homes" },
      { slug: "assisted-living", name: "Assisted living and retirement homes" },
      { slug: "adult-day-care", name: "Adult day care" },
      { slug: "short-stay-respite", name: "Short-stay respite" },
    ],
  },
  {
    slug: "after-hospital",
    name: "After hospital and end of life",
    blurb: "Care after discharge, hospice and palliative care.",
    icon: "hospital",
    phase: "coming-soon",
    subcategories: [],
  },
  {
    slug: "medicines-and-equipment",
    name: "Medicines and equipment",
    blurb: "Pharmacy delivery, equipment rental and home safety changes.",
    icon: "pill",
    phase: "coming-soon",
    subcategories: [],
  },
  {
    slug: "transport-and-everyday-help",
    name: "Transport and everyday help",
    blurb: "Patient transport, escorts, meals, cleaning and laundry.",
    icon: "car",
    phase: "coming-soon",
    subcategories: [],
  },
  {
    slug: "paperwork-and-benefits",
    name: "Paperwork and benefits",
    blurb: "Senior ID, PhilHealth, SSS and GSIS, and special power of attorney.",
    icon: "document",
    phase: "coming-soon",
    subcategories: [],
  },
] as const satisfies readonly CategoryDef[];

export type Category = (typeof CATEGORIES)[number];
export type CategorySlug = Category["slug"];

/** Only launch groups can hold listings. */
export type LaunchCategorySlug = Extract<Category, { phase: "launch" }>["slug"];

/** Every subcategory slug across the launch groups. */
export type SubcategorySlug = Extract<
  Category,
  { phase: "launch" }
>["subcategories"][number]["slug"];

export const LANGUAGES = [
  { slug: "cebuano", name: "Cebuano" },
  { slug: "tagalog", name: "Tagalog" },
  { slug: "english", name: "English" },
] as const;

export type LanguageSlug = (typeof LANGUAGES)[number]["slug"];

export const CHECK_LEVELS = [
  {
    slug: "visited",
    name: "Visited",
    description:
      "Seen in person by our Cebu team. Permits and licences checked, photos taken.",
  },
  {
    slug: "called",
    name: "Called",
    description: "Spoken to by phone. Permits and licences checked online.",
  },
  {
    slug: "listed",
    name: "Listed",
    description: "Added by the provider. We haven't checked it yet.",
  },
] as const;

export type CheckLevel = (typeof CHECK_LEVELS)[number]["slug"];

export const CARE_MODES = [
  { slug: "live-in", name: "Live-in" },
  { slug: "hourly", name: "Hourly or daily" },
  { slug: "visit", name: "Visit-based" },
] as const;

export type CareMode = (typeof CARE_MODES)[number]["slug"];

export const PRICE_UNITS = [
  { slug: "hour", name: "per hour" },
  { slug: "day", name: "per day" },
  { slug: "visit", name: "per visit" },
  { slug: "session", name: "per session" },
  { slug: "month", name: "per month" },
] as const;

export type PriceUnit = (typeof PRICE_UNITS)[number]["slug"];

/**
 * Price bands for the category-page price filter, in pesos. Each band belongs
 * to one unit, because ₱500 an hour and ₱500 a month are not comparable — the
 * filter only offers bands for units that appear on the page. A listing
 * matches a band when its "from" price falls inside it. "quote" matches
 * listings that only give prices on request.
 *
 * [CHECK] These bands are placeholders, not market data. Set them once real
 * listings show where prices actually cluster.
 */
export const PRICE_BANDS = [
  { slug: "hour-under-300", name: "Under ₱300 an hour", unit: "hour", min: 0, max: 299 },
  { slug: "hour-300-plus", name: "₱300 or more an hour", unit: "hour", min: 300, max: Infinity },
  { slug: "day-under-1500", name: "Under ₱1,500 a day", unit: "day", min: 0, max: 1_499 },
  { slug: "day-1500-plus", name: "₱1,500 or more a day", unit: "day", min: 1_500, max: Infinity },
  { slug: "visit-under-2000", name: "Under ₱2,000 a visit", unit: "visit", min: 0, max: 1_999 },
  { slug: "visit-2000-plus", name: "₱2,000 or more a visit", unit: "visit", min: 2_000, max: Infinity },
  { slug: "session-under-1500", name: "Under ₱1,500 a session", unit: "session", min: 0, max: 1_499 },
  { slug: "session-1500-plus", name: "₱1,500 or more a session", unit: "session", min: 1_500, max: Infinity },
  { slug: "month-under-30k", name: "Under ₱30,000 a month", unit: "month", min: 0, max: 29_999 },
  { slug: "month-30k-60k", name: "₱30,000–₱60,000 a month", unit: "month", min: 30_000, max: 60_000 },
  { slug: "month-over-60k", name: "Over ₱60,000 a month", unit: "month", min: 60_001, max: Infinity },
  { slug: "quote", name: "Ask for a quote", unit: null, min: NaN, max: NaN },
] as const satisfies readonly {
  slug: string;
  name: string;
  unit: PriceUnit | null;
  min: number;
  max: number;
}[];

export type PriceBandSlug = (typeof PRICE_BANDS)[number]["slug"];
