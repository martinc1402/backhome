import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Situations } from "@/components/home/situations";
import { HowWeCheck } from "@/components/home/how-we-check";
import { RecentlyChecked } from "@/components/home/recently-checked";
import { PaidHelp } from "@/components/home/paid-help";
import { GuidesSection } from "@/components/home/guides-section";
import { FounderAndProviders } from "@/components/home/founder-and-providers";
import { ClosingBand } from "@/components/home/closing-band";

// The provider count and "Recently checked" depend on today's date (checks
// lapse after six months), so regenerate daily. Must be a literal.
export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-forest px-5 py-3 text-cream focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:not-sr-only"
      >
        Skip to main content
      </a>

      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <TrustStrip />
        <CategoryTiles />
        <Situations />
        <HowWeCheck />
        <RecentlyChecked />
        <PaidHelp />
        <GuidesSection />
        <FounderAndProviders />
        <ClosingBand />
      </main>

      <SiteFooter />
    </>
  );
}
