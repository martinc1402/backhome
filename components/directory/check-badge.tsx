import { formatDate, type CheckStatus } from "@/lib/check";

/**
 * The check badge. One component everywhere, so a listing reads the same on a
 * card, its own page and the homepage.
 *
 *   Visited (current)  green pill  + "checked 3 Nov 2026"
 *   Called (current)   grey pill   + "checked 3 Nov 2026"
 *   Either, lapsed     sand pill "Check lapsed" + "last checked …"
 *   Listed             no pill, a plain line saying it hasn't been checked
 */
export function CheckBadge({
  status,
  size = "sm",
}: {
  status: CheckStatus;
  size?: "sm" | "md";
}) {
  const text = size === "md" ? "text-sm" : "text-xs";

  if (status.state === "unchecked") {
    return (
      <p className={`${text} text-bark`}>
        Added by the provider. Not yet checked by BackHome.
      </p>
    );
  }

  const label = status.level === "visited" ? "Visited" : "Called";

  if (status.state === "lapsed") {
    return (
      <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${text}`}>
        <span className="rounded-pill border border-brown/30 bg-sand/50 px-2.5 py-0.5 text-brown">
          {label} · check lapsed
        </span>
        <span className="text-bark">
          last checked {formatDate(status.date)}, due for a re-check
        </span>
      </p>
    );
  }

  return (
    <p className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${text}`}>
      <span
        className={`rounded-pill px-2.5 py-0.5 ${
          status.level === "visited"
            ? "bg-lime text-forest"
            : "bg-stone/60 text-ink"
        }`}
      >
        {label}
      </span>
      <span className="text-bark">checked {formatDate(status.date)}</span>
    </p>
  );
}
