import type { Metadata } from "next";

import { ProviderForm } from "@/components/forms/provider-form";
import { providersPage as copy } from "@/content/pages";

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: { canonical: "/for-providers" },
};

export default function ForProvidersPage() {
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
            <h2 className="type-h4 text-forest">{copy.who.heading}</h2>
            <p className="mt-3 leading-relaxed text-bark">{copy.who.body}</p>
          </section>

          <section>
            <h2 className="type-h4 text-forest">{copy.how.heading}</h2>
            <ol className="mt-5 space-y-5">
              {copy.how.steps.map((step, i) => (
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

          <p className="rounded-sm border border-line bg-cream p-5 text-sm leading-relaxed text-bark">
            {copy.how.documents}
          </p>
        </div>

        <section aria-labelledby="provider-form-heading">
          <h2 id="provider-form-heading" className="type-h3 mb-5 text-forest">
            {copy.form.heading}
          </h2>
          <ProviderForm />
        </section>
      </div>
    </div>
  );
}
