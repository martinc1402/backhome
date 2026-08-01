import Image from "next/image";

type PlaceholderImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** Hero image only — everything else should lazy-load. */
  eager?: boolean;
  sizes?: string;
  /** Full-bleed images take no corner radius. */
  square?: boolean;
  /**
   * Set false once a real photograph replaces the placeholder to drop the
   * corner badge. See public/placeholders/README.md.
   */
  isPlaceholder?: boolean;
};

/**
 * Every image on the site renders through this component, so swapping the
 * placeholder art for real photography is a one-line change per slot in
 * content/site.ts.
 *
 * next/image serves `.svg` sources unoptimised automatically, so the current
 * placeholder SVGs need no next.config.ts changes. Real raster photos dropped
 * in later are optimised normally.
 */
export function PlaceholderImage({
  src,
  alt,
  width,
  height,
  className = "",
  eager = false,
  sizes,
  square = false,
  isPlaceholder = true,
}: PlaceholderImageProps) {
  return (
    <div
      className={`relative overflow-hidden bg-sand ${
        square ? "" : "rounded-card"
      } ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        // `priority` is deprecated in Next 16; loading="eager" is the
        // documented replacement for above-the-fold images.
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className="h-full w-full object-cover"
      />

      {isPlaceholder ? (
        <span className="pointer-events-none absolute right-4 bottom-4 rounded-pill bg-forest/90 px-3 py-1.5 font-mono text-[0.625rem] tracking-widest text-cream uppercase">
          Placeholder
        </span>
      ) : null}
    </div>
  );
}
