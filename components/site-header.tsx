"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { nav, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { BackHomeMark } from "@/components/ui/icon";

type SiteHeaderProps = {
  /**
   * Set on pages with no dark hero. The header is then permanently solid;
   * without this, the sentinel below would be in view at scroll-top and flip
   * the header to cream-on-transparent over a cream page.
   */
  standalone?: boolean;
};

/**
 * Fixed header. On the homepage it floats transparently over the dark-green
 * hero, then turns solid cream once the hero scrolls away. Driven by an
 * IntersectionObserver on a sentinel rather than a scroll listener.
 *
 * It starts SOLID and only goes transparent once the observer confirms the
 * sentinel is visible, so if JavaScript never runs it stays legible.
 *
 * Below md the links move into a menu opened by a button.
 */
export function SiteHeader({ standalone = false }: SiteHeaderProps = {}) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [overHero, setOverHero] = useState(false);
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so it closes itself
  // whenever the route changes, with no effect needed.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const setMenuOpen = (open: boolean) => setMenuPath(open ? pathname : null);

  useEffect(() => {
    if (standalone) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [standalone]);

  // With the menu open the header is always solid, whatever is behind it.
  const dark = overHero && !menuOpen;

  return (
    <>
      {standalone ? null : (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-[70svh] w-px"
        />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-50 motion-safe:transition-colors motion-safe:duration-300 ${
          dark
            ? "on-dark bg-transparent text-cream"
            : "border-b border-line bg-cream/95 text-bark backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className={`flex shrink-0 items-center gap-2.5 motion-safe:transition-colors motion-safe:duration-300 ${
              dark ? "text-cream" : "text-forest"
            }`}
            aria-label={`${site.name} home`}
          >
            {/* Height-sized, not square: the mark is portrait (22×31). */}
            <BackHomeMark className="h-7 w-auto" />
            <span className="font-serif text-[1.375rem] tracking-tight">{site.name}</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm opacity-80 motion-safe:transition-opacity hover:opacity-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapped, because the button's own inline-flex would beat a
                `hidden` class on the same element. */}
            <span className="hidden sm:block">
              <ButtonLink href={nav.cta.href} variant={dark ? "onDark" : "solid"} size="md">
                {nav.cta.label}
              </ButtonLink>
            </span>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-pill md:hidden"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav id="site-menu" aria-label="Menu" className="border-t border-line px-5 pt-2 pb-6 md:hidden">
            <ul className="flex flex-col">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block border-b border-line py-3.5 text-forest"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ButtonLink href={nav.cta.href} variant="solid" size="md" className="mt-5 w-full">
              {nav.cta.label}
            </ButtonLink>
          </nav>
        ) : null}
      </header>
    </>
  );
}
