"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";

import { submitPilotInterest } from "@/app/actions";
import { interest } from "@/content/site";
import { Button } from "@/components/ui/button";
import {
  FIELD_ORDER,
  MAX_LENGTH,
  SERVICE_OPTIONS,
  initialInterestState,
  type FieldName,
} from "@/lib/validate-interest";

export function InterestForm() {
  const [state, formAction, pending] = useActionState(
    submitPilotInterest,
    initialInterestState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formId = useId();

  // The select is controlled so its value survives re-renders.
  const [service, setService] = useState("");

  const fieldErrors = state.status === "error" ? state.fieldErrors : {};
  const values = state.status === "error" ? state.values : {};

  const errorId = `${formId}-error-summary`;
  const describe = (field: FieldName, hasHint: boolean) => {
    const ids = [];
    if (hasHint) ids.push(`${formId}-${field}-hint`);
    if (fieldErrors[field]) ids.push(`${formId}-${field}-error`);
    return ids.length > 0 ? ids.join(" ") : undefined;
  };

  // React 19 resets the form once a Server Action resolves. Text inputs ride
  // that out because the reset clears their dirty flag and they fall back to
  // the defaultValue we echo back from the server — but a <select> has no
  // equivalent, so it snaps to the disabled placeholder and the user silently
  // loses their choice. Re-assert it after every action result.
  useEffect(() => {
    if (state.status !== "error") return;

    const select = formRef.current?.elements.namedItem(
      "firstService",
    ) as HTMLSelectElement | null;

    if (select && select.value !== service) select.value = service;
  }, [state, service]);

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
        <h3 className="type-h3 mt-7 text-forest">{interest.success.heading}</h3>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-bark">
          {interest.success.body}
        </p>
        <p className="mt-7 text-sm text-bark/80">{interest.success.footnote}</p>
      </div>
    );
  }

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
          describedBy={describe("fullName", false)}
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
          describedBy={describe("email", false)}
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
          label="Phone or WhatsApp number"
          optional
          hint="Include your country code, e.g. +61."
          error={fieldErrors.phone}
          describedBy={describe("phone", true)}
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
          describedBy={describe("country", false)}
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
          name="cebuLocation"
          label="Where in Cebu does your family or property need support?"
          hint="A city, town or barangay is enough."
          error={fieldErrors.cebuLocation}
          describedBy={describe("cebuLocation", true)}
          span
        >
          <input
            id={`${formId}-cebuLocation`}
            name="cebuLocation"
            type="text"
            required
            maxLength={MAX_LENGTH.cebuLocation}
            defaultValue={values.cebuLocation ?? ""}
            aria-invalid={Boolean(fieldErrors.cebuLocation)}
            aria-describedby={describe("cebuLocation", true)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="whoYouHelp"
          label="Who do you currently help in Cebu?"
          hint="For example: my mother and my aunt, or my parents and our family home."
          error={fieldErrors.whoYouHelp}
          describedBy={describe("whoYouHelp", true)}
          span
        >
          <input
            id={`${formId}-whoYouHelp`}
            name="whoYouHelp"
            type="text"
            required
            maxLength={MAX_LENGTH.whoYouHelp}
            defaultValue={values.whoYouHelp ?? ""}
            aria-invalid={Boolean(fieldErrors.whoYouHelp)}
            aria-describedby={describe("whoYouHelp", true)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="recentSituation"
          label="What is one recent situation that was difficult to manage from overseas?"
          optional
          hint="This is the most useful thing you can tell us — a few sentences is plenty."
          error={fieldErrors.recentSituation}
          describedBy={describe("recentSituation", true)}
          span
        >
          <textarea
            id={`${formId}-recentSituation`}
            name="recentSituation"
            rows={4}
            maxLength={MAX_LENGTH.recentSituation}
            defaultValue={values.recentSituation ?? ""}
            aria-invalid={Boolean(fieldErrors.recentSituation)}
            aria-describedby={describe("recentSituation", true)}
            className="field-input"
          />
        </Field>

        <Field
          formId={formId}
          name="firstService"
          label="Which service would you be most likely to use first?"
          error={fieldErrors.firstService}
          describedBy={describe("firstService", false)}
          span
        >
          <select
            id={`${formId}-firstService`}
            name="firstService"
            required
            value={service}
            onChange={(event) => setService(event.target.value)}
            aria-invalid={Boolean(fieldErrors.firstService)}
            aria-describedby={describe("firstService", false)}
            className="field-input"
          >
            <option value="" disabled>
              Choose a service…
            </option>
            {SERVICE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-7 space-y-4 border-t border-line-strong pt-6">
        <Checkbox
          formId={formId}
          name="researchCall"
          defaultChecked={values.researchCall ?? false}
          label="I would be open to a short research call"
          hint="A 20-minute conversation about what would actually help. Entirely optional."
        />

        <Checkbox
          formId={formId}
          name="consent"
          defaultChecked={values.consent === "on"}
          required
          error={fieldErrors.consent}
          label="I agree to be contacted about the BackHome pilot"
          hint="We will only use your details to talk to you about the pilot. No marketing lists, and you can ask us to delete your details at any time."
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
              {interest.submittingLabel}
            </>
          ) : (
            interest.submitLabel
          )}
        </Button>

        <p className="mt-4 text-sm leading-relaxed text-bark">
          {interest.footnote}
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
  describedBy?: string;
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
  hint?: string;
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
        <p
          id={errorId}
          className="mt-1.5 pl-8 text-sm text-[#7c2d12]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
