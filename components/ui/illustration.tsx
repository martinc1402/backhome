import type { IconName } from "@/content/site";

/**
 * Line illustrations in the huts.com register: a soft lime fill shape with a
 * moss-green line drawing over it. Used on the scenario and service cards,
 * mirroring the reference site's "Forever Home / Second Home" card row.
 *
 * Drawn on a 96×72 grid. All decorative — every card has a real text heading,
 * so these are aria-hidden.
 */
const drawings: Record<IconName, React.ReactNode> = {
  // Accompanying someone to an appointment: a calendar and a clock.
  calendar: (
    <>
      <rect x="14" y="16" width="42" height="40" rx="5" className="fill-lime" />
      <rect x="14" y="16" width="42" height="40" rx="5" />
      <path d="M14 27h42" />
      <path d="M25 12v8M45 12v8" />
      <circle cx="64" cy="45" r="14" className="fill-cream" />
      <circle cx="64" cy="45" r="14" />
      <path d="M64 38v7l5 3" />
    </>
  ),

  // Checking in: a home with a message returning from it.
  "check-in": (
    <>
      <path d="M12 36 34 18l22 18" />
      <path d="M17 33v25h34V33" className="fill-lime" />
      <path d="M17 33v25h34V33" />
      <path d="M28 58V45h12v13" />
      <path d="M58 14h26a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H72l-6 6v-6h-8a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" className="fill-cream" />
      <path d="M58 14h26a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H72l-6 6v-6h-8a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4z" />
      <path d="M64 21l4 4 8-8" />
    </>
  ),

  // Repair coordination: a house under a wrench.
  wrench: (
    <>
      <path d="M10 40 32 22l22 18" />
      <path d="M15 37v23h34V37" className="fill-lime" />
      <path d="M15 37v23h34V37" />
      <path d="M76 16a11 11 0 0 0-14 14L48 44l8 8 14-14a11 11 0 0 0 14-14l-7 7-7-2-2-7z" className="fill-cream" />
      <path d="M76 16a11 11 0 0 0-14 14L48 44l8 8 14-14a11 11 0 0 0 14-14l-7 7-7-2-2-7z" />
    </>
  ),

  // After hospital: a mug and a folded blanket — recovery at home, not clinical.
  recovery: (
    <>
      <rect x="16" y="30" width="34" height="26" rx="5" className="fill-lime" />
      <rect x="16" y="30" width="34" height="26" rx="5" />
      <path d="M50 36h8a7 7 0 0 1 0 14h-8" />
      <path d="M14 62h40" />
      <path d="M26 22c0-4 4-4 4-8M36 22c0-4 4-4 4-8" />
      <path d="M64 44c8 0 14 5 14 5s-6 5-14 5-14-5-14-5" className="fill-cream" />
      <path d="M70 34v10" />
      <path d="M70 34c-5 0-8-3-8-7 5 0 8 3 8 7zM70 36c5 0 8-3 8-7-5 0-8 3-8 7z" className="fill-cream" />
    </>
  ),

  // Welfare visit: two people talking, one at the door.
  visit: (
    <>
      <path d="M10 24h34v40H10z" className="fill-lime" />
      <path d="M10 24h34v40H10z" />
      <path d="M36 44h.01" />
      <circle cx="58" cy="26" r="8" className="fill-cream" />
      <circle cx="58" cy="26" r="8" />
      <path d="M44 64c0-9 6-16 14-16s14 7 14 16" />
      <path d="M76 34l4 4 8-9" />
    </>
  ),

  // Medication and essentials: a paper bag with a cross.
  pill: (
    <>
      <path d="M22 28h38l4 34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" className="fill-lime" />
      <path d="M22 28h38l4 34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4z" />
      <path d="M30 28V18a11 11 0 0 1 22 0v10" />
      <path d="M41 40v14M34 47h14" />
      <rect x="68" y="40" width="20" height="12" rx="6" className="fill-cream" />
      <rect x="68" y="40" width="20" height="12" rx="6" />
      <path d="M78 40v12" />
    </>
  ),

  // Property check: a home seen through a lens.
  home: (
    <>
      <path d="M12 34 34 16l22 18" />
      <path d="M17 31v27h34V31" className="fill-lime" />
      <path d="M17 31v27h34V31" />
      <path d="M28 58V46h12v12" />
      <circle cx="68" cy="34" r="15" className="fill-cream" />
      <circle cx="68" cy="34" r="15" />
      <path d="M79 45 90 56" />
    </>
  ),

  // Remaining icon names are not used as illustrations, but the record must be
  // exhaustive so a new IconName is a type error rather than a blank card.
  shield: <circle cx="48" cy="36" r="20" className="fill-lime" />,
  receipt: <circle cx="48" cy="36" r="20" className="fill-lime" />,
  heart: <circle cx="48" cy="36" r="20" className="fill-lime" />,
  scope: <circle cx="48" cy="36" r="20" className="fill-lime" />,
  warning: <circle cx="48" cy="36" r="20" className="fill-lime" />,
};

type IllustrationProps = {
  name: IconName;
  className?: string;
};

export function Illustration({
  name,
  className = "h-24 w-32",
}: IllustrationProps) {
  return (
    <svg
      viewBox="0 0 96 72"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-moss ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {drawings[name]}
    </svg>
  );
}
