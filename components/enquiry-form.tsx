"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";

import { submitCareEnquiry } from "@/app/actions";
import { enquiry } from "@/content/site";
import { Button } from "@/components/ui/button";
import {
  BUDGET_BAND_OPTIONS,
  CARE_LEVEL_OPTIONS,
  CARE_TYPE_OPTIONS,
  PARENT_LOCATION_OPTIONS,
  TIMING_OPTIONS,
} from "@/lib/enquiry-options";
import {
  FIELD_ORDER,
  MAX_LENGTH,
  initialEnquiryState,
  type FieldName,
} from "@/lib/validate-enquiry";

/**
 * The five <select> fields, and their initial (unanswered) values.
 *
 * React 19 resets the form once a Server Action resolves. Text inputs ride that
 * out because the reset clears their dirty flag and they fall back to the
 * defaultValue we echo back from the server — but a <select> has no equivalent,
 * so it snaps to its placeholder and the user silently loses their choice.
 *
 * The previous pilot form had one select and kept one piece of state for it.
 * With five, that has to be a map: re-asserting only some of them would lose
 * the rest on any validation error, which is exactly when it hurts most.
 */
const SELECT_FIELDS = [
  "parentLocation",
  "careType",
  "careLevel",
  "timing",
  "budgetBand",
] as const;

type SelectField = (typeof SELECT_FIELDS)[number];

const NO_SELECTION: Record<SelectField, string> = {
  parentLocation: "",
  careType: "",
  careLevel: "",
  timing: "",
  budgetBand: "",
};

