import type { Metadata } from "next";

import { renderLegalDoc } from "@/lib/legal-doc";

export const metadata: Metadata = {
  title: "Terms of Use — BackHome",
  description:
    "The terms for using the BackHome directory of elder care services in Cebu, the forms, and our paid help service.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

export default async function TermsPage() {
  const html = await renderLegalDoc("terms");

  // No chrome cross-link here: the document itself ends with a link to the
  // privacy policy, and duplicating it would be noise.
  return (
    <article
      className="legal-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
