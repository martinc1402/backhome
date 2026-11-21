import type { MetadataRoute } from "next";

import { AREAS } from "@/content/directory/taxonomy";
import { GUIDES } from "@/content/guides";
import { site } from "@/content/site";
import { hasRealListings, launchCategories, listingHref, realListings } from "@/lib/directory";

/* ---------------------------------------------------------------------------
   Only pages that are indexable go in:
     - category, area and area-category pages once they hold a real listing
       (the same hasRealListings() rule that sets their noindex)
     - real listings only; samples never appear
     - guides once written
   Regenerated daily with the directory pages.
--------------------------------------------------------------------------- */

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;

  const fixed = ["/", "/how-we-check", "/help", "/for-providers", "/privacy", "/terms"];
  const guides = GUIDES.filter((g) => g.written);

  return [
    ...fixed.map((p) => ({ url: url(p) })),
    ...(guides.length ? [{ url: url("/guides") }] : []),
    ...guides.map((g) => ({ url: url(`/guides/${g.slug}`) })),

    ...launchCategories
      .filter((c) => hasRealListings(c.slug))
      .map((c) => ({ url: url(`/cebu/${c.slug}`) })),
    ...AREAS.filter((a) => hasRealListings(undefined, a.slug)).map((a) => ({
      url: url(`/cebu/${a.slug}`),
    })),
    ...AREAS.flatMap((a) =>
      launchCategories
        .filter((c) => hasRealListings(c.slug, a.slug))
        .map((c) => ({ url: url(`/cebu/${a.slug}/${c.slug}`) })),
    ),

    ...realListings().map((l) => ({
      url: url(listingHref(l)),
      lastModified: l.checkDate,
    })),
  ];
}
