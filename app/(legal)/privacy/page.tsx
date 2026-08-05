import type { Metadata } from "next";
import Link from "next/link";

import { renderLegalDoc } from "@/lib/legal-doc";

export const metadata: Metadata = {
  title: "Privacy Policy — BackHome",
  description:
    "How BackHome collects, uses and protects personal information during the Cebu pilot, and how to access, correct or delete your details.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default async function PrivacyPage() {
  const html = await renderLegalDoc("privacy");

  return (
    <>
      {/* Content is committed markdown, never user input — see lib/legal-doc.ts. */}
      <article
        className="legal-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Cross-link as page chrome, deliberately OUTSIDE the article. The
          privacy document contains no link to the terms, and adding one inline
          would mean editing legal copy. The terms document ends with its own
          link back here, so it needs no equivalent. */}
      <p className="mt-16 border-t border-line-strong pt-8 text-[0.9375rem] text-forest/75">
        See also our{" "}
        <Link
          href="/terms"
          className="text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
        >
          Terms of Use
        </Link>
        .
      </p>
    </>
  );
}
