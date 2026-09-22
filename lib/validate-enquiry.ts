import {
  BUDGET_BAND_OPTIONS,
  CARE_LEVEL_OPTIONS,
  CARE_TYPE_OPTIONS,
  PARENT_LOCATION_OPTIONS,
  TIMING_OPTIONS,
} from "@/lib/enquiry-options";

/* ---------------------------------------------------------------------------
   Care enquiry form — field definitions and validation.

   Deliberately dependency-free (no zod). This module is imported by the client
   form as well as the Server Action, so anything added here ships to the
   browser — that is the reason for the rule, and it still holds even though the
   project now carries @supabase/supabase-js for the server-side write.
   lib/enquiry-options.ts is the one permitted import, and it has no imports of
   its own for exactly this reason.

   validateEnquiry() runs inside the Server Action, which is mandatory: Server
   Actions are reachable via direct POST requests, so the browser's own required
   attributes can never be trusted. submit_care_enquiry() in Postgres re-checks
   consent a third time.
--------------------------------------------------------------------------- */

/** Field order here drives focus management — the first invalid field wins. */
export const FIELD_ORDER = [
  "fullName",
  "email",
  "phone",
  "country",
  "parentLocation",
  "careType",
  "careLevel",
  "timing",
  "budgetBand",
  "situation",
  "consent",
] as const;

export type FieldName = (typeof FIELD_ORDER)[number];

export type EnquiryValues = Record<FieldName, string> & {
  openToCall: boolean;
};

export type FieldErrors = Partial<Record<FieldName, string>>;

/** Discriminated union consumed by useActionState in the form component. */
export type EnquiryFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors: FieldErrors;
      /** Echoed back so a failed submit never makes the user retype anything. */
      values: Partial<Record<FieldName, string>> & { openToCall?: boolean };
    };

export const initialEnquiryState: EnquiryFormState = { status: "idle" };

/**
 * Per-field maximum lengths, also applied as maxLength in the markup.
 *
 * The select-backed fields are capped well above their longest option
 * ("Dementia or memory care", 23 characters) rather than at it: the cap is a
 * guard against a forged POST sending a megabyte, not a second validator. The
 * membership check below is what actually constrains them.
 */
export const MAX_LENGTH: Record<FieldName, number> = {
  fullName: 120,
  email: 254,
  phone: 40,
  country: 80,
  parentLocation: 60,
  careType: 60,
  careLevel: 60,
  timing: 60,
  budgetBand: 60,
  situation: 2000,
  consent: 10,
};

/**
 * Pragmatic email check. Intentionally permissive — the goal is to catch
 * typos and obvious mistakes, not to reject unusual but valid addresses.
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function read(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Membership test against one of the option lists.
 *
 * Takes `readonly string[]` rather than the literal tuple type so the `as const`
 * arrays widen on the way in and `.includes(string)` is legal under `strict`.
 * The previous form cast the value to the option union instead, which would
 * have silently accepted a wrong-typed value had one ever been passed.
 */
function isOption(options: readonly string[], value: string): boolean {
  return options.includes(value);
}

/** Normalises raw FormData into a trimmed, length-capped value object. */
export function parseEnquiryForm(formData: FormData): EnquiryValues {
  const values = {} as EnquiryValues;

  for (const field of FIELD_ORDER) {
    values[field] = read(formData, field).slice(0, MAX_LENGTH[field]);
  }

  values.openToCall = formData.get("openToCall") === "on";
  return values;
}

/** Returns a map of field name to human-readable error message. */
export function validateEnquiry(values: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.fullName || values.fullName.length < 2) {
    errors.fullName = "Please enter your full name.";
  }

  if (!values.email) {
    errors.email = "Please enter your email address so we can reply.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "That does not look like a valid email address.";
  }

  // Phone is optional, but if provided it should look like a phone number.
  if (values.phone && !/^[+\d][\d\s()\-.]{5,}$/.test(values.phone)) {
    errors.phone =
      "Please enter a valid phone or WhatsApp number, including country code.";
  }

  if (!values.country) {
    errors.country = "Please tell us which country you are living in.";
  }

  if (!values.parentLocation) {
    errors.parentLocation = "Please tell us where in Cebu your parent is.";
  } else if (!isOption(PARENT_LOCATION_OPTIONS, values.parentLocation)) {
    errors.parentLocation = "Please choose one of the listed areas.";
  }

  if (!values.careType) {
    errors.careType = "Please choose the type of care you are looking for.";
  } else if (!isOption(CARE_TYPE_OPTIONS, values.careType)) {
    errors.careType = "Please choose one of the listed options.";
  }

  // Optional, but a value that IS present must be one of ours — otherwise the
  // CHECK constraint rejects it in Postgres, after the visitor saw a success.
  if (values.careLevel && !isOption(CARE_LEVEL_OPTIONS, values.careLevel)) {
    errors.careLevel = "Please choose one of the listed care levels.";
  }

  if (!values.timing) {
    errors.timing = "Please tell us how soon care is needed.";
  } else if (!isOption(TIMING_OPTIONS, values.timing)) {
    errors.timing = "Please choose one of the listed options.";
  }

  if (values.budgetBand && !isOption(BUDGET_BAND_OPTIONS, values.budgetBand)) {
    errors.budgetBand = "Please choose one of the listed budget ranges.";
  }

  if (values.consent !== "on") {
    errors.consent =
      "Please confirm you are happy for us to store this information.";
  }

  return errors;
}

/** Summary message shown above the form when a submission fails validation. */
export function errorSummary(errors: FieldErrors): string {
  const count = Object.keys(errors).length;
  return count === 1
    ? "There is 1 field that needs your attention."
    : `There are ${count} fields that need your attention.`;
}
