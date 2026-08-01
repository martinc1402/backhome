import Image from "next/image";

import { hero } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";

/**
 * Full-bleed hero: edge-to-edge photograph, centred serif headline, fixed
 * header floating over the top — the defining layout cue of the huts.com
 * reference.
 *
 * The image is rendered directly rather than through PlaceholderImage because
 * it needs to fill the section as a background layer. Its placeholder badge is
 * drawn into the SVG artwork itself.
 */
export function Hero() {
  return (
    <section className="on-dark relative isolate flex min-h-[88svh] items-end overflow-hidden">
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        width={hero.image.width}
        height={hero.image.height}
        // `priority` is deprecated in Next 16; this is the documented
        // replacement for the LCP image.
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Scrim. Two layers: a flat wash plus a vertical gradient that deepens
          toward the text block. The gradient deliberately never reaches
          transparent — measured against this image, a transparent midpoint put
          the headline at 1.88:1 over the bright sky. Combined coverage stays
          at or above ~0.55 everywhere text sits, which clears AA for the 72px
          headline and the 18px body copy alike.

          If you swap in a real photograph, re-run the hero contrast check
          before shipping: a lighter image will need a heavier scrim. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-forest/40" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/35 via-forest/25 via-45% to-forest/85"
      />

      <div className="mx-auto w-full max-w-5xl px-5 pt-32 pb-16 text-center sm:px-8 sm:pb-24">
        {/* The pill carries its own fill so its 12px label does not depend on
            whatever happens to be behind it in the photograph. */}
        <p className="type-label mb-8 inline-flex items-center gap-2.5 rounded-pill border border-cream/30 bg-forest/40 px-4 py-2 tracking-[0.16em] text-cream uppercase">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-lime" />
          {hero.eyebrow}
        </p>

        {/* The single h1 for the page. */}
        <h1 className="type-display mx-auto max-w-4xl text-cream">
          {hero.heading}
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream/85">
          {hero.body}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
          <ButtonLink
            href={hero.primaryCta.href}
            variant="onDark"
            size="lg"
            className="w-full sm:w-auto"
          >
            {hero.primaryCta.label}
          </ButtonLink>
          <ButtonLink
            href={hero.secondaryCta.href}
            variant="link"
            className="text-cream"
          >
            {hero.secondaryCta.label}
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-cream/70">{hero.reassurance}</p>
      </div>
    </section>
  );
}

/**
 * The reassurance line that used to float over the hero image. On the
 * full-bleed layout it becomes a lime band directly beneath the hero, so the
 * message survives without sitting on top of the photograph.
 */
export function HeroTrustBand() {
  return (
    <div className="bg-lime">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        {/* font-serif is explicit: type-h4 sets size only, and this is a <p>. */}
        <p className="type-h4 text-center font-serif text-forest">
          {hero.trustCard}
        </p>
      </div>
    </div>
  );
}
