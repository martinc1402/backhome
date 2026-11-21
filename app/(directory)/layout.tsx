import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/**
 * Layout for the inner pages (directory, guides, help, providers). A route
 * group, so the URLs carry no prefix. `standalone` keeps the header solid on
 * pages with no hero — see components/site-header.tsx.
 */
export default function DirectoryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-forest px-5 py-3 text-cream focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:not-sr-only"
      >
        Skip to main content
      </a>

      <SiteHeader standalone />

      {/* pt clears the fixed header. */}
      <main id="main" className="flex-1 bg-base pt-28 pb-24 sm:pt-32 sm:pb-32">
        {children}
      </main>

      <SiteFooter />
    </>
  );
}
