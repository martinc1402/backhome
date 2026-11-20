import Image from "next/image";
import Link from "next/link";

import { CheckBadge } from "@/components/directory/check-badge";
import type { CheckStatus } from "@/lib/check";

/**
 * Everything a card needs, precomputed on the server. Cards render inside the
 * client-side filter, so the badge state is decided once on the server rather
 * than by each visitor's clock — that keeps server and client HTML identical.
 */
export type ListingCardData = {
  key: string;
  href: string;
  name: string;
  sample: boolean;
  kicker: string;
  status: CheckStatus;
  summary: string;
  priceText: string;
  languagesText: string;
  photo?: { src: string; alt: string };
  /** Filter attributes. */
  filter: {
    checkState: "visited" | "called" | "lapsed" | "listed";
    languages: string[];
    priceBands: string[];
    careModes: string[];
    philHealth: boolean;
    hmo: boolean;
    dementia: boolean;
  };
};

export function ListingCard({ card }: { card: ListingCardData }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-sm border border-line bg-cream shadow-card motion-safe:transition-shadow hover:shadow-lift">
      <div className="relative aspect-[3/2] bg-moss/15">
        {card.photo ? (
          <Image
            src={card.photo.src}
            alt={card.photo.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute bottom-3 left-4 text-xs text-moss">
            No photos yet
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs text-bark">{card.kicker}</p>
        <h3 className="font-serif text-xl leading-snug text-forest">
          <Link
            href={card.href}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {card.name}
          </Link>
        </h3>
        <CheckBadge status={card.status} />
        <p className="text-sm text-bark">{card.summary}</p>
        <p className="mt-auto pt-2 text-sm text-ink">
          {card.priceText}
          <span className="text-bark"> · {card.languagesText}</span>
        </p>
      </div>
    </article>
  );
}
