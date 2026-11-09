import fs from "node:fs";
import type { NextConfig } from "next";

// Stare adrese sa farbara.org (WordPress) -> nove. Spisak pravi scripts/stare-adrese.mjs.
const stareAdrese: { izvor: string; cilj: string }[] = JSON.parse(fs.readFileSync(new URL("./src/data/stare-adrese.json", import.meta.url), "utf8"));

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Adrese se završavaju kosom crtom kao na starom WordPress sajtu (/o-nama/), da se poklapaju 1:1 sa onim što je Google indeksirao
  trailingSlash: true,
  // Slike artikala su još na starom sajtu; kad dođe backend, menja se samo ovo
  images: { remotePatterns: [{ protocol: "https", hostname: "www.farbara.org", pathname: "/wp-content/uploads/**" }] },
  cacheComponents: true,
  async redirects() {
    return [
      ...stareAdrese.map(({ izvor, cilj }) => ({ source: izvor, destination: cilj, permanent: true })),
      // Stara pretraga: /?s=lak&post_type=product
      { source: "/", has: [{ type: "query", key: "s", value: "(?<pojam>.+)" }], destination: "/pretraga/?q=:pojam", permanent: true },
    ];
  },
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
