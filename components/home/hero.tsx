import Image from "next/image";
import Link from "next/link";

import { hero } from "@/content/site";
import { AREAS } from "@/content/directory/taxonomy";
import { launchCategories } from "@/lib/directory";
import { Icon } from "@/components/ui/icon";

/**
 * Dark-green hero: headline and search on the left, photo on the right.
 *
 * The search is a plain GET form to /find, which redirects to the right
 * directory page, so it works before (or without) JavaScript.
 */
export function Hero() {
  return (
    <section className="on-dark bg-forest text-cream">
      {/* pt clears the fixed header, which floats transparently over this. */}
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-32 pb-16 sm:px-8 sm:pt-36 sm:pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:pb-24">
        <div>
          <p className="type-label inline-flex items-center gap-2.5 rounded-pill border border-cream/25 px-4 py-2 tracking-[0.16em] uppercase">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
            {hero.eyebrow}
          </p>

          {/* The page's single h1. */}
          <h1 className="type-display mt-7 max-w-xl text-cream">{hero.heading}</h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/85">
            {hero.body}
          </p>

          <form
            action="/find"
            method="get"
            role="search"
            aria-label="Find care in Cebu"
            className="mt-9 grid gap-3 rounded-sm bg-cream p-4 text-bark sm:grid-cols-[1.25fr_1fr_auto] sm:items-end sm:p-5"
          >
            <div>
              <label htmlFor="hero-need" className="text-xs text-forest">
                {hero.search.needLabel}
              </label>
              <select
                id="hero-need"
                name="need"
                required
                defaultValue=""
                className="field-input mt-1.5"
              >
                <option value="" disabled>
                  {hero.search.needPlaceholder}
                </option>
                {launchCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="hero-area" className="text-xs text-forest">
                {hero.search.areaLabel}
              </label>
              <select id="hero-area" name="area" defaultValue="" className="field-input mt-1.5">
                <option value="">{hero.search.areaAll}</option>
                {AREAS.map((a) => (
                  <option key={a.slug} value={a.slug}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-pill bg-forest px-7 text-cream hover:bg-forest-deep motion-safe:transition-colors"
            >
              <Icon name="search" className="h-4 w-4" />
              {hero.search.button}
            </button>
          </form>

          <p className="mt-6">
            <Link
              href={hero.helpLink.href}
              className="text-cream underline decoration-cream/40 underline-offset-[6px] hover:decoration-lime"
            >
              {hero.helpLink.label} <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-forest-deep lg:aspect-[4/5]">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            // `priority` is deprecated in Next 16; these are its replacement.
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
