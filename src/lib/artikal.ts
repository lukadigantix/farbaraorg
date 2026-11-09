import { cache } from "react";
import katalog from "@/data/katalog.json";
import { mapiraj } from "./obrada.mjs";

export type Detalji = {
  id: number;
  naziv: string;
  sifra: string;
  cena: number;
  slike: string[];
  opis: string;
  brend: string;
  opcije: { naziv: string; vrednosti: string[] }[];
  osobine: { naziv: string; vrednost: string }[];
  grupa?: string;
  stavke?: string[];
  puna?: boolean;
};

export const izSluga = (slug: string) => Number(slug.match(/-(\d+)$/)?.[1] ?? slug);

// Artikal iz uzorka je odmah tu; ostale (iz pretrage i chata) strana čita uživo iz prodavnice.
// cache: metadata i strana u istom zahtevu dele jedan poziv
export const nadjiArtikal = cache(async function nadjiArtikal(id: number): Promise<Detalji | null> {
  if (!Number.isInteger(id) || id <= 0) return null;
  const izKataloga = katalog.find((p) => p.id === id);
  if (izKataloga) return izKataloga;
  const r = await fetch(`https://www.farbara.org/wp-json/wc/store/v1/products/${id}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10000),
  }).catch(() => null);
  if (!r?.ok) return null;
  const { lokalna: _lokalna, ...a } = mapiraj(await r.json());
  return a.cena >= 2 ? a : null;
});
