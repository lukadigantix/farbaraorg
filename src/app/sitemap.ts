import type { MetadataRoute } from "next";
import katalog from "@/data/katalog.json";
import { SAJT } from "@/data/sadrzaj";
import { grupe, linkArtikla, putanjaGrupe } from "@/data/v2";

// Proizvodi su za sada samo uzorak iz katalog.json; kad dođe backend, ovde idu svi artikli iz baze
export default function sitemap(): MetadataRoute.Sitemap {
  const strane = ["", "/o-nama", "/kontakt", "/pitanja-i-odgovori", "/dostava", "/nacin-placanja", "/uslovi-koriscenja", "/politika-privatnosti"];
  const artikli = [...new Map(katalog.map((p) => [p.id, p])).values()];
  return [
    ...strane.map((s) => ({ url: `${SAJT}${s}/`, changeFrequency: "monthly" as const, priority: s ? 0.5 : 1 })),
    ...grupe.map((g) => ({ url: `${SAJT}${putanjaGrupe(g.naziv)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...artikli.map((p) => ({ url: `${SAJT}${linkArtikla(p.id, p.naziv)}`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
