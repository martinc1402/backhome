import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Assets in public/ are otherwise served with `Cache-Control:
        // public, max-age=0`, which would revalidate the hero photo on every
        // visit. Every filename under /media carries a version suffix
        // (hero-cebu-call-still.v1.jpg), so freezing them is safe.
        //
        // The corollary: bump that suffix whenever an asset changes, or
        // returning visitors hold a year-long stale cache. See design/README.md.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// withBotId adds the proxy rewrites BotID's client script talks to. Vercel's
// docs say these are now routed automatically; the wrapper is kept as a
// harmless safety net so the forms never depend on that.
export default withBotId(nextConfig);
