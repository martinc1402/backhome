import type {
  AreaSlug,
  CareMode,
  CheckLevel,
  LanguageSlug,
  LaunchCategorySlug,
  PriceUnit,
  SubcategorySlug,
} from "@/content/directory/taxonomy";

/** An ISO calendar date, e.g. "2026-11-03". */
export type IsoDate = `${number}-${number}-${number}`;

export type Licence = {
  /** e.g. "DOH licence to operate", "Mayor's permit", "PRC licence". */
  type: string;
  number: string;
  /** When BackHome last confirmed it, not when it was issued. */
  checkedOn: IsoDate;
};

export type Price =
  | { kind: "range"; from: number; to?: number; per: PriceUnit; note?: string }
  | { kind: "quote"; note?: string };

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type FamilyFeedback = {
  /** As the family agreed to be named, e.g. "Daughter in Dubai". Never a full name. */
  from: string;
  date: IsoDate;
  text: string;
};

/**
 * One provider. Every field on a listing page comes from here; nothing is
 * computed except the check badge's lapsed state (lib/directory.ts).
 */
export type Listing = {
  /** Permanent once published — it is the URL. */
  slug: string;
  name: string;
  /** True for the test data in samples.ts. Hides it from the sitemap and structured data. */
  sample?: boolean;

  category: LaunchCategorySlug;
  /** Must belong to `category`; lib/directory.ts asserts this at build. */
  subcategories: SubcategorySlug[];
  area: AreaSlug;
  /** Street address or barangay, if the provider has premises families visit. */
  address?: string;

  checkLevel: CheckLevel;
  /** Required unless checkLevel is "listed". */
  checkDate?: IsoDate;
  /**
   * Set when a family reports a problem and we are looking into it. The badge
   * comes down and the listing shows "Under review"; it also drops out of the
   * provider count and "Recently checked". Remove the field once resolved.
   *
   * The reason is for our records only and is never shown on the site.
   */
  suspended?: { reason: string; since: IsoDate };

  /** What they do, one item per line. */
  services: string[];
  /** Who they suit, e.g. "Bedbound parents who need two-person transfers". */
  suits: string[];
  careModes: CareMode[];
  dementiaExperience: boolean;
  acceptsPhilHealth: boolean;
  acceptsHMO: boolean;

  price: Price;
  licences: Licence[];
  languages: LanguageSlug[];
  /** Free text, e.g. "Mon–Sat 8am–6pm; live-in carers 24/7". */
  hours: string;
  /** e.g. "Usually replies within a day". */
  responseTime: string;

  photos: Photo[];
  /** 2–3 sentences from the BackHome team. */
  notes: string;

  contact: {
    /** E.164, e.g. "+639171234567". */
    phone?: string;
    whatsapp?: string;
    website?: string;
    facebook?: string;
  };

  feedback: FamilyFeedback[];
};
