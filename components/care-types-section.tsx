import { careTypes } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Illustration } from "@/components/ui/illustration";
import { Icon } from "@/components/ui/icon";

export function CareTypesSection() {
  return (
    <Section id="care-types" tone="base">
      <SectionHeading
        eyebrow="Care types"
        heading={careTypes.heading}
        intro={careTypes.intro}
      />

      {/* Two across rather than four: these titles run to "Nursing homes and
          assisted living", which wraps to three lines in a quarter-width column
          at the h4 size. Four tiles in a 2x2 keeps the card width the six
          services had. Deliberately <li>, not <a> — there are no listing pages
          yet and a tile that goes nowhere is worse than one that plainly does
          not move. */}
      <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20">
        {careTypes.cards.map((card) => (
          <li
            key={card.title}
            className="flex flex-col rounded-card border border-line bg-cream p-7 motion-safe:transition-colors hover:border-line-strong"
          >
            <Illustration name={card.icon} className="h-18 w-24" />
            <h3 className="type-h4 mt-6 text-forest">{card.title}</h3>
            <p className="mt-3 leading-relaxed text-bark">{card.body}</p>
          </li>
        ))}
      </ul>

      {/* Deliberately prominent, not a footnote — this boundary matters. */}
      <div className="mt-10 flex items-start gap-4 rounded-card border border-brown/25 bg-sand/40 p-6 sm:p-8">
        <span className="mt-0.5 shrink-0 text-brown">
          <Icon name="warning" className="h-6 w-6" />
        </span>
        <p className="leading-relaxed text-ink">{careTypes.disclaimer}</p>
      </div>
    </Section>
  );
}
