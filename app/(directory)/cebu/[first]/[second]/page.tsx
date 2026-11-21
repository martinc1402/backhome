import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryView } from "@/components/directory/category-view";
import { ListingView } from "@/components/directory/listing-view";
import { AREAS } from "@/content/directory/taxonomy";
import {
  allListings,
  areaName,
  assertDirectoryIntegrity,
  categoryName,
  getArea,
  getLaunchCategory,
  getListing,
  hasRealListings,
  launchCategories,
} from "@/lib/directory";

/* ---------------------------------------------------------------------------
   One route, two kinds of page:

     /cebu/[area]/[category]           e.g. /cebu/mandaue/care-at-home
     /cebu/[category]/[provider-slug]  e.g. /cebu/care-at-home/some-agency

   Next cannot hold two differently named dynamic segments at the same level,
   so the first segment is resolved here: an area slug means a filtered list,
   a category slug means a listing. Area and category slugs never overlap —
   assertDirectoryIntegrity() fails the build if they do.
--------------------------------------------------------------------------- */

export const revalidate = 86400;
export const dynamicParams = false;

type Resolved =
  | { kind: "area"; area: string; category: string }
  | { kind: "listing"; listing: NonNullable<ReturnType<typeof getListing>> }
  | null;

function resolve(first: string, second: string): Resolved {
  if (getArea(first) && getLaunchCategory(second)) {
    return { kind: "area", area: first, category: second };
  }
  const listing = getListing(first, second);
  return listing ? { kind: "listing", listing } : null;
}

export function generateStaticParams() {
  assertDirectoryIntegrity();
  return [
    ...AREAS.flatMap((a) =>
      launchCategories.map((c) => ({ first: a.slug, second: c.slug })),
    ),
    ...allListings().map((l) => ({ first: l.category, second: l.slug })),
  ];
}

export async function generateMetadata(
  props: PageProps<"/cebu/[first]/[second]">,
): Promise<Metadata> {
  const { first, second } = await props.params;
  const page = resolve(first, second);
  if (!page) return {};

  if (page.kind === "area") {
    const category = getLaunchCategory(page.category)!;
    const area = getArea(page.area)!;
    return {
      title: `${category.name} in ${area.name}, Cebu | BackHome`,
      description: `${category.blurb} Providers in ${area.name}, each showing how and when BackHome checked it.`,
      // Shared by every filtered variant of this URL.
      alternates: { canonical: `/cebu/${area.slug}/${category.slug}` },
      // Not indexed until it holds a real listing; see hasRealListings().
      robots: hasRealListings(category.slug, area.slug)
        ? undefined
        : { index: false, follow: true },
    };
  }

  const { listing } = page;
  return {
    title: `${listing.name}: ${categoryName(listing.category)} in ${areaName(listing.area)} | BackHome`,
    description: listing.notes,
    alternates: { canonical: `/cebu/${listing.category}/${listing.slug}` },
    // Sample listings are test data and must never be indexed.
    robots: listing.sample ? { index: false, follow: true } : undefined,
  };
}

export default async function Page(props: PageProps<"/cebu/[first]/[second]">) {
  const { first, second } = await props.params;
  const page = resolve(first, second);
  if (!page) notFound();

  return page.kind === "area" ? (
    <CategoryView categorySlug={page.category} areaSlug={page.area} />
  ) : (
    <ListingView listing={page.listing} />
  );
}
