import Link from "next/link";

import { closing } from "@/content/site";

export function ClosingBand() {
  return (
    <section className="bg-moss/35 py-20 text-forest sm:py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <h2 className="type-h2">{closing.heading}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-forest/80">{closing.body}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={closing.primary.href}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-pill bg-forest px-7 text-cream hover:bg-forest-deep sm:w-auto motion-safe:transition-colors"
          >
            {closing.primary.label}
          </Link>
          <Link
            href={closing.secondary.href}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-pill border border-forest px-7 text-forest hover:bg-forest hover:text-cream sm:w-auto motion-safe:transition-colors"
          >
            {closing.secondary.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
