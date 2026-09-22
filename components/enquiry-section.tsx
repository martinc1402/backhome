import { enquiry } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { EnquiryForm } from "@/components/enquiry-form";

/**
 * The primary conversion section. Server-rendered shell around the form, which
 * is the only client component on the page besides the header.
 *
 * The id is the anchor every "Get a shortlist" and "Tell us about your parent"
 * button on the page points at — see content/site.ts.
 */
export function EnquirySection() {
  return (
    <Section id="get-a-shortlist" tone="base">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Get a shortlist"
          heading={enquiry.heading}
          intro={enquiry.intro}
          align="center"
        />

        <div className="mt-14">
          <EnquiryForm />
        </div>

        {/* Sits outside EnquiryForm so it stays visible after submission.
            Sand tint matches the care-types disclaimer — on this page, a warm
            tinted block consistently means "boundary or caveat". */}
        <div className="mt-8 rounded-card border border-brown/25 bg-sand/40 p-6 sm:p-8">
          <h3 className="type-label font-sans tracking-[0.16em] text-brown uppercase">
            {enquiry.practicalities.label}
          </h3>
          <dl className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
            {enquiry.practicalities.items.map((item) => (
              <div key={item.title}>
                <dt className="font-serif text-lg text-forest">{item.title}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-bark">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
