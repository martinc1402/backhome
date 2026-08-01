import type { ReactNode } from "react";

type QuoteBlockProps = {
  children: ReactNode;
  attribution: string;
  role?: string;
};

/**
 * Oversized pull-quote, borrowing the visual treatment of the huts.com
 * testimonial band.
 *
 * BackHome has no customers yet, so this deliberately carries the founders'
 * own words rather than an invented testimonial. Do not repurpose it for a
 * fabricated customer quote.
 *
 * Note the explicit `font-serif`: the `type-*` classes set size and tracking
 * only, and these are <p>/<span> elements, so they would otherwise inherit the
 * body sans.
 */
export function QuoteBlock({ children, attribution, role }: QuoteBlockProps) {
  return (
    <figure>
      {/* Sized and clipped deliberately: a 148px glyph has enormous side
          bearings, so it is given its own line box with a negative margin
          underneath rather than being absolutely positioned over the text. */}
      <span
        aria-hidden="true"
        className="block font-serif text-[7rem] leading-[0.6] text-lime select-none"
      >
        &ldquo;
      </span>

      <blockquote className="mt-6">
        <p className="type-h3 font-serif text-forest">{children}</p>
      </blockquote>

      <figcaption className="mt-8 flex items-center gap-3 text-sm">
        <span aria-hidden="true" className="h-px w-8 bg-brown/40" />
        <span className="text-bark">
          {attribution}
          {role ? <span className="text-bark/80">, {role}</span> : null}
        </span>
      </figcaption>
    </figure>
  );
}
