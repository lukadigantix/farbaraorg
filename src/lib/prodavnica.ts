// Pretraga po pojmu preko postojeće prodavnice. Kad dođe novi backend, menja se samo ovaj fajl.
import { linkArtikla } from "@/data/v2";
import { lepNaziv, uTekst } from "./obrada.mjs";

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
