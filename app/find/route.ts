import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { getArea, getLaunchCategory } from "@/lib/directory";

/**
 * Target of the homepage search form (a plain GET, so it works without
 * JavaScript). Turns ?need=…&area=… into a directory URL:
 *
 *   need + area  -> /cebu/[area]/[category]
 *   need only    -> /cebu/[category]
 *   neither      -> the homepage's category tiles
 */
export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = getLaunchCategory(params.get("need") ?? "");
  const area = getArea(params.get("area") ?? "");

  if (!category) redirect("/#find-care");
  redirect(area ? `/cebu/${area.slug}/${category.slug}` : `/cebu/${category.slug}`);
}
