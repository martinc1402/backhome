import { scenarios } from "@/content/site";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Illustration } from "@/components/ui/illustration";

export function ScenariosSection() {
  return (
    <Section tone="base">
      <SectionHeading
        heading={scenarios.heading}
        intro={scenarios.intro}
        align="center"
      />

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
