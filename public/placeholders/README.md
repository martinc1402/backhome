# Placeholder images

Every image on the BackHome site is a placeholder. Each SVG carries a visible
`▨ PLACEHOLDER` badge so nothing can ship to production by accident.

## How to replace one

1. Drop the real photo into this folder (`.jpg` / `.webp` recommended).
2. Update the matching `image` entry in `content/site.ts` — change `src`,
   `width`, `height` and `alt`. Nothing else needs to change; every image is
   rendered through `components/ui/placeholder-image.tsx`.
3. Remove the `isPlaceholder` flag on that entry so the corner badge and the
   dashed outline disappear.

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

| File | Slot | Size | Intended photograph |
| --- | --- | --- | --- |
| `hero-family-call.svg` | Hero, **full-bleed background** | 1920×1080 | An adult child living overseas on a video call with their parents at home in Cebu. Both sides relaxed and smiling. Could equally be a real visit or a warm local support interaction. Needs a wide landscape crop with the subject off-centre — a dark scrim sits over it and the headline is centred on top, so avoid busy detail in the middle. |
| `trust-coordinator.svg` | Trust & accountability section | 900×1100 | A friendly local coordinator sitting and talking with an older family member in a Cebu home or a public setting. Respectful, conversational, at eye level — never standing over them. |
| `founders.svg` | Founder story, left column | 1000×1000 | Martin and his wife together. Relaxed and personal, not a corporate headshot. |

The Open Graph share card is generated at build time from
`app/opengraph-image.tsx` (a typographic card, so it needs no photo). Replace
it there if a photographic share image is wanted later.
