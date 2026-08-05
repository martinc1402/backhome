import type { IconName } from "@/content/site";

/**
 * Small restrained line-icon set, inlined rather than pulled from an icon
 * library — there are twelve icons on the whole site and no dependency is
 * worth it. All share a 24px grid, 1.5 stroke and currentColor.
 */
const paths: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M9 15h4" />
    </>
  ),
  "check-in": (
    <>
      <path d="M21 12a9 9 0 1 1-3.6-7.2" />
      <path d="M9 12l2.2 2.2L21 5" />
    </>
  ),
  wrench: (
    <>
      <path d="M15.5 3a5.5 5.5 0 0 0-5 7.7L3.6 17.6a2 2 0 0 0 2.8 2.8l6.9-6.9A5.5 5.5 0 1 0 15.5 3z" />
      <path d="M6.5 17.5h.01" />
    </>
  ),
  recovery: (
    <>
      <path d="M3 12h4l2-4 3 8 2.5-5 1.5 3h5" />
      <path d="M4 18h16" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.4c0 4.4-3 8.2-7.5 9.6C7.5 19.6 4.5 15.8 4.5 11.4V6z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </>
  ),
  receipt: (
    <>
      <path d="M5 3h14v18l-2.3-1.6L14.4 21l-2.4-1.6L9.6 21l-2.3-1.6L5 21z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.4-7-9.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7 3.1C19 15.6 12 20 12 20z" />
  ),
  scope: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 9h6v6H9z" />
    </>
  ),
  // A person plus a confirmation tick — distinct from the `home` icon used
  // for property checks.
  visit: (
    <>
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M3.5 20c0-3.6 2.9-6 6.5-6 .7 0 1.4.1 2 .3" />
      <path d="M14.5 18l1.8 1.8L21 15" />
    </>
  ),
  pill: (
    <>
      <rect x="3" y="8.5" width="18" height="7" rx="3.5" />
      <path d="M12 8.5v7" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11L12 4l8.5 7" />
      <path d="M5.5 10V20h13V10" />
      <path d="M9.5 20v-5h5v5" />
    </>
  ),
  warning: (
    <>
      <path d="M12 4.5L21 19H3z" />
      <path d="M12 10v4M12 16.5h.01" />
    </>
  ),
};

type IconProps = {
  name: IconName;
  className?: string;
};

export function Icon({ name, className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      // Decorative: every icon sits beside a text label.
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

/**
 * The BackHome mark: an arch with a heart inside it. Used beside the wordmark
 * in the header.
 *
 * Geometry is the brand file `public/brand/backhome-mark-mono.svg`, kept inline
 * rather than referenced as an <img> for one reason: the header tints the mark
 * (lime over the hero, moss once the header goes solid), and only an inline SVG
 * inherits `currentColor`. If you edit the artwork, edit both — the file is the
 * source of truth, this is the tintable copy.
 *
 * The viewBox is cropped to the drawing's true bounds rather than the 48×48
 * square the file ships with. Those bounds include the 3.8 stroke and its round
 * caps: x 13.1–34.9, y 8.6–39.4. Cropping means the element box IS the mark, so
 * the header's `gap` sets the real optical distance to the wordmark instead of
 * padding it out with ~5px of dead space on each side.
 *
 * The result is portrait (22×31), so size it by height and let width follow —
 * `h-7 w-auto`, not `h-7 w-7`.
 */
export function BackHomeMark({ className = "h-6 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="13 8.5 22 31"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M15,37.5 L15,19.5 A9,9 0 0 1 33,19.5 L33,37.5"
        stroke="currentColor"
        strokeWidth={3.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24,29.9 C19.4,26.1 18.7,24.9 18.7,23.2 C18.7,21.2 20.2,20.5 21.5,20.8 C22.6,21 23.5,22 24,23 C24.5,22 25.4,21 26.5,20.8 C27.8,20.5 29.3,21.2 29.3,23.2 C29.3,24.9 28.6,26.1 24,29.9 Z"
        fill="currentColor"
      />
    </svg>
  );
}
