/* ---------------------------------------------------------------------------
   Pilot interest form — field definitions and validation.

   Deliberately dependency-free (no zod) so the project keeps a zero-dependency
   footprint beyond Next itself. The same validator runs on the client for
   immediate feedback and again inside the Server Action, which is mandatory:
   Server Actions are reachable via direct POST requests, so client-side
   validation can never be trusted.
--------------------------------------------------------------------------- */

export const SERVICE_OPTIONS = [
  "Family welfare visit",
  "Appointment accompaniment",
  "Medication or essential pickup",
  "Home repair coordination",
  "Property inspection",
  "Post-hospital practical support",
  "Something else",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

/** Field order here drives focus management — the first invalid field wins. */
export const FIELD_ORDER = [
  "fullName",
  "email",
  "phone",
  "country",
  "cebuLocation",
  "whoYouHelp",
  "recentSituation",
  "firstService",
  "consent",
] as const;

export type FieldName = (typeof FIELD_ORDER)[number];

export type InterestValues = Record<FieldName, string> & {
  researchCall: boolean;
};

export type FieldErrors = Partial<Record<FieldName, string>>;

/** Discriminated union consumed by useActionState in the form component. */
export type InterestFormState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      message: string;
      fieldErrors: FieldErrors;
      /** Echoed back so a failed submit never makes the user retype anything. */
      values: Partial<Record<FieldName, string>> & { researchCall?: boolean };
    };

export const initialInterestState: InterestFormState = { status: "idle" };

/** Per-field maximum lengths, also applied as maxLength in the markup. */
export const MAX_LENGTH: Record<FieldName, number> = {
  fullName: 120,
  email: 254,
  phone: 40,
  country: 80,
  cebuLocation: 140,
  whoYouHelp: 200,
  recentSituation: 1000,
  firstService: 80,
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

/** Normalises raw FormData into a trimmed, length-capped value object. */
export function parseInterestForm(formData: FormData): InterestValues {
  const values = {} as InterestValues;

  for (const field of FIELD_ORDER) {
    values[field] = read(formData, field).slice(0, MAX_LENGTH[field]);
  }

  values.researchCall = formData.get("researchCall") === "on";
  return values;
}

/** Returns a map of field name to human-readable error message. */
export function validateInterest(values: InterestValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.fullName) {
    errors.fullName = "Please enter your full name.";
  } else if (values.fullName.length < 2) {
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

  if (!values.cebuLocation) {
    errors.cebuLocation =
      "Please tell us where in Cebu your family or property is.";
  }

  if (!values.whoYouHelp) {
    errors.whoYouHelp = "Please tell us who you currently help in Cebu.";
  }

  if (!values.firstService) {
    errors.firstService = "Please choose the service you would use first.";
  } else if (
    !SERVICE_OPTIONS.includes(values.firstService as ServiceOption)
  ) {
    errors.firstService = "Please choose one of the listed services.";
  }

  if (values.consent !== "on") {
    errors.consent =
      "Please confirm you are happy for us to contact you about the pilot.";
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
