import Image from "next/image";
import Link from "next/link";

import { Breadcrumbs } from "@/components/directory/breadcrumbs";
import { CheckBadge } from "@/components/directory/check-badge";
import type { Listing } from "@/content/directory/types";
import { site } from "@/content/site";
import {
  areaName,
  careModeName,
  categoryName,
  checkStatus,
  formatDate,
  formatPhone,
  formatPrice,
  languageName,
  listingHref,
  subcategoryName,
  telHref,
  whatsappHref,
} from "@/lib/directory";

/** Body of /cebu/[category]/[provider-slug]. */
export function ListingView({ listing }: { listing: Listing }) {
  const status = checkStatus(listing);
  const url = `https://backhome.ph${listingHref(listing)}`;

  const reportHref =
    `mailto:${site.contactEmail}` +
    `?subject=${encodeURIComponent(`Problem with a listing: ${listing.name}`)}` +
    `&body=${encodeURIComponent(`Listing: ${url}\n\nWhat happened:\n`)}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: categoryName(listing.category), href: `/cebu/${listing.category}` },
          {
            label: areaName(listing.area),
            href: `/cebu/${listing.area}/${listing.category}`,
          },
          { label: listing.name },
        ]}
      />

      {listing.sample ? (
        <p className="mt-6 rounded-sm border border-brown/30 bg-sand/50 px-5 py-3 text-sm text-brown">
          This is a sample listing for testing the site. The provider does not
          exist.
        </p>
      ) : null}

      <header className="mt-8 max-w-3xl">
        <p className="text-sm text-bark">
          {listing.subcategories.map(subcategoryName).join(" · ")} ·{" "}
          {areaName(listing.area)}
        </p>
        <h1 className="type-h2 mt-3 text-forest">{listing.name}</h1>
        <div className="mt-4">
          <CheckBadge status={status} size="md" />
        </div>
      </header>

      {listing.photos.length > 0 ? (
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {listing.photos.map((photo, i) => (
            <li
              key={`${photo.src}-${i}`}
              className={`relative overflow-hidden rounded-sm bg-moss/15 ${
                i > 0
                  ? "aspect-[3/2]"
                  : listing.photos.length > 1
                    ? "col-span-2 aspect-[3/2] sm:row-span-2 sm:aspect-auto"
                    : "col-span-2 aspect-[3/2]"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={i === 0 ? "(min-width: 640px) 50vw, 100vw" : "(min-width: 640px) 25vw, 50vw"}
                className="object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
        <div className="space-y-12">
          <Block title="BackHome notes">
            <p className="text-lg leading-relaxed text-ink">{listing.notes}</p>
          </Block>

          <Block title="Services">
            <BulletList items={listing.services} />
          </Block>

          <Block title="Who they suit">
            <BulletList items={listing.suits} />
          </Block>

          <Block title="Licences and permits">
            {listing.licences.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead className="text-bark">
                    <tr className="border-b border-line">
                      <th scope="col" className="py-2 pr-4">Type</th>
                      <th scope="col" className="py-2 pr-4">Number</th>
                      <th scope="col" className="py-2">Checked</th>
                    </tr>
                  </thead>
                  <tbody className="text-ink">
                    {listing.licences.map((l) => (
                      <tr key={`${l.type}-${l.number}`} className="border-b border-line">
                        <td className="py-3 pr-4">{l.type}</td>
                        <td className="py-3 pr-4 font-mono text-[0.8125rem]">{l.number}</td>
                        <td className="py-3">{formatDate(l.checkedOn)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-bark">
                We haven&apos;t checked this provider&apos;s licences and permits
                yet.
              </p>
            )}
          </Block>

          <Block title="What families say">
            {listing.feedback.length > 0 ? (
              <ul className="space-y-6">
                {listing.feedback.map((f) => (
                  <li key={`${f.from}-${f.date}`}>
                    <blockquote className="border-l-2 border-moss/40 pl-5">
                      <p className="leading-relaxed text-ink">{f.text}</p>
                      <footer className="mt-2 text-sm text-bark">
                        {f.from}, {formatDate(f.date)}
                      </footer>
                    </blockquote>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-bark">No family feedback yet.</p>
            )}
            <p className="mt-6 text-sm text-bark">
              Used this provider?{" "}
              <a
                href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(`Feedback: ${listing.name}`)}`}
                className="text-forest underline underline-offset-4"
              >
                Tell us how it went
              </a>
              .
            </p>
          </Block>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-sm border border-line bg-cream p-6 shadow-card">
            <p className="text-sm text-bark">Price</p>
            <p className="mt-1 font-serif text-2xl text-forest">
              {formatPrice(listing.price)}
            </p>
            {listing.price.note ? (
              <p className="mt-1 text-sm text-bark">{listing.price.note}</p>
            ) : null}

            <div className="mt-6 flex flex-col gap-3">
              {listing.contact.phone ? (
                <a
                  href={telHref(listing.contact.phone)}
                  className="inline-flex min-h-12 items-center justify-center rounded-pill bg-forest px-6 text-cream hover:bg-forest-deep"
                >
                  Call {formatPhone(listing.contact.phone)}
                </a>
              ) : null}
              {listing.contact.whatsapp ? (
                <a
                  href={whatsappHref(
                    listing.contact.whatsapp,
                    `Hello, I found ${listing.name} on BackHome.`,
                  )}
                  className="inline-flex min-h-12 items-center justify-center rounded-pill border border-forest px-6 text-forest hover:bg-forest hover:text-cream"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Message on WhatsApp
                </a>
              ) : null}
              <Link
                href={`/help?provider=${encodeURIComponent(listing.slug)}`}
                className="inline-flex min-h-12 items-center justify-center rounded-pill border border-bark/35 px-6 text-bark hover:border-forest hover:text-forest"
              >
                Send an enquiry
              </Link>
            </div>

            <dl className="mt-8 space-y-4 text-sm">
              <Fact label="Hours">{listing.hours}</Fact>
              <Fact label="Response time">{listing.responseTime}</Fact>
              <Fact label="Languages">
                {listing.languages.map(languageName).join(", ")}
              </Fact>
              <Fact label="Care offered">
                {listing.careModes.map(careModeName).join(", ")}
              </Fact>
              <Fact label="Dementia experience">
                {listing.dementiaExperience ? "Yes" : "Not stated"}
              </Fact>
              <Fact label="PhilHealth / HMO">
                {[
                  listing.acceptsPhilHealth ? "PhilHealth accepted" : null,
                  listing.acceptsHMO ? "HMO accepted" : null,
                ]
                  .filter(Boolean)
                  .join(", ") || "Not accepted, or not stated"}
              </Fact>
              {listing.address ? <Fact label="Address">{listing.address}</Fact> : null}
              {listing.contact.website ? (
                <Fact label="Website">
                  <a
                    href={listing.contact.website}
                    className="break-all text-forest underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {listing.contact.website.replace(/^https?:\/\//, "")}
                  </a>
                </Fact>
              ) : null}
              {listing.contact.facebook ? (
                <Fact label="Facebook">
                  <a
                    href={listing.contact.facebook}
                    className="text-forest underline underline-offset-4"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook page
                  </a>
                </Fact>
              ) : null}
            </dl>
          </div>

          <p className="mt-5 text-sm text-bark">
            Something wrong with this listing, or a bad experience with this
            provider?{" "}
            <a href={reportHref} className="text-forest underline underline-offset-4">
              Report a problem
            </a>{" "}
            by emailing{" "}
            <span className="break-all text-ink select-all">{site.contactEmail}</span>.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-bark">
            BackHome is a directory, not a care provider. Please make your own
            checks before hiring anyone.
          </p>
        </aside>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="type-h4 text-forest">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-ink">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-bark">{label}</dt>
      <dd className="mt-0.5 text-ink">{children}</dd>
    </div>
  );
}
