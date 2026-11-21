import Link from "next/link";

import { recentlyChecked as copy } from "@/content/site";
import { ListingGrid } from "@/components/directory/listing-browser";
import { recentlyChecked, toCardData } from "@/lib/directory";
import { SectionHeading } from "@/components/ui/section-heading";

/**
 * The six most recently checked real providers. Samples never appear here,
 * so until the first real check this shows an honest empty state.
 */
export function RecentlyChecked() {
  const now = new Date();
  const cards = recentlyChecked(6, now).map((l) =>
    toCardData(l, { showCategory: true, now }),
  );

  return (
    <section className="bg-base py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={copy.eyebrow} heading={copy.heading} />
          <Link href="/#find-care" className="text-sm text-forest underline underline-offset-4">
            Browse by type of care <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="mt-10">
          {cards.length > 0 ? (
            <ListingGrid cards={cards} />
          ) : (
            <p className="max-w-2xl rounded-sm border border-dashed border-line-strong bg-cream p-6 text-bark">
              {copy.empty}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
