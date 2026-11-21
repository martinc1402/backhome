# Placeholder images

The images still in this folder are placeholders. Each SVG carries a visible
`▨ PLACEHOLDER` badge so nothing can ship to production by accident.

Real photography does **not** live here — it goes in `public/media/` alongside
the hero assets, where it picks up the year-long immutable caching configured
in `next.config.ts`. See the status table below for what is still outstanding.

## How to replace one

1. Drop the real photo into `public/media/` with a `.v1` version suffix
   (`.jpg` / `.webp` recommended) — e.g. `founders.v1.webp`. The suffix is
   load-bearing: everything under `/media` is served immutable, so bump it on
   any recrop, and **never overwrite a version you have already served** — a
   URL that has returned one set of bytes must never return different ones, or
   anyone who loaded the page in between is pinned to the old file for a year.
2. Update the matching `image` entry in `content/site.ts` — change `src`,
   `width`, `height` and `alt`. Nothing else needs to change; every image is
   rendered through `components/ui/placeholder-image.tsx`.
3. Pass `isPlaceholder={false}` at that call site so the corner badge and the
   dashed outline disappear.
4. Delete the placeholder SVG it replaced.

`next/image` automatically serves `.svg` files unoptimised, so no
`next.config.ts` change is needed today. Real raster photos will be optimised
automatically once they replace these files.

## Photo brief

The overall direction is **warm, realistic and everyday**. Natural light, real
homes, ordinary clothing, genuine interactions. The site's visual reference is
[huts.com](https://huts.com) — confident, unhurried, full-bleed photography with
plenty of air around it, never busy or over-composed.

**Avoid:** clinical or medical stock imagery, distressed or frail-looking
elderly people, anything resembling a nursing-home or aged-care brochure,
hospital settings, staged "concerned carer" poses, or generic corporate stock.

Still outstanding:

| Slot | Size | Intended photograph |
| --- | --- | --- |
| Founder story (homepage) | square | Yahnee and Martin together. Relaxed and personal, not a corporate headshot. The card is text-only until this exists; add an `image` to `founder` in `content/site.ts` and render it in `components/home/founder-and-providers.tsx`. |
| Listing photos | 3:2 | Real photos from Visited checks. Until then, listings without photos show "No photos yet"; `listing-photo.svg` is used by the sample listings only. |

In use:

- **Homepage hero** — `public/media/hero-cebu-call-still.v1.jpg`.

Removed in the directory rebuild (recoverable from git history before the
`directory-pivot` merge): the hero video and its poster, the trust photo
(`trust-coordinator.v3.webp`) and the pharmacy photo (`pharmacy-pickup.v1.webp`).

The Open Graph share card is generated at build time from
`app/opengraph-image.tsx` (a typographic card, so it needs no photo). Replace
it there if a photographic share image is wanted later.
