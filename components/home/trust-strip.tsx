import { trustStrip } from "@/content/site";
import { checkedCount, formatDate, lastUpdated } from "@/lib/directory";
import { Icon } from "@/components/ui/icon";

/**
 * Three promises plus a live count. The count and date come from the real
 * listings only (never samples), and the page revalidates daily, so they
 * cannot drift from the data.
 */
export function TrustStrip() {
  const count = checkedCount();
  const updated = lastUpdated();

  return (
    <section aria-label="How BackHome works" className="border-b border-line bg-cream">
      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8">
        <ul className="flex flex-col gap-3 text-sm text-ink md:flex-row md:flex-wrap md:gap-x-8">
          {trustStrip.points.map((point) => (
            <li key={point} className="flex items-start gap-2.5">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-bark">
          {count > 0
            ? `${count} ${count === 1 ? "provider" : "providers"} checked` +
              (updated ? ` · updated ${formatDate(updated)}` : "")
            : trustStrip.noneYet}
        </p>
      </div>
    </section>
  );
}
