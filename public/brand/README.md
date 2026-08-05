# Brand assets

Source SVGs for the BackHome identity. Small and hand-editable, so they are
tracked here rather than in `design/` (which is gitignored and holds only
large binary masters).

| File | Use |
| --- | --- |
| `backhome-mark.svg` | The mark on a light background. Forest fill, fixed colour. |
| `backhome-mark-mono.svg` | Same mark drawn in `currentColor` — the one to inline or tint. |
| `backhome-mark-reversed.svg` | For dark backgrounds: cream arch, lime heart. |
| `backhome-lockup-horizontal.svg` | Mark + wordmark on one line, 186×48. |
| `backhome-lockup-stacked.svg` | Mark above a centred wordmark, 160×90. |

The favicon variant of the mark is **not** here — it lives at `app/icon.svg`,
where Next.js' file convention picks it up and emits the `<link rel="icon">`
tag automatically. It is a separate drawing with a heavier stroke and a larger
heart, optically corrected for sizes under ~24px.

## Before using these on the site

Three things are unresolved, so nothing here is wired into a component yet:

1. **The lockups contain live text, not outlines.** Both set
   `font-family="Georgia, 'Times New Roman', serif"` as a placeholder. The
   site's display face is Newsreader (`--font-serif`). Point the lockups at
   the real face and convert the text to outlines before shipping them
   anywhere, or they will render in whatever serif the viewer happens to have.

2. **The mark is a different drawing from the one the site renders.** The
   header and footer use `BackHomeMark` in `components/ui/icon.tsx`, which is a
   pitched-roof house with a heart. These files are an arch with a heart.
   Adopting them is a design decision — it means replacing that component, not
   just referencing a file.

3. **The colours are near, but not equal, to the design tokens.** The files use
   `#14330F`, `#FAF6EC` and `#C9E29B`; `app/globals.css` defines
   `--color-forest: #0c310a`, `--color-cream: #fffdf6` and
   `--color-lime: #d5e798`. Reconcile the two before mixing file-based art with
   token-coloured UI, or edges that should match will be visibly off.

Prefer `backhome-mark-mono.svg` when adopting: `currentColor` means it inherits
the token colour from CSS and the third problem disappears.
