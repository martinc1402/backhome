import { interest } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { InterestForm } from "@/components/interest-form";

/**
 * The primary conversion section. Server-rendered shell around the form, which
 * is the only client component on the page besides the header.
 */
export function InterestSection() {
  return (
    <Section id="join" tone="base">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Pilot interest"
          heading={interest.heading}
          intro={interest.intro}
          align="center"
        />

        <div className="mt-14">
          <InterestForm />
        </div>

        {/* Sits outside InterestForm so it stays visible after submission.
            Sand tint matches the services disclaimer — on this page, a warm
            tinted block consistently means "boundary or caveat". */}
        <div className="mt-8 rounded-card border border-brown/25 bg-sand/40 p-6 sm:p-8">
          <h3 className="type-label font-sans tracking-[0.16em] text-brown uppercase">
            {interest.stillDeciding.label}
          </h3>
          <dl className="mt-5 grid gap-6 sm:grid-cols-2 sm:gap-8">
            {interest.stillDeciding.items.map((item) => (
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
