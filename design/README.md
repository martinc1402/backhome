# Design sources

Full-resolution masters live in this directory and are **not tracked** — see
`.gitignore`. Only this README ships. Everything the site actually serves is
derived from these masters into `public/media/` by the commands below.

If you have just cloned the repo you will not have the masters. Ask whoever
holds them; the derived assets in `public/media/` are committed, so the site
builds and runs without them.

## `design/hero/` — hero background

| File | Dimensions | Notes |
| --- | --- | --- |
| `hero-video.mp4` | 3856×2148, 5.042 s, 24 fps, H.264, **no audio track** | The shot: an older parent's phone screen lights up as a call comes through. |
| `before-hero.png` | 5504×3072 | The clip's **first** frame — phone screen dark. |
| `after-hero.png` | 5504×3072 | The clip's **last** frame — phone screen lit. |

The clip is a **one-shot reveal**, not a loop. It plays once and holds on the
lit final frame. Looping it would hard-cut back to a dark screen every five
seconds, which reads as a glitch. See `components/hero-media.tsx`.

## Regenerating `public/media/`

`ffmpeg` is not required for day-to-day work — the outputs are committed. You
only need it to re-derive after a recut. A one-off static binary avoids
touching the system:

```bash
npm install ffmpeg-static --no-save
FF=./node_modules/ffmpeg-static/ffmpeg
```

### Desktop video → `hero-cebu-call.v1.mp4` (1920×1070, ~900 KB)

```bash
$FF -y -i design/hero/hero-video.mp4 -an -vf "scale=1920:-2" \
  -c:v libx264 -profile:v high -crf 20 -preset veryslow -pix_fmt yuv420p \
  -movflags +faststart public/media/hero-cebu-call.v1.mp4
```

**Do not use macOS `avconvert` for this.** Its presets are fixed-bitrate and
produce files *larger* than the 2.66 MB source on this near-motionless
footage — measured 4.4 MB at `Preset1280x720`, 6.3 MB at `Preset1920x1080`,
12.9 MB at `PresetHEVCHighestQuality`. CRF 20 lands at 900 KB.

CRF 20 rather than something leaner because the scrim (below) darkens the
image, and darkening compresses the tonal range and *amplifies* banding in the
large smooth cream wall. The bitrate headroom goes there.

`-an` is belt and braces — the source has no audio track to begin with.

### Poster → `hero-cebu-call-poster.v1.jpg` (960×536, ~29 KB)

```bash
sips -Z 960 -s format jpeg -s formatOptions 55 design/hero/before-hero.png \
  --out public/media/hero-cebu-call-poster.v1.jpg
```

Must be the **first** frame (`before-hero.png`). A poster taken from the last
frame would show a lit screen that jumps back to dark the instant playback
starts.

### Mobile still → `hero-cebu-call-still.v1.jpg` (1440×2618, ~132 KB)

```bash
python3 - <<'PY'
from PIL import Image
im = Image.open("design/hero/after-hero.png").convert("RGB")
W, H = im.size
im.crop((int(0.200*W), 0, int(0.507*W), H)).resize((1440, 2618), Image.LANCZOS).save(
    "public/media/hero-cebu-call-still.v1.jpg", "JPEG",
    quality=82, optimize=True, progressive=True)
PY
```

The portrait crop is **baked in at build time on purpose**. `object-cover` on
the full 1.795-aspect landscape frame in a phone-shaped box keeps only ~26 % of
its width and centres on empty wall — the hands and phone fall outside the
frame entirely. The crop window (source x 20.0 %–50.7 %, full height) is
centred on the subject: the lit-screen bloom occupies source x 14.6 %–47.3 %.

The still is the **last** frame, because it has to stand in for the whole shot.

## `design/trust/` — trust & accountability photograph

| File | Dimensions | Notes |
| --- | --- | --- |
| `coordinator-with-couple.webp` | 1280×1589 | A coordinator sitting and laughing with an older couple on their porch. Delivered as-is; this is the master we hold. |

### Trust photo → `trust-coordinator.v3.webp` (1216×1589, ~161 KB)

The master ends on a sunlit door jamb down its right-hand edge — roughly the
last 50 px are flat and blown out (column mean luminance ≈ 213 against ≈ 76 for
the wall beside it, with per-column standard deviation collapsing from ≈ 36 to
≈ 5, i.e. no detail at all). The slot crops to `aspect-4/5` on mobile and
`aspect-3/4` from `lg`, neither of which trims enough width to lose it, so it
rendered as what looked like a white border down the side of the photo.

The jamb's soft edge starts at x ≈ 1218 and is fully blown by x ≈ 1233, so the
cut is at 1216 — clear of the ramp with a couple of pixels to spare:

```sh
# -crop <x> <y> <width> <height>, anchored top-left
dwebp design/trust/coordinator-with-couple.webp -crop 0 0 1216 1589 \
  -o /tmp/trust-crop.png
cwebp -q 86 -m 6 -sharp_yuv /tmp/trust-crop.png \
  -o public/media/trust-coordinator.v3.webp
```

Use `dwebp -crop`, **not** `sips -c`: sips crops from the centre and silently
ignores `--cropOffset` here, which trims half the width off the wrong side and
leaves part of the jamb behind. The failure is easy to miss because the output
has the right dimensions.

`-q 86` is chosen to match the master's bits-per-pixel (161 KB at 1216 wide vs
169 KB at 1280 wide), which keeps the unavoidable second-generation loss off a
source that was already lossy. `cwebp` needs a non-WebP input, hence the PNG in
between.

## `design/pharmacy/` — pharmacy pickup photograph

| File | Dimensions | Notes |
| --- | --- | --- |
| `pharmacy-pickup.webp` | 1280×1280 | A pharmacist handing a bag of medication over the counter to a customer. |

### Pharmacy photo → `pharmacy-pickup.v1.webp` (1280×1280, ~107 KB)

Shipped **as delivered** — no crop or re-encode. It is already square, which is
what the slot renders (`aspect-square`), and all four edges carry real detail
(per-line standard deviation 27–75), so there is no blown border to trim as
there was on the trust photo.

```sh
cp design/pharmacy/pharmacy-pickup.webp public/media/pharmacy-pickup.v1.webp
```

Note this currently fills the **founder story** slot, which wants a portrait of
Yahnee and Martin. It is a stand-in. The image belongs with "Medication and
essential pickups" in the services section, and should move there once a real
founder portrait exists.

## Versioned filenames

Everything under `public/media/` carries a `.v1` suffix and is served with
`Cache-Control: immutable` (see `next.config.ts`). **Bump the suffix whenever
an asset changes**, in the filename and in `content/site.ts`, or returning
visitors will hold a year-long stale cache.

## If the footage is ever recut

Re-run the hero contrast check before shipping. The scrim values in
`components/hero.tsx` are tuned to *this* footage, which is unusually bright:
whole-frame mean relative luminance ≈ 0.53, and the band beneath the headline
peaks near L ≈ 0.85. The previous placeholder-era scrim left the 18 px body
copy at ≈ 4.2:1, under the 4.5:1 WCAG AA bar. The current values measure
≈ 5.6:1 for the headline and ≈ 5.8:1 for the body.

Note the shot gets *brighter* as it plays, so check the last frame, not just
the first.
