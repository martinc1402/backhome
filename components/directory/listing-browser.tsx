"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import {
  ListingCard,
  type ListingCardData,
} from "@/components/directory/listing-card";
import {
  CARE_MODES,
  LANGUAGES,
  PRICE_BANDS,
} from "@/content/directory/taxonomy";

/* ---------------------------------------------------------------------------
   Filters and results for a category page.

   State lives in the URL query (?check=visited&lang=cebuano,english&…), so a
   filtered view can be shared or bookmarked, and the page itself stays static:
   the server renders every listing, and filtering happens here. The page wraps
   this in <Suspense> with the unfiltered grid as the fallback, so visitors
   without JavaScript and search engines still see every listing.
--------------------------------------------------------------------------- */

type Filters = {
  check: "" | "visited" | "checked";
  lang: string[];
  price: string;
  mode: string;
  philhealth: boolean;
  hmo: boolean;
  dementia: boolean;
};

function readFilters(params: URLSearchParams): Filters {
  const check = params.get("check");
  return {
    check: check === "visited" || check === "checked" ? check : "",
    lang: (params.get("lang") ?? "").split(",").filter(Boolean),
    price: params.get("price") ?? "",
    mode: params.get("mode") ?? "",
    philhealth: params.get("philhealth") === "1",
    hmo: params.get("hmo") === "1",
    dementia: params.get("dementia") === "1",
  };
}

function matches(card: ListingCardData, f: Filters): boolean {
  const c = card.filter;
  if (f.check === "visited" && c.checkState !== "visited") return false;
  if (f.check === "checked" && c.checkState !== "visited" && c.checkState !== "called") {
    return false;
  }
  if (f.lang.some((l) => !c.languages.includes(l))) return false;
  if (f.price && !c.priceBands.includes(f.price)) return false;
  if (f.mode && !c.careModes.includes(f.mode)) return false;
  if (f.philhealth && !c.philHealth) return false;
  if (f.hmo && !c.hmo) return false;
  if (f.dementia && !c.dementia) return false;
  return true;
}

export function ListingGrid({ cards }: { cards: ListingCardData[] }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <li key={card.key}>
          <ListingCard card={card} />
        </li>
      ))}
    </ul>
  );
}

export function ListingBrowser({
  cards,
  emptyHref,
}: {
  cards: ListingCardData[];
  /** Where to send people when nothing matches. */
  emptyHref: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const filters = readFilters(params);
  const id = useId();
  const [open, setOpen] = useState(false);

  const results = cards.filter((card) => matches(card, filters));
  const activeCount =
    (filters.check ? 1 : 0) +
    filters.lang.length +
    (filters.price ? 1 : 0) +
    (filters.mode ? 1 : 0) +
    (filters.philhealth ? 1 : 0) +
    (filters.hmo ? 1 : 0) +
    (filters.dementia ? 1 : 0);

  // Only offer price bands and care modes that something on this page has.
  const bandsHere = PRICE_BANDS.filter((b) =>
    cards.some((c) => c.filter.priceBands.includes(b.slug)),
  );
  const modesHere = CARE_MODES.filter((m) =>
    cards.some((c) => c.filter.careModes.includes(m.slug)),
  );

  function update(next: Partial<Filters>) {
    const f = { ...filters, ...next };
    const q = new URLSearchParams();
    if (f.check) q.set("check", f.check);
    if (f.lang.length) q.set("lang", f.lang.join(","));
    if (f.price) q.set("price", f.price);
    if (f.mode) q.set("mode", f.mode);
    if (f.philhealth) q.set("philhealth", "1");
    if (f.hmo) q.set("hmo", "1");
    if (f.dementia) q.set("dementia", "1");
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const selectClass = "field-input mt-1.5 w-full";

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
      {/* Collapsed behind a button on phones so results come first; always
          shown from lg up. */}
      <div className="rounded-sm border border-line bg-cream p-5 lg:self-start">
        <button
          type="button"
          className="flex w-full items-center justify-between text-sm text-forest lg:hidden"
          aria-expanded={open}
          aria-controls={`${id}-filters`}
          onClick={() => setOpen((o) => !o)}
        >
          <span>
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </span>
          <span aria-hidden="true" className={open ? "rotate-180" : ""}>
            ▾
          </span>
        </button>

        <form
          id={`${id}-filters`}
          className={`mt-5 space-y-6 text-sm lg:mt-0 lg:block ${open ? "block" : "hidden"}`}
          onSubmit={(e) => e.preventDefault()}
          aria-label="Filter listings"
        >
          <div>
            <label htmlFor={`${id}-check`} className="text-forest">
              How we checked
            </label>
            <select
              id={`${id}-check`}
              className={selectClass}
              value={filters.check}
              onChange={(e) =>
                update({ check: e.target.value as Filters["check"] })
              }
            >
              <option value="">Any, including not yet checked</option>
              <option value="checked">Visited or called</option>
              <option value="visited">Visited in person</option>
            </select>
          </div>

          <fieldset>
            <legend className="text-forest">Speaks</legend>
            <div className="mt-2 space-y-2">
              {LANGUAGES.map((l) => (
                <label key={l.slug} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-forest"
                    checked={filters.lang.includes(l.slug)}
                    onChange={(e) =>
                      update({
                        lang: e.target.checked
                          ? [...filters.lang, l.slug]
                          : filters.lang.filter((x) => x !== l.slug),
                      })
                    }
                  />
                  {l.name}
                </label>
              ))}
            </div>
          </fieldset>

          {bandsHere.length > 0 ? (
            <div>
              <label htmlFor={`${id}-price`} className="text-forest">
                Price
              </label>
              <select
                id={`${id}-price`}
                className={selectClass}
                value={filters.price}
                onChange={(e) => update({ price: e.target.value })}
              >
                <option value="">Any price</option>
                {bandsHere.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {modesHere.length > 1 ? (
            <div>
              <label htmlFor={`${id}-mode`} className="text-forest">
                Type of care
              </label>
              <select
                id={`${id}-mode`}
                className={selectClass}
                value={filters.mode}
                onChange={(e) => update({ mode: e.target.value })}
              >
                <option value="">Any</option>
                {modesHere.map((m) => (
                  <option key={m.slug} value={m.slug}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <fieldset>
            <legend className="text-forest">Also</legend>
            <div className="mt-2 space-y-2">
              {(
                [
                  ["philhealth", "Accepts PhilHealth"],
                  ["hmo", "Accepts HMO"],
                  ["dementia", "Dementia experience"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-forest"
                    checked={filters[key]}
                    onChange={(e) => update({ [key]: e.target.checked })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>

          {activeCount > 0 ? (
            <button
              type="button"
              className="text-forest underline underline-offset-4"
              onClick={() => router.replace(pathname, { scroll: false })}
            >
              Clear filters
            </button>
          ) : null}
        </form>
      </div>

      <div>
        <p className="mb-5 text-sm text-bark" aria-live="polite">
          {results.length === cards.length
            ? `${cards.length} ${cards.length === 1 ? "provider" : "providers"}`
            : `${results.length} of ${cards.length} providers match`}
        </p>

        {results.length > 0 ? (
          <ListingGrid cards={results} />
        ) : (
          <div className="rounded-sm border border-line bg-cream p-8 text-bark">
            <p>Nothing here matches those filters.</p>
            <p className="mt-2">
              Try removing one, or{" "}
              <a href={emptyHref} className="text-forest underline underline-offset-4">
                tell us what you need
              </a>{" "}
              and we&apos;ll look for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
