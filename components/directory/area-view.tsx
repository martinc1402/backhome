import Link from "next/link";

import { Breadcrumbs } from "@/components/directory/breadcrumbs";
import { Icon } from "@/components/ui/icon";
import { getArea, launchCategories, listingsInCategory } from "@/lib/directory";

/** Body of /cebu/[area]: the launch categories, with counts for this area. */
export function AreaView({ areaSlug }: { areaSlug: string }) {
  const area = getArea(areaSlug)!;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: area.name }]} />

      <header className="mt-8 max-w-3xl">
        <h1 className="type-h2 text-forest">Elder care in {area.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-bark">
          Caregivers, home nurses, doctors and care homes in {area.name}, each
          showing how and when we checked it.
        </p>
      </header>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {launchCategories.map((c) => {
          const count = listingsInCategory(c.slug, area.slug).length;
          return (
            <li key={c.slug}>
              <Link
                href={`/cebu/${area.slug}/${c.slug}`}
                className="flex h-full gap-4 rounded-sm border border-line bg-cream p-5 shadow-card motion-safe:transition-shadow hover:shadow-lift"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/60 text-forest">
                  <Icon name={c.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-serif text-xl text-forest">{c.name}</span>
                  <span className="mt-1 block text-sm text-bark">{c.blurb}</span>
                  <span className="mt-2 block text-sm text-ink">
                    {count === 0
                      ? "None listed yet"
                      : `${count} ${count === 1 ? "provider" : "providers"}`}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
