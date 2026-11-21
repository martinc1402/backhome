"use client";

import { useSearchParams } from "next/navigation";

import { SubmissionForm } from "@/components/forms/submission-form";
import { helpPage as copy } from "@/content/pages";

const FIELDS = [
  { name: "name" },
  { name: "email", hint: "We'll reply to this address." },
  { name: "whatsapp", placeholder: "+971 50 123 4567" },
  { name: "country", placeholder: "e.g. Australia, UAE, Canada" },
  { name: "parentArea" },
  { name: "need" },
  {
    name: "happening",
    hint: "A few sentences is plenty. Please don't include medical details.",
  },
];

/** The /help form. `providerSlug` is set when someone came from a listing. */
export function HelpFormFields({
  providerSlug,
  providerName,
}: {
  providerSlug?: string;
  providerName?: string;
}) {
  return (
    <SubmissionForm
      kind="help"
      fields={FIELDS}
      submitLabel={copy.form.submit}
      privacyNote={copy.form.privacy}
      success={copy.form.success}
      extra={providerSlug ? { provider: providerSlug } : undefined}
      intro={
        providerName ? (
          <p className="mb-6 rounded-sm bg-lime/30 px-4 py-3 text-sm text-forest">
            {copy.form.fromListing} <span className="font-serif text-[1.0625rem]">{providerName}</span>.
          </p>
        ) : null
      }
    />
  );
}

/** Reads ?provider= and passes it on, if it names a known listing. */
export function HelpForm({ providerNames }: { providerNames: Record<string, string> }) {
  const slug = useSearchParams().get("provider") ?? "";
  const name = providerNames[slug];

  return name ? <HelpFormFields providerSlug={slug} providerName={name} /> : <HelpFormFields />;
}
