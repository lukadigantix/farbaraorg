import type { MetadataRoute } from "next";
import { SAJT } from "@/data/sadrzaj";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/korpa", "/porudzbina", "/moj-nalog", "/sacuvani-proizvodi", "/pretraga", "/chat"] },
    sitemap: `${SAJT}/sitemap.xml`,
  };
}
