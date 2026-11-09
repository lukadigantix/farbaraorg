import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Phone } from "lucide-react";
import Galerija from "@/components/v2/proizvod/Galerija";
import Kupovina from "@/components/v2/proizvod/Kupovina";
import ProizvodKartica from "@/components/v2/ProizvodKartica";
import katalog from "@/data/katalog.json";
import { firma, SAJT } from "@/data/sadrzaj";
import { cena, grupe, linkArtikla, putanjaGrupe, tel, uSlug } from "@/data/v2";
import { izSluga, nadjiArtikal } from "@/lib/artikal";
import { JsonLd, putanjaSchema } from "@/lib/seo";

const AUTO_KOREKTOR = 5300;

export function generateStaticParams() {
  return [...new Map(katalog.map((p) => [p.id, p])).values()].map((p) => ({ slug: linkArtikla(p.id, p.naziv).split("/").filter(Boolean).pop()! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await nadjiArtikal(izSluga(slug));
  if (!p) return { alternates: { canonical: `/proizvod/${slug}/` } };
  const slika = p.slike[0];
  return {
    title: `${p.naziv}`,
    description: p.opis.slice(0, 155) || `${p.naziv} u prodavnici Lisa Comerc, Beograd.`,
    alternates: { canonical: linkArtikla(p.id, p.naziv) },
    openGraph: { siteName: "Farbara Lisa Comerc", locale: "sr_RS", type: "website", title: p.naziv, url: linkArtikla(p.id, p.naziv), ...(slika ? { images: [slika] } : {}) },
  };
}

function Kostur() {
  return (
    <div aria-hidden className="v2-omot grid animate-pulse gap-8 pt-14 lg:grid-cols-2">
      <div className="aspect-square rounded-[28px] bg-sivka" />
      <div className="space-y-4">
        <div className="h-12 w-4/5 rounded-xl bg-sivka" />
        <div className="h-6 w-1/3 rounded-xl bg-sivka" />
        <div className="h-14 w-1/2 rounded-xl bg-sivka" />
      </div>
    </div>
  );
}

export default function Strana({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Kostur />}>
      <Proizvod params={params} />
    </Suspense>
  );
}

async function Proizvod({ params }: { params: Promise<{ slug: string }> }) {
  const p = await nadjiArtikal(izSluga((await params).slug));
  if (!p) notFound();

  const grupa = grupe.find((g) => g.naziv === p.grupa);
  const stavka = p.stavke?.[0];
  const link = linkArtikla(p.id, p.naziv);
  // Stari tekst govori kupcu da kod upiše u napomenu; ovde za to postoji polje
  const opis = (p.id === AUTO_KOREKTOR ? p.opis.split("\n").filter((r) => !/napomeni|kontaktirajte/i.test(r)).join("\n") : p.opis).split("\n").filter(Boolean);
  const slicni = katalog
    .filter((a) => a.id !== p.id && a.grupa === p.grupa)
    .map((a) => ({ a, tezina: stavka && a.stavke.includes(stavka) ? 0 : 1 }))
    .sort((x, y) => x.tezina - y.tezina)
    .slice(0, 4)
    .map(({ a }) => a);
  const podaci = p.osobine;

  const apsolutna = (u: string) => (u.startsWith("/") ? `${SAJT}${u}` : u);
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.naziv,
      ...(p.sifra ? { sku: p.sifra } : {}),
      image: p.slike.map(apsolutna),
      ...(p.brend ? { brand: { "@type": "Brand", name: p.brend } } : {}),
      ...(opis.length ? { description: opis.join(" ").slice(0, 500) } : {}),
      offers: { "@type": "Offer", url: `${SAJT}${link}`, price: p.cena, priceCurrency: "RSD", itemCondition: "https://schema.org/NewCondition", seller: { "@id": `${SAJT}/#radnja` } },
    },
    putanjaSchema([
      { naziv: "Početna", putanja: "/" },
      ...(grupa ? [{ naziv: grupa.naziv, putanja: putanjaGrupe(grupa.naziv) }] : []),
      { naziv: p.naziv, putanja: link },
    ]),
  ];

  return (
    <div className="v2-omot pt-4 lg:pt-6">
      <JsonLd podaci={schema} />
      <nav aria-label="Putanja" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[14px] text-sivi-2">
        <Link href="/" className="transition-colors hover:text-tinta">Početna</Link>
        {grupa && (
          <>
            <ChevronRight aria-hidden className="size-3.5" />
            <Link href={putanjaGrupe(grupa.naziv)} className="transition-colors hover:text-tinta">{grupa.naziv}</Link>
          </>
        )}
        {grupa && stavka && (
          <>
            <ChevronRight aria-hidden className="size-3.5" />
            <Link href={`${putanjaGrupe(grupa.naziv)}?pod=${uSlug(stavka)}`} className="transition-colors hover:text-tinta">{stavka}</Link>
          </>
        )}
      </nav>

      <div className="mt-4 grid gap-7 lg:mt-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-14">
        <Galerija slike={p.slike} naziv={p.naziv} puna={p.puna} />

        <div className="min-w-0 lg:py-4">
          {p.brend && grupa && (
            <Link href={`${putanjaGrupe(grupa.naziv)}?brend=${encodeURIComponent(p.brend)}`} className="inline-block rounded-full bg-sivka px-3 py-1.5 text-[13px] leading-none font-medium transition-colors hover:bg-breskva">{p.brend}</Link>
          )}
          <h1 className="mt-3 text-[clamp(1.875rem,3.2vw,2.75rem)] leading-[1.1] font-[550] tracking-[-0.03em]">{p.naziv}</h1>
          {p.sifra && <p className="mt-2.5 text-[14px] font-light text-sivi-2">Šifra: {p.sifra}</p>}
          <p className="mt-5 text-[clamp(2.25rem,3.4vw,3rem)] leading-none font-[550] tracking-[-0.03em] text-narandza">{cena(p.cena)}</p>

          <Kupovina
            stavka={{ id: p.id, naziv: p.naziv, cena: p.cena, slika: p.slike[0], puna: p.puna, link }}
            opcije={p.opcije}
            trazikod={p.id === AUTO_KOREKTOR}
            brend={p.brend}
            sifra={p.sifra}
          />

          <a href={tel(firma.fiksni)} className="mt-6 flex items-center gap-3.5 rounded-2xl bg-sivka p-4 transition-colors hover:bg-breskva">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-narandza">
              <Phone aria-hidden className="size-5" strokeWidth={1.75} />
            </span>
            <span className="min-w-0 text-[15px] leading-snug">
              Pitanje o artiklu ili stanju u radnji?
              <span className="block font-medium">{firma.fiksni}</span>
            </span>
          </a>
        </div>
      </div>

      {(opis.length > 0 || podaci.length > 0) && (
        <section className="mt-12 grid gap-8 border-t border-linija pt-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] xl:gap-14">
          {opis.length > 0 && (
            <div>
              <h2 className="text-[24px] leading-tight font-medium">O proizvodu</h2>
              <div className="mt-4 max-w-[68ch] space-y-3 text-[16px] leading-relaxed font-light text-[#4d5361]">
                {opis.map((r, i) => (
                  <p key={i}>{r}</p>
                ))}
              </div>
            </div>
          )}
          {podaci.length > 0 && (
            <div>
              <h2 className="text-[24px] leading-tight font-medium">Podaci</h2>
              <dl className="mt-4 divide-y divide-sivka text-[15px]">
                {podaci.map((o) => (
                  <div key={o.naziv} className="flex justify-between gap-6 py-2.5">
                    <dt className="font-light text-sivi-2">{o.naziv}</dt>
                    <dd className="text-right">{o.vrednost}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>
      )}

      {slicni.length > 0 && (
        <section className="mt-12 border-t border-linija pt-10">
          <h2 className="v2-h2">Iz iste kategorije</h2>
          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {slicni.map((a) => (
              <li key={a.id}>
                <ProizvodKartica id={a.id} naziv={a.naziv} brend={a.brend} cena={a.cena} slika={a.slike[0]} sifra={a.sifra} puna={a.puna} izbor={a.opcije.length > 0} sizes="(min-width: 1024px) 25vw, 46vw" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
