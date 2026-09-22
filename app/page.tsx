import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { ProblemSection } from "@/components/problem-section";
import { ProcessSection } from "@/components/process-section";
import { CareTypesSection } from "@/components/care-types-section";
import { TrustSection } from "@/components/trust-section";
import { FounderSection } from "@/components/founder-section";
import { EnquirySection } from "@/components/enquiry-section";
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
        <ProblemSection />
        <ProcessSection />
        <CareTypesSection />
        <TrustSection />
        <FounderSection />
        <EnquirySection />
        <FinalCta />
      </main>

      <SiteFooter />
    </>
  );
}
