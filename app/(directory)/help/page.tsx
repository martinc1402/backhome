import type { Metadata } from "next";
import { Suspense } from "react";

import { HelpForm, HelpFormFields } from "@/components/forms/help-form";
import { helpPage as copy } from "@/content/pages";
import { allListings } from "@/lib/directory";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/help" },
};

export default function HelpPage() {
  // Lets the form say which listing someone came from (/help?provider=slug)
  // without making this page dynamic: the lookup happens in the browser.
  const providerNames = Object.fromEntries(allListings().map((l) => [l.slug, l.name]));

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <header className="max-w-3xl">
        <p className="type-label tracking-[0.16em] text-moss uppercase">{copy.eyebrow}</p>
        <h1 className="type-h2 mt-5 text-forest">{copy.heading}</h1>
        <p className="mt-5 text-lg leading-relaxed text-bark">{copy.intro}</p>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="space-y-10">
          <section>
            <h2 className="type-h4 text-forest">{copy.offer.heading}</h2>
            <ol className="mt-5 space-y-5">
              {copy.offer.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sm text-forest"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-forest">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-bark">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="type-h4 text-forest">{copy.offer.ongoingHeading}</h2>
            <ul className="mt-4 space-y-2.5">
              {copy.offer.ongoing.map((item) => (
                <li key={item} className="flex items-start gap-3 text-ink">
                  <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-card bg-forest p-6 text-cream sm:p-8">
            <p className="font-serif text-2xl">{copy.offer.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-cream/80">{copy.offer.priceNote}</p>
          </section>

          <section>
            <h2 className="type-h4 text-forest">{copy.next.heading}</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-bark marker:text-moss">
              {copy.next.steps.map((s) => (
                <li key={s} className="pl-1 leading-relaxed">
                  {s}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <section aria-labelledby="help-form-heading">
          <h2 id="help-form-heading" className="type-h3 mb-5 text-forest">
            {copy.form.heading}
          </h2>
          {/* Suspense: the form reads ?provider= with useSearchParams. The
              fallback is the same form without that note. */}
          <Suspense fallback={<HelpFormFields />}>
            <HelpForm providerNames={providerNames} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
