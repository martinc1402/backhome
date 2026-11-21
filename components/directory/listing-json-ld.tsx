import type { Listing } from "@/content/directory/types";
import { site } from "@/content/site";
import { areaName, formatPrice, listingHref } from "@/lib/directory";

function absolute(href: string): string {
  return /^https?:\/\//.test(href) ? href : `${site.url}${href}`;
}

/**
 * schema.org LocalBusiness for a listing page. Real listings only: sample
 * listings are test data and render nothing here.
 *
 * Only facts the listing states. No ratings or reviews: family feedback is
 * not a rating, and we don't mark it up as one.
 */
export function ListingJsonLd({ listing }: { listing: Listing }) {
  if (listing.sample) return null;

  const sameAs = [listing.contact.website, listing.contact.facebook]
    .filter((v): v is string => Boolean(v))
    .map(absolute);

  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    url: `${site.url}${listingHref(listing)}`,
    description: listing.notes,
    ...(listing.contact.phone ? { telephone: listing.contact.phone } : {}),
    address: {
      "@type": "PostalAddress",
      ...(listing.address ? { streetAddress: listing.address } : {}),
      addressLocality: areaName(listing.area),
      addressRegion: "Cebu",
      addressCountry: "PH",
    },
    areaServed: `${areaName(listing.area)}, Cebu`,
    ...(listing.price.kind === "range" ? { priceRange: formatPrice(listing.price) } : {}),
    ...(listing.photos.length ? { image: listing.photos.map((p) => absolute(p.src)) } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
