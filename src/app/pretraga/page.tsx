import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Form from "next/form";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import ProizvodKartica from "@/components/v2/ProizvodKartica";
import { PozivKartica, Putanja } from "@/components/v2/strane/Delovi";
import { grupe, putanjaGrupe, slikaArtikla } from "@/data/v2";
import { pretraziStranu, type StranaPretrage } from "@/lib/prodavnica";

// Strane rezultata se ne indeksiraju, Google ide preko kategorija i proizvoda
export const metadata: Metadata = { title: "Pretraga", robots: { index: false, follow: true } };

type Upit = Promise<{ q?: string | string[]; strana?: string | string[] }>;
const prvi = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) ?? "";
const adresa = (pojam: string, strana: number) => `/pretraga/?q=${encodeURIComponent(pojam)}${strana > 1 ? `&strana=${strana}` : ""}`;
const oblikBroja = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const reciArtikal = (n: number) => (n % 10 === 1 && n % 100 !== 11 ? "artikal" : "artikala");

export default function Strana({ searchParams }: { searchParams: Upit }) {
  return (
    <section className="v2-omot pt-4 lg:pt-6">
      <Putanja naziv="Pretraga" />
      <Suspense fallback={<Kostur />}>
        <Rezultati searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

function Polje({ pojam }: { pojam: string }) {
  return (
    <Form action="/pretraga/" role="search" className="mt-6 flex h-14 max-w-[640px] items-center gap-3 rounded-full bg-sivka pr-1.5 pl-5 ring-1 ring-transparent transition-shadow focus-within:ring-narandza">
      <Search aria-hidden className="size-5 shrink-0 text-narandza" />
      <input
        key={pojam}
        name="q"
        type="search"
        defaultValue={pojam}
        aria-label="Pretraga"
        placeholder="Naziv, šifra ili brend"
        className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-sivi-2 [&::-webkit-search-cancel-button]:hidden"
      />
      <button type="submit" className="h-11 shrink-0 rounded-full bg-narandza px-5 text-[15px] font-medium text-white transition-colors hover:bg-narandza-tamna">Traži</button>
    </Form>
  );
}

function Kostur() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="mt-6 h-14 max-w-[640px] rounded-full bg-sivka" />
      <div className="mt-10 h-12 w-2/3 max-w-[520px] rounded-xl bg-sivka" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-[300px] rounded-[20px] bg-sivka" />
        ))}
      </div>
    </div>
  );
}

async function Rezultati({ searchParams }: { searchParams: Upit }) {
  const u = await searchParams;
  const pojam = prvi(u.q).trim().slice(0, 80);
  const strana = Math.max(1, Math.floor(Number(prvi(u.strana))) || 1);

  if (pojam.length < 2) {
    return (
      <>
        <h1 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-[550] tracking-[-0.035em] lg:mt-8">Pretraga</h1>
        <Polje pojam={pojam} />
        <Kategorije naslov="Ili izaberite kategoriju" />
      </>
    );
  }

  let rez: StranaPretrage | null = null;
  try {
    rez = await pretraziStranu(pojam, strana);
  } catch {
    rez = null;
  }

  return (
    <>
      <h1 className="mt-6 text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] font-[550] tracking-[-0.035em] break-words lg:mt-8">
        <span className="font-light text-sivi-2">Rezultati za </span>„{pojam}“
      </h1>
      <Polje pojam={pojam} />

      {!rez ? (
        <div className="mt-10">
          <PozivKartica naslov="Pretraga trenutno nije dostupna." tekst="Pokušajte ponovo za minut ili nas pozovite, pa ćemo proveriti umesto vas." />
        </div>
      ) : rez.ukupno === 0 ? (
        <>
          <p className="mt-8 text-[18px] font-light text-sivi-2">Nismo našli nijedan artikal. Proverite reč ili probajte kraći pojam, na primer samo naziv brenda.</p>
          <Kategorije naslov="Pogledajte kategorije" />
          <div className="mt-12">
            <PozivKartica naslov="Ne nalazite artikal?" tekst="Imamo i robu koja nije na sajtu. Pozovite nas i pitajte." />
          </div>
        </>
      ) : (
        <>
          <p className="mt-8 text-[16px] font-light text-sivi-2">
            {oblikBroja(rez.ukupno)} {reciArtikal(rez.ukupno)}
            {rez.strana_ukupno > 1 && `, strana ${rez.strana} od ${rez.strana_ukupno}`}
          </p>
          {rez.artikli.length > 0 ? (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {rez.artikli.map((a) => (
                <li key={a.id}>
                  <ProizvodKartica {...a} sizes="(min-width: 1280px) 220px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 text-[17px]">
              Ova strana je prazna. <Link href={adresa(pojam, 1)} className="text-narandza underline-offset-2 hover:underline">Vratite se na prvu stranu</Link>.
            </p>
          )}
          <Strane pojam={pojam} trenutna={rez.strana} ukupno={rez.strana_ukupno} />
        </>
      )}
    </>
  );
}

function Strane({ pojam, trenutna, ukupno }: { pojam: string; trenutna: number; ukupno: number }) {
  if (ukupno < 2) return null;
  // Prva, poslednja i po jedna oko trenutne; ostalo tri tačke
  const brojevi = [...new Set([1, trenutna - 1, trenutna, trenutna + 1, ukupno])].filter((n) => n >= 1 && n <= ukupno).sort((a, b) => a - b);
  const krug = "grid size-11 place-items-center rounded-full text-[15px] tabular-nums transition-colors";
  return (
    <nav aria-label="Strane rezultata" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      {trenutna > 1 && (
        <Link href={adresa(pojam, trenutna - 1)} aria-label="Prethodna strana" className={`${krug} ring-1 ring-linija hover:bg-sivka`}>
          <ChevronLeft aria-hidden className="size-5" />
        </Link>
      )}
      {brojevi.map((n, i) => (
        <span key={n} className="contents">
          {i > 0 && n - brojevi[i - 1] > 1 && <span aria-hidden className="px-1 text-sivi-2">...</span>}
          {n === trenutna ? (
            <span aria-current="page" className={`${krug} bg-tinta font-medium text-white`}>{n}</span>
          ) : (
            <Link href={adresa(pojam, n)} className={`${krug} hover:bg-sivka`}>{n}</Link>
          )}
        </span>
      ))}
      {trenutna < ukupno && (
        <Link href={adresa(pojam, trenutna + 1)} aria-label="Sledeća strana" className={`${krug} ring-1 ring-linija hover:bg-sivka`}>
          <ChevronRight aria-hidden className="size-5" />
        </Link>
      )}
    </nav>
  );
}

function Kategorije({ naslov }: { naslov: string }) {
  return (
    <div className="mt-12">
      <h2 className="v2-h2">{naslov}</h2>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {grupe.map((g) => (
          <li key={g.naziv}>
            <Link href={putanjaGrupe(g.naziv)} className="group flex h-full flex-col rounded-2xl bg-sivka p-3 transition-colors hover:bg-breskva">
              <span className="relative block h-24 w-full">
                <Image src={slikaArtikla(g.slika)} alt="" fill sizes="180px" className="object-contain" />
              </span>
              <span className="mt-3 text-[15px] leading-tight transition-colors group-hover:text-narandza">{g.naziv}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
