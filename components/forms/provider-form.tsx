"use client";

import { SubmissionForm } from "@/components/forms/submission-form";
import { providersPage as copy } from "@/content/pages";

const FIELDS = [
  { name: "businessName" },
  { name: "contactName" },
  { name: "email", hint: "We'll reply to this address." },
  { name: "phone", placeholder: "+63 917 123 4567" },
  { name: "category" },
  { name: "area" },
  { name: "website", placeholder: "facebook.com/yourpage" },
  {
    name: "description",
    hint: "What you offer, who you help, and roughly what it costs.",
  },
];

export function ProviderForm() {
  return (
    <SubmissionForm
      kind="provider"
      fields={FIELDS}
      submitLabel={copy.form.submit}
      privacyNote={copy.form.privacy}
      success={copy.form.success}
    />
  );
}
