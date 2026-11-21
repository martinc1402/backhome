import { AREAS, CATEGORIES } from "@/content/directory/taxonomy";

/* ---------------------------------------------------------------------------
   The two public forms: field options, limits and validation.

   Shared by the browser (for instant feedback) and the API routes (the real
   check — anything can POST to an API route). Pure functions, no secrets.

   Ask only for what is listed here. Do not add fields for medical details.
--------------------------------------------------------------------------- */

export type FormKind = "help" | "provider";

/** Hidden field a person never sees; bots tend to fill it. */
export const HONEYPOT_FIELD = "nickname";
/** Hidden field holding when the form was rendered (ms since epoch). */
export const STARTED_AT_FIELD = "startedAt";
/** Submissions faster than this are treated as automated. */
export const MIN_FILL_MS = 3_000;

export const AREA_OPTIONS = [
  ...AREAS.map((a) => ({ value: a.slug, label: a.name })),
  { value: "elsewhere", label: "Somewhere else in Cebu" },
] as const;

export const HELP_NEED_OPTIONS = [
  ...CATEGORIES.filter((c) => c.phase === "launch").map((c) => ({
    value: c.slug,
    label: c.name,
  })),
  { value: "not-sure", label: "Not sure" },
] as const;

/** Providers in Phase 2 groups can register now and be listed when those open. */
export const PROVIDER_CATEGORY_OPTIONS = [
  ...CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
  { value: "other", label: "Something else" },
] as const;

type FieldRule = {
  label: string;
  /** Shown when a required field is empty. */
  missing?: string;
  required: boolean;
  max: number;
  /** Allowed values for a select. */
  options?: readonly { value: string; label: string }[];
  kind?: "email" | "phone" | "url" | "multiline";
};

export const HELP_FIELDS = {
  name: { label: "Your name", missing: "Please enter your name.", required: true, max: 100 },
  email: { label: "Email", missing: "Please enter your email address.", required: true, max: 200, kind: "email" },
  whatsapp: { label: "WhatsApp number", required: false, max: 30, kind: "phone" },
  country: { label: "Country you live in", missing: "Please tell us which country you live in.", required: true, max: 60 },
  parentArea: {
    label: "Where in Cebu your parent lives",
    missing: "Please choose where in Cebu your parent lives.",
    required: true,
    max: 40,
    options: AREA_OPTIONS,
  },
  need: {
    label: "What kind of help they need",
    missing: "Please choose the kind of help they need.",
    required: true,
    max: 40,
    options: HELP_NEED_OPTIONS,
  },
  happening: {
    label: "What's happening?",
    missing: "Please tell us a little about what's happening.",
    required: true,
    max: 1000,
    kind: "multiline",
  },
} as const satisfies Record<string, FieldRule>;

export const PROVIDER_FIELDS = {
  businessName: { label: "Business name", missing: "Please enter the business name.", required: true, max: 150 },
  contactName: { label: "Contact name", missing: "Please enter a contact name.", required: true, max: 100 },
  email: { label: "Email", missing: "Please enter your email address.", required: true, max: 200, kind: "email" },
  phone: { label: "Phone or WhatsApp", missing: "Please enter a phone or WhatsApp number.", required: true, max: 30, kind: "phone" },
  category: {
    label: "Type of service",
    missing: "Please choose the type of service.",
    required: true,
    max: 40,
    options: PROVIDER_CATEGORY_OPTIONS,
  },
  area: {
    label: "Area",
    missing: "Please choose the area you work in.",
    required: true,
    max: 40,
    options: AREA_OPTIONS,
  },
  website: { label: "Website or Facebook page", required: false, max: 300, kind: "url" },
  description: {
    label: "Short description of your service",
    missing: "Please describe your service in a few sentences.",
    required: true,
    max: 800,
    kind: "multiline",
  },
} as const satisfies Record<string, FieldRule>;

export type HelpField = keyof typeof HELP_FIELDS;
export type ProviderField = keyof typeof PROVIDER_FIELDS;

export const FIELDS = { help: HELP_FIELDS, provider: PROVIDER_FIELDS } as const;

export type FormValues = Record<string, string>;
export type FieldErrors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\+?[0-9 ()-]{7,30}$/;
// Loose on purpose: "facebook.com/ourpage" and "www.example.ph" are both fine.
const URLISH = /^(https?:\/\/)?[^\s/]+\.[^\s]+$/i;

/** Trims every value, and collapses line breaks in single-line fields. */
export function normalise(kind: FormKind, raw: FormValues): FormValues {
  const out: FormValues = {};
  for (const [name, rule] of Object.entries(FIELDS[kind]) as [string, FieldRule][]) {
    const value = (raw[name] ?? "").toString();
    out[name] =
      rule.kind === "multiline"
        ? value.replace(/\r\n?/g, "\n").trim()
        : value.replace(/[\r\n]+/g, " ").trim();
  }
  return out;
}

export function validate(kind: FormKind, values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  for (const [name, rule] of Object.entries(FIELDS[kind]) as [string, FieldRule][]) {
    const value = values[name] ?? "";

    if (!value) {
      if (rule.required) {
        errors[name] =
          rule.missing ??
          (rule.options
            ? `Please choose ${rule.label.toLowerCase()}.`
            : `Please fill in ${rule.label.toLowerCase()}.`);
      }
      continue;
    }

    if (value.length > rule.max) {
      errors[name] = `Please keep this under ${rule.max} characters.`;
    } else if (rule.options && !rule.options.some((o) => o.value === value)) {
      errors[name] = "Please choose one of the options.";
    } else if (rule.kind === "email" && !EMAIL.test(value)) {
      errors[name] = "Please enter a valid email address, like name@example.com.";
    } else if (rule.kind === "phone" && !PHONE.test(value)) {
      errors[name] = "Please enter a phone number using digits, spaces and an optional +.";
    } else if (rule.kind === "url" && !URLISH.test(value)) {
      errors[name] = "Please enter a web address, like facebook.com/yourpage.";
    }
  }

  return errors;
}

/** Label for a select value, for the notification email. */
export function optionLabel(kind: FormKind, field: string, value: string): string {
  const rule = (FIELDS[kind] as Record<string, FieldRule>)[field];
  return rule?.options?.find((o) => o.value === value)?.label ?? value;
}

/** What the API returns. The client shows `message`, and `fieldErrors` inline. */
export type FormResponse =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: FieldErrors };
