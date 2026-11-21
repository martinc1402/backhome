/**
 * Small restrained line-icon set, inlined rather than pulled from an icon
 * library — there are a handful of icons on the whole site and no dependency is
 * worth it. All share a 24px grid, 1.5 stroke and currentColor.
 */
export type IconName =
  | "home"
  | "nurse"
  | "doctor"
  | "building"
  | "hospital"
  | "pill"
  | "car"
  | "document"
  | "check"
  | "visit"
  | "shield"
  | "calendar"
  | "warning"
  | "arrow-right"
  | "search";

const paths: Record<IconName, React.ReactNode> = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
      <path d="M9 15h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7.5 3v5.4c0 4.4-3 8.2-7.5 9.6C7.5 19.6 4.5 15.8 4.5 11.4V6z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </>
  ),
  // A person plus a confirmation tick.
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
  nurse: (
    <>
      <circle cx="12" cy="7" r="3.5" />
      <path d="M5 20.5c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
      <path d="M12 15.5v4M10 17.5h4" />
    </>
  ),
  doctor: (
    <>
      <path d="M6 3.5v5a4 4 0 0 0 8 0v-5" />
      <path d="M10 12.5v2a5 5 0 0 0 10 0v-1.5" />
      <circle cx="20" cy="11" r="2" />
    </>
  ),
  building: (
    <>
      <path d="M4 20.5V8l8-4.5L20 8v12.5" />
      <path d="M2.5 20.5h19" />
      <path d="M10 20.5v-4h4v4" />
      <path d="M8 10.5h.01M12 10.5h.01M16 10.5h.01" />
    </>
  ),
  hospital: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  car: (
    <>
      <path d="M5 16.5V12l2-5h10l2 5v4.5" />
      <path d="M3.5 12h17v4.5h-17z" />
      <circle cx="7.5" cy="18.5" r="1.5" />
      <circle cx="16.5" cy="18.5" r="1.5" />
    </>
  ),
  document: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h4" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  "arrow-right": <path d="M4 12h16M14 6l6 6-6 6" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
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