export function EnquiryForm() {
  const [state, formAction, pending] = useActionState(
    submitCareEnquiry,
    initialEnquiryState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // Controlled so their values survive the post-action re-render. See above.
  const [selects, setSelects] = useState<Record<SelectField, string>>(NO_SELECTION);

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};

  const errorId = `${formId}-error-summary`;
  const describe = (field: FieldName, hasHint: boolean) => {
    const ids = [];
    if (hasHint) ids.push(`${formId}-${field}-hint`);
    if (fieldErrors[field]) ids.push(`${formId}-${field}-error`);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  // Re-assert every select after each action result, for the reason above.
  useEffect(() => {
    if (state.status !== "error") return;

    for (const field of SELECT_FIELDS) {
      const select = formRef.current?.elements.namedItem(
        field,
      ) as HTMLSelectElement | null;

      if (select && select.value !== selects[field]) {
        select.value = selects[field];
      }
    }
  }, [state, selects]);

  // Move focus to the first invalid field so keyboard and screen reader users
  // are taken straight to what needs fixing.
  useEffect(() => {
    if (state.status !== "error") return;

    const firstInvalid = FIELD_ORDER.find((field) => state.fieldErrors[field]);
    if (!firstInvalid) return;

    formRef.current
      ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
      ?.focus();
  }, [state]);

  // Move focus to the confirmation once the submission succeeds.
  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        className="rounded-card border border-line-strong bg-cream p-8 text-center sm:p-14"
      >
        <span
          aria-hidden="true"
          className="mx-auto grid h-14 w-14 place-items-center rounded-pill bg-lime text-forest"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="type-h3 mt-7 text-forest">{enquiry.success.heading}</h3>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-bark">
          {enquiry.success.body}
        </p>
        <p className="mt-7 text-sm text-bark/80">{enquiry.success.footnote}</p>
      </div>
    );
  }

  const selectProps = (field: SelectField, hasHint = false) => ({
    id: `${formId}-${field}`,
    name: field,
    value: selects[field],
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
      setSelects((current) => ({ ...current, [field]: event.target.value })),
    "aria-invalid": Boolean(fieldErrors[field]),
    "aria-describedby": describe(field, hasHint),
    className: "field-input",
  });

  return (
    <form
      ref={formRef}
      action={formAction}
      // Server-side validation is authoritative; this stops the browser's own
      // bubbles from pre-empting our accessible, styled messages.
      noValidate
      className="rounded-card border border-line-strong bg-cream p-6 sm:p-10"
    >
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website`}>
          Do not fill this in
          <input
            id={`${formId}-website`}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {/* Announced to screen readers whenever a submission fails. */}
      <div aria-live="polite" role="status">
        {state.status === "error" ? (
          <p
            id={errorId}
            className="mb-7 rounded-sm border border-[#9a3412]/30 bg-[#fdf0e9] px-5 py-4 text-[0.9375rem] text-[#7c2d12]"
          >
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          formId={formId}
          name="fullName"
          label="Full name"
          error={fieldErrors.fullName}
        >
          <input
            id={`${formId}-fullName`}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={MAX_LENGTH.fullName}
            defaultValue={values.fullName ?? ""}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={describe("fullName", false)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="email"
          label="Email address"
          error={fieldErrors.email}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={MAX_LENGTH.email}
            defaultValue={values.email ?? ""}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={describe("email", false)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="phone"
          label="Phone or WhatsApp"
          optional
          hint="Include your country code, e.g. +61."
          error={fieldErrors.phone}
        >
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={MAX_LENGTH.phone}
            defaultValue={values.phone ?? ""}
            aria-invalid={Boolean(fieldErrors.phone)}
            aria-describedby={describe("phone", true)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="country"
          label="Country you currently live in"
          error={fieldErrors.country}
        >
          <input
            id={`${formId}-country`}
            name="country"
            type="text"
            autoComplete="country-name"
            required
            maxLength={MAX_LENGTH.country}
            defaultValue={values.country ?? ""}
            aria-invalid={Boolean(fieldErrors.country)}
            aria-describedby={describe("country", false)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="parentLocation"
          label="Where in Cebu is your parent?"
          error={fieldErrors.parentLocation}
        >
          <select {...selectProps("parentLocation")} required>
            <option value="" disabled>
              Choose an area…
            </option>
            {PARENT_LOCATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          formId={formId}
          name="careType"
          label="Type of care"
          error={fieldErrors.careType}
        >
          <select {...selectProps("careType")} required>
            <option value="" disabled>
              Choose an option…
            </option>
            {CARE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          formId={formId}
          name="careLevel"
          label="Level of care"
          optional
          error={fieldErrors.careLevel}
        >
          {/* Placeholder is NOT disabled on the optional selects: having chosen
              something, the user must be able to go back to "not answered".
              An empty value is stored as NULL; a chosen "Not sure" is stored as
              a real answer, and the founders' alert tells the two apart. */}
          <select {...selectProps("careLevel")}>
            <option value="">Not specified</option>
            {CARE_LEVEL_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          formId={formId}
          name="timing"
          label="Timing"
          error={fieldErrors.timing}
        >
          <select {...selectProps("timing")} required>
            <option value="" disabled>
              Choose an option…
            </option>
            {TIMING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          formId={formId}
          name="budgetBand"
          label="Monthly budget"
          optional
          error={fieldErrors.budgetBand}
        >
          <select {...selectProps("budgetBand")}>
            <option value="">Not specified</option>
            {BUDGET_BAND_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          formId={formId}
          name="situation"
          label="What is happening right now?"
          optional
          hint="A few sentences is plenty. Leave out anything you would rather discuss on a call."
          error={fieldErrors.situation}
          span
        >
          <textarea
            id={`${formId}-situation`}
            name="situation"
            rows={4}
            maxLength={MAX_LENGTH.situation}
            defaultValue={values.situation ?? ""}
            aria-invalid={Boolean(fieldErrors.situation)}
            aria-describedby={describe("situation", true)}
            className="field-input"
          />
        </Field>
      </div>

      <div className="mt-7 space-y-4 border-t border-line-strong pt-6">
        <Checkbox
          formId={formId}
          name="openToCall"
          defaultChecked={values.openToCall ?? false}
          label="I am open to a 20-minute call"
          hint="A short conversation about your parent and what would help. Entirely optional."
        />

        <Checkbox
          formId={formId}
          name="consent"
          defaultChecked={values.consent === "on"}
          required
          error={fieldErrors.consent}
          label="I agree to BackHome storing this information to find care options for my family."
          hint={
            <>
              Health details are optional and used only for this purpose. You
              can ask us to delete your details at any time. See our{" "}
              {/* Opens in a new tab deliberately: this sits mid-form, and a
                  same-tab navigation would discard everything already typed —
                  the form state is not persisted. The visually hidden note is
                  what keeps that honest for screen reader users. */}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline decoration-bark/40 underline-offset-2 hover:decoration-ink"
              >
                Privacy Policy
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </>
          }
        />
      </div>

      <div className="mt-8">
        <Button
          type="submit"
          variant="solid"
          size="lg"
          disabled={pending}
          aria-describedby={state.status === "error" ? errorId : undefined}
          className="w-full sm:w-auto"
        >
          {pending ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-cream/35 border-t-cream"
              />
              {enquiry.submittingLabel}
            </>
          ) : (
            enquiry.submitLabel
          )}
        </Button>

        <p className="mt-4 text-sm leading-relaxed text-bark">
          {enquiry.footnote}
        </p>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */

type FieldProps = {
  formId: string;
  name: FieldName;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  /** Full width on the two-column desktop grid. */
  span?: boolean;
  children: React.ReactNode;
};

function Field({
  formId,
  name,
  label,
  hint,
  optional = false,
  error,
  span = false,
  children,
}: FieldProps) {
  return (
    <div className={span ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={`${formId}-${name}`}
        className="mb-1.5 block text-[0.9375rem] text-ink"
      >
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-bark/80">(optional)</span>
        ) : null}
      </label>

      {hint ? (
        <p id={`${formId}-${name}-hint`} className="mb-2 text-sm text-bark">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p
          id={`${formId}-${name}-error`}
          className="mt-1.5 flex items-start gap-1.5 text-sm text-[#7c2d12]"
        >
          <span aria-hidden="true">↑</span>
          {error}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxProps = {
  formId: string;
  name: string;
  label: string;
  /** ReactNode, not string: the consent hint carries a link. Note the hint is
      rendered OUTSIDE the <label>, so a link in it cannot toggle the box. */
  hint?: React.ReactNode;
  required?: boolean;
  defaultChecked?: boolean;
  error?: string;
};

function Checkbox({
  formId,
  name,
  label,
  hint,
  required = false,
  defaultChecked = false,
  error,
}: CheckboxProps) {
  const hintId = hint ? `${formId}-${name}-hint` : undefined;
  const errorId = error ? `${formId}-${name}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={`${formId}-${name}`}
          name={name}
          type="checkbox"
          required={required}
          defaultChecked={defaultChecked}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border border-line-strong accent-forest"
        />
        <div>
          <label
            htmlFor={`${formId}-${name}`}
            className="block text-[0.9375rem] leading-snug text-ink"
          >
            {label}
          </label>
          {hint ? (
            <p id={hintId} className="mt-1 text-sm leading-relaxed text-bark">
              {hint}
            </p>
          ) : null}
        </div>
      </div>

      {error ? (
        <p id={errorId} className="mt-1.5 pl-8 text-sm text-[#7c2d12]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
