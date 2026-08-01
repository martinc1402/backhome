import { footer, site } from "@/content/site";

/**
 * Forest-green footer closing with an oversized wordmark, mirroring the
 * huts.com footer where the brand name runs at 148px across the full width.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-forest text-cream">
      <div className="mx-auto w-full max-w-6xl px-5 pt-20 pb-10 sm:px-8 sm:pt-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
          <div>
            <p className="max-w-sm leading-relaxed text-cream/75">
              {footer.description}
            </p>
          </div>

          <div>
            <h2 className="type-label font-sans tracking-[0.16em] text-lime uppercase">
              {footer.serviceAreaLabel}
            </h2>
            <p className="mt-4 text-cream/80">{site.serviceArea}</p>
            <p className="mt-5">
              {/* PLACEHOLDER: replace with the real contact address. */}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-cream underline decoration-cream/30 underline-offset-4 hover:decoration-lime"
              >
                {site.contactEmail}
              </a>
            </p>
          </div>

          <div>
            <h2 className="type-label font-sans tracking-[0.16em] text-lime uppercase">
              Legal
            </h2>
            <ul className="mt-4 space-y-3">
              {footer.links.map((link) => (
                <li key={link.label}>
                  {/* PLACEHOLDER: link to real policy pages before launch. */}
                  <a
                    href={link.href}
                    className="text-cream/80 underline decoration-cream/25 underline-offset-4 hover:text-cream hover:decoration-lime"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized closing wordmark. Decorative: the accessible brand name
            is already announced by the header link. */}
        <p
          aria-hidden="true"
          className="type-mega mt-20 font-serif text-cream/90 select-none"
        >
          {site.name}
        </p>

        <div className="mt-10 flex flex-col gap-4 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream/65">
            © {year} {site.name}. All rights reserved.
          </p>
          <p className="max-w-md text-sm text-cream/65 sm:text-right">
            {footer.disclaimer}
          </p>
        </div>
      </div>
    </footer>
  );
}
