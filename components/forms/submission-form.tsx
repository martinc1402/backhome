"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import {
  FIELDS,
  HONEYPOT_FIELD,
  STARTED_AT_FIELD,
  normalise,
  validate,
  type FieldErrors,
  type FormKind,
  type FormResponse,
  type FormValues,
} from "@/lib/forms/schema";

/* ---------------------------------------------------------------------------
   One client component for both public forms. Fields come from
   lib/forms/schema.ts, so the browser and the API validate identically.

   Success is shown ONLY when the API confirms the email was sent. Anything
   else keeps what the person typed and shows an error naming our address.
--------------------------------------------------------------------------- */

type Rule = {
  label: string;
  required: boolean;
  max: number;
  options?: readonly { value: string; label: string }[];
  kind?: "email" | "phone" | "url" | "multiline";
};

type Props = {
  kind: FormKind;
  /** Field order and per-field help text. */
  fields: { name: string; hint?: string; placeholder?: string }[];
  submitLabel: string;
  privacyNote: ReactNode;
  success: { heading: string; body: string };
  /** Extra JSON sent with the submission, e.g. the listing it came from. */
  extra?: Record<string, string>;
  /** Shown above the fields, e.g. "About: [provider]". */
  intro?: ReactNode;
};

const CONTACT = "hello@backhome.ph";

export function SubmissionForm({
  kind,
  fields,
  submitLabel,
  privacyNote,
  success,
  extra,
  intro,
}: Props) {
  const rules = FIELDS[kind] as Record<string, Rule>;
  const id = useId();
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  // When the form first appeared. Submissions faster than a human could type
  // are dropped on the server.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function focusFirstError(errs: FieldErrors) {
    const first = fields.find((f) => errs[f.name]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = new FormData(event.currentTarget);
    const raw: FormValues = {};
    for (const f of fields) raw[f.name] = String(form.get(f.name) ?? "");
    const clean = normalise(kind, raw);

    const errs = validate(kind, clean);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("error");
      setMessage("Please check the highlighted fields.");
      focusFirstError(errs);
      return;
    }

    setStatus("sending");
    setMessage("");

    let result: FormResponse;
    try {
      const response = await fetch(`/api/forms/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...clean,
          ...extra,
          [HONEYPOT_FIELD]: String(form.get(HONEYPOT_FIELD) ?? ""),
          [STARTED_AT_FIELD]: String(startedAt.current),
        }),
      });
      result = (await response.json()) as FormResponse;
    } catch {
      result = {
        ok: false,
        message: `Sorry, we couldn't reach our server, so your message was not sent. Please check your connection and try again, or email us at ${CONTACT}.`,
      };
    }

    if (result.ok) {
      setStatus("sent");
      return;
    }

    setStatus("error");
    setMessage(result.message);
    if (result.fieldErrors) {
      setErrors(result.fieldErrors);
      focusFirstError(result.fieldErrors);
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-card border border-moss/30 bg-lime/30 p-6 sm:p-8">
        <h2 className="type-h3 text-forest">{success.heading}</h2>
        <p className="mt-3 leading-relaxed text-ink">{success.body}</p>
        <p className="mt-4 text-sm text-bark">
          If you need to add anything, email us at{" "}
          <a href={`mailto:${CONTACT}`} className="text-forest underline underline-offset-4">
            {CONTACT}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="rounded-card border border-line bg-cream p-5 sm:p-8"
    >
      <noscript>
        <p className="mb-6 rounded-sm bg-sand/50 p-4 text-sm text-brown">
          This form needs JavaScript. You can email us instead at {CONTACT}.
        </p>
      </noscript>

      {intro}

      <div className="space-y-6">
        {fields.map((f) => {
          const rule = rules[f.name];
          const fieldId = `${id}-${f.name}`;
          const errorId = `${fieldId}-error`;
          const hintId = `${fieldId}-hint`;
          const error = errors[f.name];
          const describedBy = [f.hint ? hintId : null, error ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined;

          const common = {
            id: fieldId,
            name: f.name,
            required: rule.required,
            maxLength: rule.max,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            className: "field-input mt-2",
            // Uncontrolled: what the person typed stays put through errors.
            defaultValue: "",
          };

          return (
            <div key={f.name}>
              <label htmlFor={fieldId} className="text-forest">
                {rule.label}
                {rule.required ? null : <span className="text-bark"> (optional)</span>}
              </label>
              {f.hint ? (
                <p id={hintId} className="mt-1 text-sm text-bark">
                  {f.hint}
                </p>
              ) : null}

              {rule.options ? (
                <select {...common}>
                  <option value="" disabled>
                    Choose one
                  </option>
                  {rule.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              ) : rule.kind === "multiline" ? (
                <textarea {...common} rows={5} placeholder={f.placeholder} />
              ) : (
                <input
                  {...common}
                  type={rule.kind === "email" ? "email" : rule.kind === "phone" ? "tel" : "text"}
                  inputMode={rule.kind === "url" ? "url" : undefined}
                  autoComplete={
                    f.name === "name" || f.name === "contactName"
                      ? "name"
                      : rule.kind === "email"
                        ? "email"
                        : rule.kind === "phone"
                          ? "tel"
                          : f.name === "country"
                            ? "country-name"
                            : f.name === "businessName"
                              ? "organization"
                              : "off"
                  }
                  placeholder={f.placeholder}
                />
              )}

              {error ? (
                <p id={errorId} className="mt-2 text-sm text-[#9a3412]">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}

        {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={`${id}-${HONEYPOT_FIELD}`}>Leave this empty</label>
          <input
            id={`${id}-${HONEYPOT_FIELD}`}
            type="text"
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </div>
      </div>

      {status === "error" && message ? (
        <p role="alert" className="mt-8 rounded-sm border border-[#9a3412]/30 bg-[#fdf5f1] p-4 text-sm text-[#9a3412]">
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 inline-flex min-h-14 w-full items-center justify-center rounded-pill bg-forest px-8 text-cream hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto motion-safe:transition-colors"
      >
        {status === "sending" ? "Sending…" : submitLabel}
      </button>

      <p className="mt-5 text-sm leading-relaxed text-bark">
        {privacyNote}{" "}
        <Link href="/privacy" className="text-forest underline underline-offset-4">
          Privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
