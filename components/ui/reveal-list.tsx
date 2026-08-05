"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Every SVG element whose stroke can be drawn on with a dash offset. */
const GEOMETRY = "path, rect, circle, line, polyline, polygon";

/** Share of the list that must be on screen before the reveal starts. */
const THRESHOLD = 0.3;

type RevealListProps = {
  children: ReactNode;
  className?: string;
};

/**
 * A <ul> whose items draw their icon and fade their text in once, the first
 * time the list scrolls into view. See the scroll reveal block in globals.css
 * for the animation itself; this component only decides *when* it runs.
 *
 * Deliberately a thin wrapper around server-rendered children rather than a
 * client component that maps over the content: the items come through as RSC
 * payload, so none of content/site.ts reaches the browser bundle.
 *
 * Progressive enhancement, in both directions:
 *   - the finished state is what the server renders. Nothing here is required
 *     for the content to be visible, so a JS failure costs the animation and
 *     nothing else.
 *   - under prefers-reduced-motion: reduce the observer is never created, so
 *     the list is never armed. That is a skip, not a zeroed duration.
 *
 * Stagger comes from a --reveal-delay custom property set on each item by the
 * caller, so the order lives with the markup.
 */
export function RevealList({ children, className = "" }: RevealListProps) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Normalises every path to a length of 1 so one pair of dash values in CSS
    // covers all four icons — no getTotalLength() pass, no per-icon constants.
    // Scoped to this list, so the same icons used elsewhere are untouched.
    for (const node of list.querySelectorAll(GEOMETRY)) {
      node.setAttribute("pathLength", "1");
    }
    list.classList.add("reveal-armed");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || entry.intersectionRatio < THRESHOLD) {
            continue;
          }
          list.classList.add("reveal-in");
          // Fires once. Disconnecting here is what stops it replaying when the
          // reader scrolls back up past the section.
          observer.disconnect();
          break;
        }
      },
      { threshold: THRESHOLD },
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={ref} className={className}>
      {children}
    </ul>
  );
}
