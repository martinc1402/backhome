import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryView } from "@/components/directory/category-view";
import {
  assertDirectoryIntegrity,
  getLaunchCategory,
  hasRealListings,
  launchCategories,
} from "@/lib/directory";

/* /cebu/[category]. Only launch categories have pages; anything else 404s. */

// Regenerate daily so check badges lapse on time without a redeploy. Must be
// a literal: Next reads segment config statically.
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  assertDirectoryIntegrity();
  return launchCategories.map((c) => ({ first: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/cebu/[first]">,
): Promise<Metadata> {
  const { first } = await props.params;
  const category = getLaunchCategory(first);
  if (!category) return {};

  return {
    title: `${category.name} in Cebu | BackHome`,
    description: `${category.blurb} Checked providers in Cebu City, Mandaue, Lapu-Lapu and Talisay, with how and when we checked each one.`,
    // Filters live in the query string and are client-side, so every
    // filtered URL shares this canonical, the unfiltered page.
    alternates: { canonical: `/cebu/${category.slug}` },
    // Not indexed until it holds a real listing; see hasRealListings().
    robots: hasRealListings(category.slug)
      ? undefined
      : { index: false, follow: true },
  };
}

export default async function CategoryPage(props: PageProps<"/cebu/[first]">) {
  const { first } = await props.params;
  if (!getLaunchCategory(first)) notFound();

  return <CategoryView categorySlug={first} />;
}
