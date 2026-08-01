"use client";

import { useEffect, useRef, useState } from "react";

import { nav, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { BackHomeMark } from "@/components/ui/icon";

/**
 * Fixed header that floats transparently over the dark hero image, then takes
 * a solid cream background once the hero has scrolled away.
 *
 * Driven by an IntersectionObserver watching a sentinel element rather than a
 * scroll listener, so there is no per-frame work on the main thread.
 *
 * It starts in the *solid* state and only goes transparent once the observer
 * confirms the sentinel is visible. That way, if JavaScript never runs, the
 * header stays legible rather than rendering cream text on a cream page.
 */
export function SiteHeader() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [overHero, setOverHero] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Sits just inside the hero; visible only while the hero is in view. */}
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 h-[70svh] w-px"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 motion-safe:transition-colors motion-safe:duration-300 ${
          overHero
            ? "on-dark bg-transparent text-cream"
            : "border-b border-line bg-cream/90 text-bark backdrop-blur-md"
        }`}
      >
        {/* Top scrim for the transparent state. Without it the wordmark and
            nav sit at ~4.4:1 over the hero's bright sky — right on the AA
            threshold, and a lighter photograph would push them under it.
            This makes header legibility independent of the image. */}
        {overHero ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-forest/60 to-transparent"
          />
        ) : null}

        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5">
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5"
            aria-label={`${site.name} — back to top`}
          >
            <BackHomeMark
              className={`h-7 w-7 ${overHero ? "text-lime" : "text-moss"}`}
            />
            {/* PLACEHOLDER: text wordmark, pending a real logotype. */}
            <span className="font-serif text-[1.375rem] tracking-tight">
              {site.name}
            </span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-9 md:flex"
          >
            {nav.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm opacity-80 motion-safe:transition-opacity hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <ButtonLink
            href={nav.cta.href}
            variant={overHero ? "onDark" : "solid"}
            size="md"
          >
            {nav.cta.label}
          </ButtonLink>
        </div>
      </header>
    </>
  );
}
