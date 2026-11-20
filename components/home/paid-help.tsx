import Link from "next/link";

import { paidHelp } from "@/content/site";
import { Icon } from "@/components/ui/icon";

/**
 * The paid offer. The report card on the right shows the SHAPE of a visit
 * report (field labels and blank lines), not invented findings.
 */
export function PaidHelp() {
  const r = paidHelp.sampleReport;

  return (
    <section className="on-dark bg-forest py-20 text-cream sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="type-label tracking-[0.16em] text-lime uppercase">{paidHelp.eyebrow}</p>
          <h2 className="type-h2 mt-6 text-cream">{paidHelp.heading}</h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-cream/80">{paidHelp.body}</p>

          <ul className="mt-7 space-y-3">
            {paidHelp.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-cream/90">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link
              href={paidHelp.cta.href}
              className="inline-flex min-h-12 items-center justify-center rounded-pill bg-cream px-7 text-forest hover:bg-lime motion-safe:transition-colors"
            >
              {paidHelp.cta.label}
            </Link>
            <p className="text-cream/75">{paidHelp.price}</p>
          </div>
        </div>

        <figure
          aria-label={r.label}
          className="rounded-card bg-cream p-6 text-bark shadow-lift sm:p-8"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="type-label tracking-[0.16em] text-moss uppercase">{r.label}</p>
            <span className="rounded-pill bg-lime px-2.5 py-0.5 text-xs text-forest">Visited</span>
          </div>
          <p className="mt-4 font-serif text-2xl text-forest">{r.title}</p>

          <div aria-hidden="true" className="mt-5 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-lg bg-moss/15" />
            ))}
          </div>

          <dl className="mt-6 divide-y divide-line text-sm">
            {r.rows.map((row) => (
              <div key={row} className="flex items-center justify-between gap-4 py-2.5">
                <dt>{row}</dt>
                <dd aria-hidden="true" className="h-2 w-20 rounded-full bg-line-strong" />
              </div>
            ))}
          </dl>
          <figcaption className="mt-5 rounded-lg bg-base px-4 py-3 text-sm">{r.note}</figcaption>
        </figure>
      </div>
    </section>
  );
}
