# BackHome

Pilot interest landing page. Next.js App Router, Tailwind v4 (CSS-first, no
config file), and a Supabase table behind the one form.

## Environment variables

The site builds and runs without these — every page is static except the
interest form, which fails gracefully and tells the visitor their details were
not saved. Set them before the form is any use.

Create `.env.local` (gitignored via `.env*`):

```sh
# Supabase project URL, e.g. https://abcdefgh.supabase.co
SUPABASE_URL=

# The SECRET key (sb_secret_...), from Dashboard -> Project Settings -> API keys.
# NOT the publishable key. This bypasses row level security and must never be
# given a NEXT_PUBLIC_ prefix or imported from a Client Component.
SUPABASE_SECRET_KEY=

# Any long random string: `openssl rand -hex 32`. Salts the IP hash used for
# rate limiting. Required — an unsalted hash of an IPv4 address is reversible
# by brute force, so it would look like privacy without being it.
IP_HASH_SALT=
```

For deployments, add the same three with `vercel env add`.

## Database

Run [`supabase/migrations/0001_pilot_interest.sql`](supabase/migrations/0001_pilot_interest.sql)
once against the project (Dashboard -> SQL Editor). It creates
`public.pilot_interest`, enables row level security with no policies — so the
publishable key cannot read or write it — and installs the
`submit_pilot_interest()` function that throttles and inserts in one statement.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
