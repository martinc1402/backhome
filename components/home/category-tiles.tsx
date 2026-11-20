import Link from "next/link";

import { findCare } from "@/content/site";
import { CATEGORIES } from "@/content/directory/taxonomy";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * All eight groups. Launch groups link to their category page; Phase 2 groups
 * are deliberately not links — a tile that leads nowhere is worse than one
 * that plainly says it is coming.
 */
export function CategoryTiles() {
  return (
    <section id="find-care" className="scroll-mt-24 bg-base py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={findCare.eyebrow} heading={findCare.heading} />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const soon = c.phase === "coming-soon";
            const body = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${
                      soon ? "bg-moss/10 text-moss/70" : "bg-lime/60 text-forest"
                    }`}
                  >
                    <Icon name={c.icon} className="h-5 w-5" />
                  </span>
                  {soon ? (
                    <span className="rounded-pill border border-line-strong px-2.5 py-0.5 text-[0.6875rem] text-bark">
                      {findCare.comingSoon}
                    </span>
                  ) : null}
                </div>
                <h3 className={`mt-5 font-serif text-xl leading-snug ${soon ? "text-forest/70" : "text-forest"}`}>
                  {c.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bark">{c.blurb}</p>
              </>
            );

            return (
              <li key={c.slug}>
                {soon ? (
                  <div className="h-full rounded-sm border border-dashed border-line-strong bg-base p-5">
                    {body}
                  </div>
                ) : (
                  <Link
                    href={`/cebu/${c.slug}`}
                    className="block h-full rounded-sm border border-line bg-cream p-5 shadow-card motion-safe:transition-shadow hover:shadow-lift"
                  >
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
