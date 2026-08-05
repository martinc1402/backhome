import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ScenariosSection } from "@/components/scenarios-section";
import { ProcessSection } from "@/components/process-section";
import { ServicesSection } from "@/components/services-section";
import { TrustSection } from "@/components/trust-section";
import { FounderSection } from "@/components/founder-section";
import { InterestSection } from "@/components/interest-section";
import { FinalCta } from "@/components/final-cta";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-full bg-forest px-5 py-3 text-cream focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-100 focus-visible:not-sr-only"
      >
        Skip to main content
      </a>

      <div id="top" />
      <SiteHeader />

      <main id="main" className="flex-1">
        <Hero />
        <ScenariosSection />
        <ProcessSection />
        <ServicesSection />
        <TrustSection />
        <FounderSection />
        <InterestSection />
        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}
