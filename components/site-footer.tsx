import Link from "next/link";

import { footer, site } from "@/content/site";
import { AREAS } from "@/content/directory/taxonomy";
import { launchCategories } from "@/lib/directory";
import { BackHomeMark } from "@/components/ui/icon";

const linkClass =
  "text-cream/80 underline decoration-cream/25 underline-offset-4 hover:text-cream hover:decoration-lime";

function Column({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="type-label font-sans tracking-[0.16em] text-lime uppercase">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("mailto:") ? (
              <a href={link.href} className={linkClass}>
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className={linkClass}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Forest-green footer: directory links, the disclaimer, and the oversized
 * wordmark.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-forest text-cream">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 pb-10 sm:px-8 sm:pt-24">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          <p className="max-w-xs leading-relaxed text-cream/75 sm:col-span-2 lg:col-span-1">
            {footer.description}
          </p>

          <Column
            title="Find care"
            links={launchCategories.map((c) => ({ label: c.name, href: `/cebu/${c.slug}` }))}
          />
          <Column
            title="Areas"
            links={AREAS.map((a) => ({ label: a.name, href: `/cebu/${a.slug}` }))}
          />
          <Column title={site.name} links={footer.backhomeLinks} />
          <Column
            title="Contact"
            links={[
              { label: site.contactEmail, href: `mailto:${site.contactEmail}` },
              ...footer.contactLinks,
            ]}
          />
        </div>

        {/* Oversized closing lockup. Decorative: the brand name is already
            announced by the header link. type-mega-fluid sits on the wrapper so
            the mark's em-based height follows the same fluid clamp as the
            type; see globals.css. */}
        <div
          aria-hidden="true"
          className="type-mega-fluid mt-20 flex items-baseline gap-[0.1em] text-cream/90 select-none"
        >
          <BackHomeMark className="h-[0.72em] w-auto shrink-0" />
          <p className="type-mega-fluid font-serif">{site.name}</p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-cream/15 pt-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-cream/65">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="max-w-md text-sm text-cream/65 sm:text-right">{footer.disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
