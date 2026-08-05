import type { ReactNode } from "react";

type Tone = "base" | "cream" | "forest" | "lime" | "sage";

const toneClasses: Record<Tone, string> = {
  base: "bg-base text-bark",
  cream: "bg-cream text-bark",
  // `on-dark` switches the global focus ring to lime so it stays visible.
  forest: "bg-forest text-cream on-dark",
  lime: "bg-lime text-forest",
  // moss at the same 35% the process numerals use, which composites to ~#c1caaa
  // over the base body background. Full-strength moss is far darker than it
  // reads there (#57772e) — forest text on it is only 2.8:1.
  sage: "bg-moss/35 text-forest",
};

type SectionProps = {
  id?: string;
  tone?: Tone;
  children: ReactNode;
  /** Tightens vertical rhythm for short bands such as the final CTA. */
  compact?: boolean;
  /** Removes the max-width wrapper for full-bleed content. */
  bleed?: boolean;
  className?: string;
};

/**
 * Standard page section: background tone, vertical rhythm, max width, and the
 * scroll offset that keeps anchored headings clear of the fixed header.
 *
 * Spacing is deliberately generous — the huts.com reference leans on large
 * empty cream areas to carry its premium feel.
 */
export function Section({
  id,
  tone = "base",
  children,
  compact = false,
  bleed = false,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${toneClasses[tone]} ${
        compact ? "py-20 sm:py-24" : "py-24 sm:py-32 lg:py-40"
      } ${className}`}
    >
      {bleed ? (
        children
      ) : (
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
      )}
    </section>
  );
}
