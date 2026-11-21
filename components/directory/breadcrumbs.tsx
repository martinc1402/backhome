import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** Breadcrumb trail. The last crumb is the current page and is not a link. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-bark">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="underline decoration-bark/30 underline-offset-4 hover:text-forest hover:decoration-forest"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-forest">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
