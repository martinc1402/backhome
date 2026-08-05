import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Assets in public/ are otherwise served with `Cache-Control:
        // public, max-age=0`, which would revalidate the ~900KB hero video on
        // every visit. Every filename under /media carries a version suffix
        // (hero-cebu-call.v1.mp4), so freezing them is safe.
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

export default nextConfig;
