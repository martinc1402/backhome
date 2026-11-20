import Link from "next/link";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/directory/breadcrumbs";
import {
  ListingBrowser,
  ListingGrid,
} from "@/components/directory/listing-browser";
import { AREAS } from "@/content/directory/taxonomy";
import {
  getArea,
  getLaunchCategory,
  listingsInCategory,
  toCardData,
} from "@/lib/directory";

/**
 * Body of /cebu/[category] and /cebu/[area]/[category]. Area is chosen with
 * links rather than a filter control, so each area view has its own URL that
 * search engines can find.
 */
export function CategoryView({
  categorySlug,
  areaSlug,
}: {
  categorySlug: string;
  areaSlug?: string;
}) {
  const category = getLaunchCategory(categorySlug)!;
  const area = areaSlug ? getArea(areaSlug)! : undefined;
  const now = new Date();
  const cards = listingsInCategory(category.slug, area?.slug).map((l) =>
    toCardData(l, { now }),
  );

  const heading = area ? `${category.name} in ${area.name}` : `${category.name} in Cebu`;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          area
            ? { label: category.name, href: `/cebu/${category.slug}` }
            : { label: category.name },
          ...(area ? [{ label: area.name }] : []),
        ]}
      />

      <header className="mt-8 max-w-3xl">
        <h1 className="type-h2 text-forest">{heading}</h1>
        <p className="mt-4 text-lg leading-relaxed text-bark">{category.blurb}</p>
        <p className="mt-4 text-sm text-bark">
          Covers: {category.subcategories.map((s) => s.name).join(" · ")}
        </p>
      </header>

      <nav aria-label="Area" className="mt-8">
        <ul className="flex flex-wrap gap-2">
          <li>
            <AreaPill href={`/cebu/${category.slug}`} active={!area}>
              All of Metro Cebu
            </AreaPill>
          </li>
          {AREAS.map((a) => (
            <li key={a.slug}>
              <AreaPill
                href={`/cebu/${a.slug}/${category.slug}`}
                active={area?.slug === a.slug}
              >
                {a.name}
              </AreaPill>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10">
        {cards.length > 0 ? (
          <Suspense fallback={<ListingGrid cards={cards} />}>
            <ListingBrowser cards={cards} emptyHref="/help" />
          </Suspense>
        ) : (
          <div className="rounded-sm border border-line bg-cream p-8 text-bark">
            <p className="text-forest">
              We haven&apos;t listed any {category.name.toLowerCase()} providers
              {area ? ` in ${area.name}` : ""} yet.
            </p>
            <p className="mt-2">
              {area ? (
                <>
                  <Link
                    href={`/cebu/${category.slug}`}
                    className="text-forest underline underline-offset-4"
                  >
                    See all of Metro Cebu
                  </Link>
                  , or{" "}
                </>
              ) : null}
              <Link href="/help" className="text-forest underline underline-offset-4">
                tell us what you need
              </Link>{" "}
              and we&apos;ll look for you.
            </p>
          </div>
        )}
      </div>

      <p className="mt-12 max-w-2xl text-sm text-bark">
        Every listing shows how and when we checked it.{" "}
        <Link href="/how-we-check" className="text-forest underline underline-offset-4">
          How we check
        </Link>
        . Run a service like this?{" "}
        <Link href="/for-providers" className="text-forest underline underline-offset-4">
          Get listed for free
        </Link>
        .
      </p>
    </div>
  );
}

function AreaPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex min-h-10 items-center rounded-pill border px-4 text-sm motion-safe:transition-colors ${
        active
          ? "border-forest bg-forest text-cream"
          : "border-line-strong bg-cream text-bark hover:border-forest hover:text-forest"
      }`}
    >
      {children}
    </Link>
  );
}
