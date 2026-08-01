import { process } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * Process steps carrying the giant-numeral treatment borrowed from the
 * huts.com stats band — the reference uses 148px serif figures there. Since
 * BackHome has no statistics to show, the numerals do honest work as step
 * markers instead.
 */
export function ProcessSection() {
  return (
    <Section id="how-it-works" tone="cream">
      <SectionHeading eyebrow="How it could work" heading={process.heading} />

      <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10 lg:mt-24">
        {process.steps.map((step) => (
          <li key={step.number} className="border-t border-line-strong pt-8">
            <span
              aria-hidden="true"
              className="type-mega block font-serif text-moss/35"
            >
              {step.number}
            </span>
            <h3 className="type-h4 mt-4 text-forest">
              <span className="sr-only">Step {step.number}: </span>
              {step.title}
            </h3>
            <p className="mt-4 leading-relaxed text-bark">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-16 max-w-2xl text-sm leading-relaxed text-bark">
        {process.note}
      </p>
    </Section>
  );
}
