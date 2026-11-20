import Link from "next/link";

import { situations } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";

export function Situations() {
  return (
    <section className="bg-base pb-20 sm:pb-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={situations.eyebrow} heading={situations.heading} />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {situations.cards.map((card) => (
            <li key={card.title}>
              <Link
                href={`/guides/${card.guide}`}
                className="group flex h-full flex-col rounded-sm border border-line bg-cream p-5 shadow-card motion-safe:transition-shadow hover:shadow-lift"
              >
                <h3 className="font-serif text-xl leading-snug text-forest">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bark">{card.body}</p>
                <span className="mt-auto pt-5 text-sm text-forest">
                  {situations.cta}{" "}
                  <span aria-hidden="true" className="inline-block motion-safe:transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
