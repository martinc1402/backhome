"use client";

import { useEffect, useRef } from "react";

/**
 * The hero background layer: a one-shot video reveal on desktop, a static
 * frame on phones, with the scrims that make the cream copy legible over
 * either.
 *
 * This is the only client component in the hero. Hero itself stays a server
 * component because the h1 is the LCP element and must render without JS.
 *
 * The clip plays once and holds on its final lit frame. It is never looped:
 * the shot is a before/after reveal, so looping would hard-cut a lit screen
 * back to a dark one every five seconds.
 */

/**
 * 1×1 transparent GIF. This is load-bearing, not dead code: it is the srcSet
 * for the viewport range where the mobile still must NOT be fetched. Deleting
 * it makes every desktop visitor download a phone-shaped JPEG they never see.
 */
const BLANK =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/** Matches the md: breakpoint used on the elements below. Keep in sync. */
const DESKTOP = "(min-width: 768px)";

type Props = {
  /** Pre-resolved by getImageProps() on the server. */
  mobileSrcSet: string | undefined;
  mobileSrc: string;
  video: { src: string; type: string };
  poster: string;
};

export function HeroMedia({ mobileSrcSet, mobileSrc, video, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // React does not reliably serialise `muted` as an attribute during SSR —
    // it sets the DOM property on hydration. Browsers refuse unattended
    // autoplay on an unmuted element, so set it imperatively before play() or
    // playback is silently rejected in production. Do not remove this.
    el.muted = true;
    el.defaultMuted = true;

    // Park on the final lit frame. Used both for reduced motion and as the
    // fallback when autoplay is refused, so either way the hero settles on the
    // meaningful end state rather than the dark poster.
    const holdFinalFrame = () => {
      if (!Number.isFinite(el.duration) || el.duration <= 0) return;
      try {
        el.currentTime = Math.max(0, el.duration - 0.04);
      } catch {
        /* seeking can throw if the media errors out; the poster is fine. */
      }
      el.pause();
    };
    const holdWhenReady = () => {
      if (el.readyState >= 1) holdFinalFrame();
      else el.addEventListener("loadedmetadata", holdFinalFrame, { once: true });
    };

    // Reduced motion: never play. Freezing the lit frame is the equivalent of
    // the shot, not a downgrade — the lit screen is the whole point of it.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.autoplay = false;
      el.pause();
      holdWhenReady();
      return;
    }

    // Autoplay can still be refused: iOS Low Power Mode, data saver, some
    // enterprise policies. Land on the same held final frame.
    void el.play()?.catch(holdWhenReady);
  }, []);

  // Unlike <picture>, a <video> runs the resource selection algorithm ONCE and
  // does not re-evaluate <source media> on resize. Without this, someone who
  // loads at 700px and then maximises never gets the video at all.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const mq = window.matchMedia(DESKTOP);
    const onChange = () => {
      if (!mq.matches) return;
      if (el.networkState !== HTMLMediaElement.NETWORK_NO_SOURCE) return;
      el.load();
      el.muted = true;
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        void el.play()?.catch(() => {});
      }
    };

    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* Scroll-driven fade. Separate element from the drift wrapper because a
          single element cannot run two animations that both own `transform`. */}
      <div
        aria-hidden="true"
        className="hero-scroll-fade pointer-events-none absolute inset-0 -z-10"
      >
        {/* Slow scale drift so the held final frame never reads as a stalled
            video. On the wrapper rather than the media itself: `transform`
            resolves after `object-fit`, so it cannot fight object-cover, and
            the mobile still inherits the same drift for free. */}
        <div className="hero-drift absolute inset-0">
          <picture>
            {/* ≥768px resolves to a 1×1 data URI, so the still is never
                fetched on desktop. See BLANK above before touching this. */}
            <source media={DESKTOP} srcSet={BLANK} />
            <source
              media="(max-width: 767.98px)"
              srcSet={mobileSrcSet}
              sizes="100vw"
            />
            <img
              src={mobileSrc}
              alt=""
              decoding="async"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full object-cover md:hidden"
            />
          </picture>

          <video
            ref={videoRef}
            // The autoplay triad. `muted` is also set imperatively above;
            // `playsInline` stops iOS Safari force-fullscreening on play.
            autoPlay
            muted
            playsInline
            // Above the fold and under a megabyte — we want it decoded early.
            preload="auto"
            // The first frame of this very clip, bridging the gap until the
            // real first frame decodes, so there is no jump at t=0.
            //
            // A background-image rather than the `poster` attribute: `poster`
            // is fetched even when the element is display:none, which spent
            // 29KB on every phone for something no phone ever renders — more
            // than the mobile still itself costs. A background-image on a
            // display:none element is not fetched. The video paints over it
            // once frames arrive, so it behaves identically where it matters.
            style={{
              backgroundImage: `url(${poster})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            // Deliberately no `loop`: play once, hold the lit final frame.
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            controlsList="nodownload noplaybackrate noremoteplayback"
            // Decorative and silent. The h1 and body carry the whole message;
            // narrating the scene would only delay screen reader users.
            aria-hidden="true"
            tabIndex={-1}
            className="absolute inset-0 hidden h-full w-full object-cover md:block"
          >
            {/* `media` is what actually prevents the fetch below 768px. A
                non-matching <source> is never requested, whereas display:none
                would download it anyway. Do NOT add a bare `src` to the
                <video> to silence the resulting (harmless)
                MEDIA_ERR_SRC_NOT_SUPPORTED on mobile — that defeats the gate. */}
            <source src={video.src} type={video.type} media={DESKTOP} />
          </video>
        </div>

        {/* Scrims. Both live inside the fade wrapper so they dissolve together
            with the media: media and scrim both fading toward the section's
            bg-forest is monotonically darkening, so there is no contrast dip
            part-way through the scroll.

            Below lg the copy is centred over the whole frame, so the scrim has
            to stay uniformly dark. These are 2–3pp lighter than the values
            this hero shipped with — as far as the artwork can be brought back
            before the 18px body drops under AA. Measured on the live render at
            390px: 5.02:1. The next step lighter (44% + 30/27/84) gives 4.55:1,
            too little margin for a shot that brightens as it plays. */}
        <div className="absolute inset-0 bg-forest/48 lg:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/33 via-forest-deep/29 via-35% to-forest-deep/87 lg:hidden" />

        {/* From lg up the copy has its own column, so the tint is redistributed
            horizontally instead: barely there over the subject, heavy behind
            the copy. See .hero-scrim-directional in globals.css for the ramp
            and the contrast measurements behind its two ends. */}
        <div className="hero-scrim-directional absolute inset-0 hidden lg:block" />
      </div>
    </>
  );
}
