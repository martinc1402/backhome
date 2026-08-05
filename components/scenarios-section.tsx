import { scenarios } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Illustration } from "@/components/ui/illustration";

export function ScenariosSection() {
  return (
    <Section tone="base">
      {/* Was a full-bleed lime band under the hero. Restated as a quiet line on
          the cream field so lime stays an accent rather than a surface.
          font-serif is explicit: type-h4 sets size only, and this is a <p>. */}
      <p className="type-h4 mx-auto max-w-3xl text-center font-serif text-forest">
        {scenarios.lead}
      </p>

      {/* Roughly the height the removed band occupied, so the rhythm between
          the hero and this heading is unchanged. */}
      <div className="mt-20 sm:mt-24">
        <SectionHeading
          heading={scenarios.heading}
          intro={scenarios.intro}
          align="center"
        />
      </div>

      <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {scenarios.cards.map((card) => (
          <li
            key={card.title}
            className="flex flex-col rounded-card border border-line bg-cream p-7 motion-safe:transition-colors hover:border-line-strong"
          >
            <Illustration name={card.icon} className="h-20 w-28" />
            {/* Smaller than the service cards: these titles are full sentences
                and would wrap to four or five lines at the h4 size. */}
            <h3 className="mt-7 font-serif text-2xl leading-snug tracking-[-0.02em] text-forest">
              {card.title}
            </h3>
            <p className="mt-4 leading-relaxed text-bark">{card.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
