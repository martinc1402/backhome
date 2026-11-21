import Link from "next/link";

import { founder, providersCard } from "@/content/site";

export function FounderAndProviders() {
  return (
    <section className="bg-base pb-20 sm:pb-28">
      <div className="mx-auto grid w-full max-w-6xl gap-5 px-5 sm:px-8 lg:grid-cols-[1.75fr_1fr]">
        {/* Text only until a real founder portrait is supplied. */}
        <div className="rounded-card border border-line bg-cream p-6 sm:p-10">
          <p className="type-label tracking-[0.16em] text-moss uppercase">{founder.eyebrow}</p>
          <h2 className="type-h3 mt-4 text-forest">{founder.heading}</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-bark">{founder.body}</p>
        </div>

        <div className="flex flex-col rounded-card bg-sand/40 p-6 sm:p-8">
          <p className="type-label tracking-[0.16em] text-moss uppercase">{providersCard.eyebrow}</p>
          <h2 className="type-h3 mt-4 text-forest">{providersCard.heading}</h2>
          <p className="mt-4 leading-relaxed text-bark">{providersCard.body}</p>
          <div className="mt-auto pt-7">
            <Link
              href={providersCard.cta.href}
              className="inline-flex min-h-11 items-center justify-center rounded-pill border border-forest px-6 text-sm text-forest hover:bg-forest hover:text-cream motion-safe:transition-colors"
            >
              {providersCard.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
