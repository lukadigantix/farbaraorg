import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Slike artikala su još na starom sajtu; kad dođe backend, menja se samo ovo
  images: { remotePatterns: [{ protocol: "https", hostname: "www.farbara.org", pathname: "/wp-content/uploads/**" }] },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
