import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/directory/breadcrumbs";
import { getPublishedGuide, publishedGuides } from "@/content/guides";

export const dynamicParams = false;

// Written guides only: shells are not built, so their URLs 404.
export function generateStaticParams() {
  for (const g of publishedGuides) {
    const missing = g.sections.filter((s) => !s.body?.trim());
    if (missing.length) {
      throw new Error(
        `Guide "${g.slug}" is marked written but has no body for: ` +
          missing.map((s) => s.heading).join(", "),
      );
    }
  }
  return publishedGuides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata(
  props: PageProps<"/guides/[slug]">,
): Promise<Metadata> {
  const guide = getPublishedGuide((await props.params).slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | BackHome`,
    description: guide.summary,
    alternates: { canonical: `/guides/${guide.slug}` },
  };
}

export default async function GuidePage(props: PageProps<"/guides/[slug]">) {
  const guide = getPublishedGuide((await props.params).slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl px-5 sm:px-8">
      <Breadcrumbs items={[{ label: "Guides", href: "/guides" }, { label: guide.title }]} />

      <header className="mt-8">
        <p className="type-label tracking-[0.16em] text-moss uppercase">{guide.topic}</p>
        <h1 className="type-h2 mt-5 text-forest">{guide.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-bark">{guide.summary}</p>
      </header>

      <div className="mt-10 space-y-10">
        {guide.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="type-h4 text-forest">{s.heading}</h2>
            {(s.body ?? "").split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="mt-3 leading-relaxed text-ink">
                {para.trim()}
              </p>
            ))}
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
