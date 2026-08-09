import { footer, site } from "@/content/site";
import { BackHomeMark } from "@/components/ui/icon";

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

        {/* Oversized closing lockup. Decorative: the accessible brand name is
            already announced by the header link.

            type-mega-fluid sits on the WRAPPER, not just the wordmark, so the
            mark's em-based height resolves against the same fluid clamp the
            type does — one scale, no second set of breakpoints to keep in sync.

            It is the -fluid variant rather than plain type-mega because
            "BackHome" is one unbreakable word: at type-mega's 4rem floor it is
            298px wide and overflowed a 320px screen. See globals.css.

            Inline at every width. This used to stack below sm, back when the
            floor was 4rem and the wordmark alone filled 298px of a 335px
            container. Lowering the floor to 3rem made that guard obsolete and
            it was left behind: measured at 320px — the narrowest phone worth
            supporting — the mark, gap and wordmark need 247px of the 265px
            available, and 284px of 335px at 390px. */}
        <div
          aria-hidden="true"
          className="type-mega-fluid mt-20 flex items-baseline gap-[0.1em] text-cream/90 select-none"
        >
          <BackHomeMark className="h-[0.72em] w-auto shrink-0" />
          <p className="type-mega-fluid font-serif">{site.name}</p>
        </div>

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
