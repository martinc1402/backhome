import Link from "next/link";

import { guidesSection } from "@/content/site";
import { getGuide } from "@/content/guides";
import { SectionHeading } from "@/components/ui/section-heading";

export function GuidesSection() {
  const guides = guidesSection.featured.map((slug) => getGuide(slug)!);

  return (
    <section id="guides" className="scroll-mt-24 bg-base py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={guidesSection.eyebrow} heading={guidesSection.heading} />
          <Link
            href={guidesSection.all.href}
            className="text-sm text-forest underline underline-offset-4"
          >
            {guidesSection.all.label} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <ul className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group block">
                <div
                  aria-hidden="true"
                  className="aspect-[3/2] rounded-sm bg-moss/15 motion-safe:transition-colors group-hover:bg-moss/25"
                />
                <p className="mt-4 text-xs text-bark">{g.topic}</p>
                <h3 className="mt-1 font-serif text-xl leading-snug text-forest group-hover:underline group-hover:underline-offset-4">
                  {g.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-bark">{g.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
