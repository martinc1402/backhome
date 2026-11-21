import type { MetadataRoute } from "next";

import { site } from "@/content/site";

/** Preview deployments are kept out of search entirely. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/find"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
