# BackHome

A checked directory of elder care services in Metro Cebu, for Filipino
families overseas and in Cebu. Next.js App Router, Tailwind v4 (CSS-first, no
config file), hosted on Vercel. There is no database.

## Where things live

| What | Where |
| --- | --- |
| Categories, areas, languages, filter options | `content/directory/taxonomy.ts` |
| Provider listings (one object per provider) | `content/directory/listings.ts` |
| Sample listings for testing | `content/directory/samples.ts` |
| Directory queries and check-badge logic | `lib/directory.ts` |
| Homepage copy | `content/site.ts` |
| Privacy and terms (markdown) | `content/legal/` |

### Adding a provider

Add an object to the `listings` array in `content/directory/listings.ts`.
TypeScript will reject an unknown category, area, language or check level.
The page at `/cebu/[category]/[slug]` and its sitemap entry are generated
automatically.

### Removing the sample listings

Delete `content/directory/samples.ts` and the `...sampleListings` line in
`content/directory/listings.ts`.

### Check badges

A listing's badge comes from `checkLevel` and `checkDate`. Once `checkDate` is
more than six months old the badge shows as lapsed. Directory pages regenerate
daily (`revalidate`), so a badge lapses within a day of its due date without a
redeploy.

## Environment variables

The site builds and runs without these; only the forms need them. Create
`.env.local` (gitignored) and add the same values on Vercel with
`vercel env add`. Do not wrap values in quotes when adding them on Vercel —
Vercel stores the quotes literally.

```sh
# Resend API key (re_...). Server-only — never prefix with NEXT_PUBLIC_.
RESEND_API_KEY=

# The From address. Its domain must be verified in Resend.
RESEND_FROM=

# Optional. Where form submissions go. Defaults to hello@backhome.ph.
FOUNDER_EMAIL=
```

## Development

```bash
npm run dev     # http://localhost:3000
npm run lint
npm run build
```
