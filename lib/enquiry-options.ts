/* ---------------------------------------------------------------------------
   Care enquiry form — the fixed option lists.

   ZERO IMPORTS, deliberately. lib/validate-enquiry.ts imports this module and
   is itself imported by the client form, so anything added here ships to the
   browser. That is the same rule that keeps validate-enquiry.ts free of zod.

   These arrays are the source of truth for THREE consumers: the <option>
   markup in components/enquiry-form.tsx, the server-side validator, and the
   CHECK constraints in supabase/care_enquiries.sql. The first two share this
   file. The third cannot, so it is tied back with a hash — see OPTIONS_MD5.

   ---------------------------------------------------------------------------
   The budget labels contain U+20B1 PESO SIGN and U+2013 EN DASH:

       'Under ₱20,000'     ₱ = U+20B1
       '₱20,000–₱40,000'   ₱ = U+20B1, – = U+2013 (EN DASH, not a hyphen)

   They are stored verbatim and constrained verbatim, so a hyphen typed in
   place of the en dash — or an editor autocorrect, or a Unicode-normalising
   paste — produces a CHECK violation on a valid submission, in production, for
   one budget band only. DO NOT RETYPE THESE STRINGS. Copy them.
--------------------------------------------------------------------------- */

/** Required select. Deliberately has NO SQL check constraint: this is the list
    most likely to gain a town, and a constraint would make that a migration. */
export const PARENT_LOCATION_OPTIONS = [
  "Cebu City",
  "Mandaue",
  "Lapu-Lapu",
  "Talisay",
  "Consolacion",
  "Minglanilla",
  "Liloan",
  "Cordova",
  "Elsewhere in Cebu",
] as const;

/** Required select. Constrained by care_enquiries_care_type_check. */
export const CARE_TYPE_OPTIONS = [
  "A residential home",
  "Care at home",
  "Not sure yet",
] as const;

/** Optional select. Constrained by care_enquiries_care_level_check (nullable).
    Note "Not sure" is a real answer and is stored; skipping the field stores
    NULL. The two are different triage signals and must not be flattened. */
export const CARE_LEVEL_OPTIONS = [
  "Mostly independent",
  "Needs daily help",
  "Bedridden or high care",
  "Dementia or memory care",
  "Not sure",
] as const;

/** Required select. Constrained by care_enquiries_timing_check. */
export const TIMING_OPTIONS = [
  "Urgently",
  "Within 3 months",
  "Planning ahead",
] as const;

/** Optional select. Constrained by care_enquiries_budget_band_check (nullable).
    See the U+20B1 / U+2013 warning in the file header before editing. */
export const BUDGET_BAND_OPTIONS = [
  "Under ₱20,000",
  "₱20,000–₱40,000",
  "₱40,000–₱70,000",
  "Over ₱70,000",
  "Not sure",
] as const;

/**
 * md5 of the four CONSTRAINED lists, flattened in the order careType,
 * careLevel, timing, budgetBand and joined with "\n".
 *
 * supabase/care_enquiries.sql declares its own copy of these literals and
 * asserts this same hash inside a `do` block. If the two copies ever drift the
 * migration aborts in the SQL editor with both hashes printed — instead of a
 * production-only CHECK violation on one budget band, weeks later, for one
 * unlucky visitor.
 *
 * PARENT_LOCATION_OPTIONS is excluded: it has no CHECK constraint.
 *
 * Regenerate after ANY change to the four lists above:
 *
 *   npm run options:md5
 *
 * then paste the result here AND into expected_md5 in the SQL.
 */
export const OPTIONS_MD5 = "91652e2a319eccbb4d209cffdaa62784";
