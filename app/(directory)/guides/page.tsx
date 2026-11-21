import type { Metadata } from "next";
import Link from "next/link";

import { GUIDES } from "@/content/guides";

const anyWritten = GUIDES.some((g) => g.written);

export const metadata: Metadata = {
  title: "Guides to elder care in Cebu | BackHome",
  description:
    "Practical guides for families arranging care for an older parent in Cebu: costs, checking a caregiver from overseas, leaving hospital, memory loss and more.",
  alternates: { canonical: "/guides" },
  // A page of links to unwritten shells is thin; index it once one is written.
  robots: anyWritten ? undefined : { index: false, follow: true },
};

export default function GuidesPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <header className="max-w-3xl">
        <p className="type-label tracking-[0.16em] text-moss uppercase">Guides</p>
        <h1 className="type-h2 mt-5 text-forest">Arranging care from near or far</h1>
        <p className="mt-5 text-lg leading-relaxed text-bark">
          Plain answers to the questions families ask us most, written with our Cebu team.
        </p>
      </header>

      <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="group block">
              <div
                aria-hidden="true"
                className="aspect-[3/2] rounded-sm bg-moss/15 motion-safe:transition-colors group-hover:bg-moss/25"
              />
              <p className="mt-4 text-xs text-bark">
                {g.topic}
                {g.written ? null : " · Coming soon"}
              </p>
              <h2 className="mt-1 font-serif text-xl leading-snug text-forest group-hover:underline group-hover:underline-offset-4">
                {g.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-bark">{g.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
