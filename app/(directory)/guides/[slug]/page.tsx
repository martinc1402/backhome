import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/directory/breadcrumbs";
import { GUIDES, getGuide } from "@/content/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  props: PageProps<"/guides/[slug]">,
): Promise<Metadata> {
  const guide = getGuide((await props.params).slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | BackHome`,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}` },
    // Shells are placeholders: keep them out of search until written.
    robots: guide.written ? undefined : { index: false, follow: true },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const guide = getGuide((await props.params).slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-5 sm:px-8">
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />

      <header className="mt-8">
        <p className="type-label tracking-[0.16em] text-moss uppercase">{guide.topic}</p>
        <h1 className="type-h2 mt-5 text-forest">{guide.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-bark">{guide.summary}</p>
      </header>

      {guide.written ? null : (
        <p className="mt-8 rounded-sm border border-line bg-cream p-5 text-sm leading-relaxed text-bark">
          We&apos;re still writing this guide. In the meantime, you can{" "}
          <Link href="/help" className="text-forest underline underline-offset-4">
            ask us directly
          </Link>
          .
        </p>
      )}

      <div className="mt-10 space-y-10">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="type-h4 text-forest">{s.heading}</h2>
            {/* [TO WRITE] markers stay visible until the guide is written. */}
            <p className="mt-3 leading-relaxed text-bark">[TO WRITE] {s.toWrite}</p>
          </section>
        ))}
      </div>

      <aside className="on-dark mt-16 rounded-card bg-forest p-6 text-cream sm:p-8">
        <p className="font-serif text-2xl">Need help with this now?</p>
        <p className="mt-3 text-sm leading-relaxed text-cream/85">
          Browse checked providers in the directory, or tell us what&apos;s happening and
          our Cebu team will help.
        </p>
        <p className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link href="/help" className="underline decoration-cream/40 underline-offset-4 hover:decoration-cream">
            Get help finding care
          </Link>
          <Link href="/#find-care" className="underline decoration-cream/40 underline-offset-4 hover:decoration-cream">
            Browse the directory
          </Link>
        </p>
      </aside>
    </article>
  );
}
