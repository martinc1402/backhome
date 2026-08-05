import { getImageProps } from "next/image";

import { hero } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { HeroMedia } from "@/components/hero-media";

/**
 * Full-bleed hero: edge-to-edge footage, centred serif headline, fixed header
 * floating over the top — the defining layout cue of the huts.com reference.
 *
 * The background is a one-shot video reveal on desktop and a static frame on
 * phones; both live in HeroMedia along with the scrims. This component stays a
 * server component so the h1 — the LCP element — renders without waiting on JS.
 */
export function Hero() {
  // getImageProps rather than <Image>: the mobile still has to sit inside a
  // <picture> so the desktop <source> can resolve to a data URI and stop it
  // being fetched. This is the art-direction path the Next 16 docs prescribe.
  // No `quality` prop — images.qualities defaults to [75] and any other value
  // is a build error.
  const {
    props: { srcSet: mobileSrcSet, src: mobileSrc },
  } = getImageProps({
    alt: "",
    src: hero.media.mobileStill.src,
    width: hero.media.mobileStill.width,
    height: hero.media.mobileStill.height,
    sizes: "100vw",
    // `priority` is deprecated in Next 16; this is the documented
    // replacement for the LCP image.
    loading: "eager",
    fetchPriority: "high",
  });

  return (
    // --hero-split is the single source of truth for where the copy column
    // begins. Both the left margin of the copy and the ramp in the directional
    // scrim (globals.css) read it, so they can never drift apart.
    //
    // The split starts at lg, not md. Measured at 768px the hero box ends up
    // narrower in aspect than the 1.795 footage, so object-cover shows only
    // ~51% of the source width and the subject expands to fill 0–46% of the
    // screen — flush against a copy column starting at 45%. Below lg the copy
    // therefore stays centred over a full scrim, which is also why the hero
    // reads as "zoomed in" at those widths: it is, and there is no framing
    // that fits both the artwork and a second column at that size.
    //
    // bg-forest is load-bearing: the media layer fades out on scroll and this
    // is what it dissolves into. Without it the cream page background shows
    // through and the cream copy disappears.
    <section className="on-dark relative isolate flex min-h-[88svh] items-center overflow-hidden bg-forest [--hero-split:50%] xl:[--hero-split:55%]">
      <HeroMedia
        mobileSrcSet={mobileSrcSet}
        mobileSrc={mobileSrc}
        video={hero.media.video}
        poster={hero.media.poster.src}
      />

      {/* Below lg the copy stays centred over a full dark scrim; the left/right
          split has nowhere to go until there is width for two columns. From lg
          up it moves into the right-hand column, clear of the hands and phone.
          The lighter vertical padding at lg also matters: it keeps the hero
          short enough that object-cover shows most of the frame width rather
          than cropping into a tall, zoomed sliver. */}
      <div className="w-full px-5 py-28 sm:px-8 md:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:ml-[var(--hero-split)] lg:max-w-[34rem] lg:text-left">
          {/* The pill carries its own fill so its 12px label does not depend on
              whatever happens to be behind it in the photograph.

              No `border` utility: the stroke is a masked conic gradient on
              .hero-pill::before so it can draw itself around the shape on load.
              See globals.css. The dot and the label are separate elements only
              because the fade-up needs something to target — a bare text node
              cannot be animated. */}
          <p className="hero-pill type-label mb-8 inline-flex items-center gap-2.5 rounded-pill bg-forest/40 px-4 py-2 tracking-[0.16em] text-cream uppercase">
            <span
              aria-hidden="true"
              className="hero-pill-content h-1.5 w-1.5 rounded-full bg-lime"
            />
            <span className="hero-pill-content">{hero.eyebrow}</span>
          </p>

          {/* The single h1 for the page. */}
          <h1 className="type-display mx-auto max-w-4xl text-cream lg:mx-0">
            {hero.heading}
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream/85 lg:mx-0">
            {hero.body}
          </p>

          {/* Back to a column at lg. Between 1024 and 1279 the copy sits in a
              ~456px column — wide enough for the paragraph, but not for both
              CTAs side by side, and they wrap mid-label if forced. Stacking
              reads deliberately; wrapping reads broken. Side by side returns
              at xl, where the column reaches ~525px. */}
          <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8 lg:flex-col lg:items-start lg:justify-start lg:gap-5 xl:flex-row xl:items-center xl:gap-6">
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
      </div>
    </section>
  );
}
