import type { ReactNode } from "react";
import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Shared layout for the legal documents. A route group, so /privacy and /terms
 * keep their URLs while getting a layout the marketing homepage never sees.
 *
 * `standalone` on the header is required, not cosmetic: without it the header
 * flips to its transparent, cream-on-cream state on a page with no hero. See
 * components/site-header.tsx.
 */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-forest px-5 py-3 text-cream focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:not-sr-only"
      >
        Skip to main content
      </a>

      <SiteHeader standalone />

      {/* bg-cream rather than the body's bg-base: these are documents, and the
          brighter surface separates them from the marketing pages.
          pt clears the fixed header — it is ~84px tall at its widest. */}
      <main
        id="main"
        className="flex-1 bg-cream px-5 pt-32 pb-24 md:px-8 md:pt-40 md:pb-32"
      >
        <div className="mx-auto max-w-[68ch]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.9375rem] text-forest/75 underline decoration-forest/25 underline-offset-4 hover:text-forest hover:decoration-forest"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>

          <div className="mt-10">{children}</div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
