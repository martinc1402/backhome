import type { Metadata } from "next";
import Link from "next/link";

import { levelPill } from "@/components/home/how-we-check";
import { Icon } from "@/components/ui/icon";
import { howWeCheckPage as copy } from "@/content/pages";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/how-we-check" },
};

export default function HowWeCheckPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
      <header>
        <p className="type-label tracking-[0.16em] text-moss uppercase">{copy.eyebrow}</p>
        <h1 className="type-h2 mt-5 text-forest">{copy.heading}</h1>
        <p className="mt-5 text-lg leading-relaxed text-bark">{copy.intro}</p>
      </header>

      <ol className="mt-12 space-y-5">
        {copy.levels.map((l) => (
          <li key={l.level} className="rounded-card border border-line bg-cream p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-pill px-3 py-1 text-sm ${levelPill[l.level]}`}>
                {l.label}
              </span>
              <h2 className="type-h4 text-forest">{l.title}</h2>
            </div>
            <p className="mt-4 leading-relaxed text-bark">{l.body}</p>
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <h2 className="type-h3 text-forest">{copy.documents.heading}</h2>
        <p className="mt-4 leading-relaxed text-bark">{copy.documents.intro}</p>
        <ul className="mt-5 space-y-2.5">
          {copy.documents.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-ink">
              <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-bark">{copy.documents.note}</p>
      </section>

      <section className="mt-16">
        <h2 className="type-h3 text-forest">{copy.lifecycle.heading}</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {copy.lifecycle.items.map((item) => (
            <li key={item.title} className="border-t border-line-strong pt-5">
              <h3 className="text-lg text-forest">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-5 md:grid-cols-2">
        <div className="rounded-card bg-sand/40 p-6 sm:p-8">
          <h2 className="type-h4 text-forest">{copy.limits.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-bark">{copy.limits.body}</p>
        </div>
        <div className="rounded-card bg-sand/40 p-6 sm:p-8">
          <h2 className="type-h4 text-forest">{copy.money.heading}</h2>
          <p className="mt-3 text-sm leading-relaxed text-bark">{copy.money.body}</p>
        </div>
      </section>

      <section className="on-dark mt-16 rounded-card bg-forest p-6 text-cream sm:p-10">
        <h2 className="type-h3 text-cream">{copy.report.heading}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-cream/85">{copy.report.body}</p>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <a
            href={`mailto:${site.contactEmail}?subject=${encodeURIComponent("Report a problem")}`}
            className="underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
          >
            {site.contactEmail}
          </a>
          <Link
            href="/#find-care"
            className="underline decoration-cream/40 underline-offset-4 hover:decoration-cream"
          >
            Browse the directory
          </Link>
        </p>
      </section>
    </div>
  );
}
