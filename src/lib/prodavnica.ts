// Pretraga po pojmu preko postojeće prodavnice. Kad dođe novi backend, menja se samo ovaj fajl.
import { linkArtikla } from "@/data/v2";
import { lepNaziv, mapiraj, uTekst } from "./obrada.mjs";

type StoreArtikal = {
  id: number;
  name: string;
  sku: string;
  permalink: string;
  description: string;
  short_description: string;
  prices: { price: string; currency_minor_unit: number };
  images: { thumbnail: string }[];
  categories: { name: string }[];
  has_options: boolean;
};

export type ArtikalProdavnice = {
  id: number;
  naziv: string;
  sifra: string;
  kategorija: string;
  cena: number;
  slika: string;
  link: string;
  opis: string;
  izbor: boolean;
};

const ocisti = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);

export async function pretraziProdavnicu(pojam: string): Promise<ArtikalProdavnice[]> {
  const odgovor = await fetch(
    `https://www.farbara.org/wp-json/wc/store/v1/products?per_page=8&search=${encodeURIComponent(pojam)}`,
    { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(10000) },
  );
  if (!odgovor.ok) throw new Error(`Prodavnica: ${odgovor.status}`);

  const artikli = (await odgovor.json()) as StoreArtikal[];
  return artikli.map((a) => ({
    id: a.id,
    naziv: lepNaziv(uTekst(a.name)),
    sifra: a.sku,
    kategorija: a.categories[0]?.name ?? "",
    cena: Math.round(Number(a.prices.price) / 10 ** a.prices.currency_minor_unit),
    slika: a.images[0]?.thumbnail ?? "",
    link: linkArtikla(a.id, lepNaziv(uTekst(a.name))),
    opis: ocisti(a.short_description || a.description),
    izbor: !!a.has_options,
  }));
}

export type ArtikalPretrage = { id: number; naziv: string; sifra: string; cena: number; slika: string; brend: string; izbor: boolean; puna?: boolean };
export type StranaPretrage = { artikli: ArtikalPretrage[]; ukupno: number; strana: number; strana_ukupno: number };

export const PO_STRANI = 24;
const API = "https://www.farbara.org/wp-json/wc/store/v1/products";
const zahtev = (adresa: string) => fetch(adresa, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(10000) });

// Cela lista rezultata za stranu /pretraga, jedna strana po zahtevu (ne povlači katalog)
export async function pretraziStranu(pojam: string, strana: number): Promise<StranaPretrage> {
  const odgovor = await zahtev(`${API}?per_page=${PO_STRANI}&page=${strana}&search=${encodeURIComponent(pojam)}`);
  // Strana iza poslednje vraća 400
  if (odgovor.status === 400) return { artikli: [], ukupno: 0, strana, strana_ukupno: 0 };
  if (!odgovor.ok) throw new Error(`Prodavnica: ${odgovor.status}`);
  const ukupno = Number(odgovor.headers.get("X-WP-Total") ?? 0);
  const artikli = ((await odgovor.json()) as Parameters<typeof mapiraj>[0][]).map(mapiraj).filter((a) => a.cena >= 2);
  return {
    artikli: artikli.map((a) => ({ id: a.id, naziv: a.naziv, sifra: a.sifra, cena: a.cena, slika: a.slike[0] ?? "", brend: a.brend, izbor: a.opcije.length > 0, ...(a.puna ? { puna: true } : {}) })),
    ukupno,
    strana,
    strana_ukupno: Math.ceil(ukupno / PO_STRANI),
  };
}

// Stara adresa /artikli/<slug>/ sa farbara.org vodi na novu stranu proizvoda
export async function adresaPoStarom(slug: string): Promise<string | null> {
  const odgovor = await zahtev(`${API}?slug=${encodeURIComponent(slug)}`).catch(() => null);
  if (!odgovor?.ok) return null;
  const [a] = (await odgovor.json()) as { id: number; name: string }[];
  return a ? linkArtikla(a.id, lepNaziv(uTekst(a.name))) : null;
}
