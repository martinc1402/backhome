/* ---------------------------------------------------------------------------
   Care enquiry form — the fixed option lists.

   ZERO IMPORTS, deliberately. lib/validate-enquiry.ts imports this module and
   is itself imported by the client form, so anything added here ships to the
   browser. That is the same rule that keeps validate-enquiry.ts free of zod.

   Each option is a { value, label } pair:

     - `value` is a stable ASCII slug. It is what goes into the database and
       what the CHECK constraints list. It is an identifier, not copy.
     - `label` is what the visitor reads. It exists only here and in the
       rendered page and email.

   The split is the point. Storing the label would couple the database to UI
   copy: softening "Bedridden or high care" later would need a data migration
   AND a constraint change AND a redeploy, in that order, or submissions would
   break in between. With slugs, rewording is a one-line change to this file.

   It also removed a real hazard. The budget labels contain U+20B1 PESO SIGN
   and U+2013 EN DASH, and an earlier version stored those labels verbatim in
   constrained columns — so a hyphen typed in place of the en dash in the SQL
   would have rejected valid submissions in production, on one band only. The
   slugs are ASCII, so that whole class of failure is gone and the md5 parity
   guard that used to defend against it is gone with it.

   Slugs are permanent. Changing one orphans every row already stored under it.
   Add a new slug instead, and leave the old one listed so old rows still
   resolve to a label.
--------------------------------------------------------------------------- */

export type Option = { value: string; label: string };

/**
 * Required select. Deliberately has NO SQL check constraint: this is the list
 * most likely to gain a town, and a constraint would make that a migration.
 * Validated in TypeScript either way.
 */
export const PARENT_LOCATION_OPTIONS = [
  { value: "cebu_city", label: "Cebu City" },
  { value: "mandaue", label: "Mandaue" },
  { value: "lapu_lapu", label: "Lapu-Lapu" },
  { value: "talisay", label: "Talisay" },
  { value: "consolacion", label: "Consolacion" },
  { value: "minglanilla", label: "Minglanilla" },
  { value: "liloan", label: "Liloan" },
  { value: "cordova", label: "Cordova" },
  { value: "elsewhere_in_cebu", label: "Elsewhere in Cebu" },
] as const;

/** Required select. Constrained by care_enquiries_care_type_check. */
export const CARE_TYPE_OPTIONS = [
  { value: "residential_home", label: "A residential home" },
  { value: "care_at_home", label: "Care at home" },
  { value: "not_sure_yet", label: "Not sure yet" },
] as const;

/**
 * Optional select. Constrained by care_enquiries_care_level_check (nullable).
 *
 * "not_sure" is a real answer and is stored; skipping the field stores NULL.
 * The two are different triage signals and must not be flattened.
 */
export const CARE_LEVEL_OPTIONS = [
  { value: "mostly_independent", label: "Mostly independent" },
  { value: "needs_daily_help", label: "Needs daily help" },
  { value: "bedridden_or_high_care", label: "Bedridden or high care" },
  { value: "dementia_or_memory_care", label: "Dementia or memory care" },
  { value: "not_sure", label: "Not sure" },
] as const;

/** Required select. Constrained by care_enquiries_timing_check. */
export const TIMING_OPTIONS = [
  { value: "urgently", label: "Urgently" },
  { value: "within_3_months", label: "Within 3 months" },
  { value: "planning_ahead", label: "Planning ahead" },
] as const;

/**
 * Optional select. Constrained by care_enquiries_budget_band_check (nullable).
 *
 * The labels carry the peso sign and an en dash; the slugs do not, which is
 * exactly why the slugs are what reaches Postgres.
 */
export const BUDGET_BAND_OPTIONS = [
  { value: "under_20k", label: "Under ₱20,000" },
  { value: "20k_40k", label: "₱20,000–₱40,000" },
  { value: "40k_70k", label: "₱40,000–₱70,000" },
  { value: "over_70k", label: "Over ₱70,000" },
  { value: "not_sure", label: "Not sure" },
] as const;

/** True when `value` is one of the listed slugs. */
export function isOptionValue(
  options: readonly Option[],
  value: string,
): boolean {
  return options.some((option) => option.value === value);
}

/**
 * The label for a stored slug.
 *
 * Falls back to the raw value rather than an empty string: a row written under
 * a slug that has since been removed should still show something recognisable
 * in the founders' alert instead of a blank cell.
 */
export function labelFor(options: readonly Option[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? value;
}
