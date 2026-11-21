import Link from "next/link";

import { howWeCheck } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";

/** Pill styles shared with the check key on /how-we-check. */
export const levelPill: Record<"visited" | "called" | "listed", string> = {
  visited: "bg-lime text-forest",
  called: "bg-stone/60 text-ink",
  listed: "border border-line-strong text-bark",
};

export function HowWeCheck() {
  return (
    <section className="bg-sand/30 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SectionHeading eyebrow={howWeCheck.eyebrow} heading={howWeCheck.heading} />

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {howWeCheck.steps.map((step) => (
            <li key={step.number} className="border-t border-line-strong pt-6">
              <p aria-hidden="true" className="font-serif text-6xl leading-none text-moss/45">
                {step.number}
              </p>
              <h3 className="mt-5 font-serif text-xl text-forest">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bark">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <dl className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6">
            {howWeCheck.key.map((k) => (
              <div key={k.level} className="flex items-center gap-2.5">
                <dt className={`rounded-pill px-2.5 py-0.5 text-xs ${levelPill[k.level]}`}>
                  {k.label}
                </dt>
                <dd className="text-bark">{k.text}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={howWeCheck.link.href}
            className="text-sm text-forest underline underline-offset-4"
          >
            {howWeCheck.link.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
