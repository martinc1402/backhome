import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AreaView } from "@/components/directory/area-view";
import { CategoryView } from "@/components/directory/category-view";
import { AREAS } from "@/content/directory/taxonomy";
import {
  assertDirectoryIntegrity,
  getArea,
  getLaunchCategory,
  hasRealListings,
  launchCategories,
} from "@/lib/directory";

/* ---------------------------------------------------------------------------
   One segment, two kinds of page (slugs never overlap, see taxonomy.ts):

     /cebu/[category]  the category across Metro Cebu, with filters
     /cebu/[area]      the launch categories available in one area
--------------------------------------------------------------------------- */

// Regenerate daily so check badges lapse on time without a redeploy. Must be
// a literal: Next reads segment config statically.
export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  assertDirectoryIntegrity();
  return [
    ...launchCategories.map((c) => ({ first: c.slug })),
    ...AREAS.map((a) => ({ first: a.slug })),
  ];
}

// Not indexed until a page holds a real listing; see hasRealListings().
const NOINDEX = { index: false, follow: true } as const;

export async function generateMetadata(
  props: PageProps<"/cebu/[first]">,
): Promise<Metadata> {
  const { first } = await props.params;

  const category = getLaunchCategory(first);
  if (category) {
    return {
      title: `${category.name} in Cebu | BackHome`,
      description: `${category.blurb} Checked providers in Cebu City, Mandaue, Lapu-Lapu and Talisay, with how and when we checked each one.`,
      // Filters live in the query string and are client-side, so every
      // filtered URL shares this canonical, the unfiltered page.
      alternates: { canonical: `/cebu/${category.slug}` },
      robots: hasRealListings(category.slug) ? undefined : NOINDEX,
    };
  }

  const area = getArea(first);
  if (area) {
    return {
      title: `Elder care in ${area.name}, Cebu | BackHome`,
      description: `Caregivers, home nurses, doctors and care homes in ${area.name}, each showing how and when BackHome checked it.`,
      alternates: { canonical: `/cebu/${area.slug}` },
      robots: hasRealListings(undefined, area.slug) ? undefined : NOINDEX,
    };
  }

  return {};
}

export default async function Page(props: PageProps<"/cebu/[first]">) {
  const { first } = await props.params;
  if (getLaunchCategory(first)) return <CategoryView categorySlug={first} />;
  if (getArea(first)) return <AreaView areaSlug={first} />;
  notFound();
}
