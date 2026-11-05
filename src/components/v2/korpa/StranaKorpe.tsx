"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { cena, grupe, putanjaGrupe, slikaArtikla, tel } from "@/data/v2";
import { brojArtikala, kljucStavke, RedKorpe, useKorpa } from "./Korpa";

export default function StranaKorpe() {
  const { stavke, ucitano, broj, ukupno } = useKorpa();

  if (!ucitano) return <div aria-hidden className="v2-omot animate-pulse pt-14"><div className="h-80 rounded-[28px] bg-sivka" /></div>;

  if (stavke.length === 0) {
    return (
      <div className="v2-omot pt-10 lg:pt-14">
        <div className="rounded-[28px] bg-sivka px-6 py-12 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
            <ShoppingBag aria-hidden className="size-7" strokeWidth={1.5} />
          </span>
          <h1 className="mt-4 text-[clamp(1.875rem,3vw,2.5rem)] font-[550] tracking-[-0.03em]">Korpa je prazna</h1>
          <p className="mt-2 text-[16px] font-light text-sivi-2">Izaberite kategoriju i dodajte artikle.</p>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
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

  return (
    <div className="v2-omot pt-6 lg:pt-10">
      <h1 className="text-[clamp(2rem,3.6vw,3.25rem)] leading-tight font-[550] tracking-[-0.03em]">
        Korpa <span className="text-[18px] font-light tracking-normal text-sivi-2">{brojArtikala(broj)}</span>
      </h1>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:gap-10">
        <ul className="divide-y divide-sivka rounded-[24px] p-4 shadow-[0_0_0_1px_#e8ebed] sm:p-6">
          {stavke.map((s) => (
            <li key={kljucStavke(s)} className="py-4 first:pt-0 last:pb-0">
              <RedKorpe stavka={s} />
            </li>
          ))}
        </ul>

        <aside className="rounded-[24px] bg-ugalj p-6 text-white lg:sticky lg:top-[88px] lg:p-7" aria-label="Pregled porudžbine">
          <p className="text-[15px] text-white/60">Ukupno</p>
          <p className="mt-1 text-[clamp(2.25rem,3vw,2.75rem)] leading-none font-[550] tracking-[-0.03em]">{cena(ukupno)}</p>
          <Link href="/v2/porudzbina" className="mt-6 flex h-[60px] items-center justify-center gap-2.5 rounded-full bg-narandza text-[16px] font-medium text-white uppercase transition-colors hover:bg-narandza-tamna">
            Nastavi na porudžbinu
            <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
          </Link>
          <Link href="/v2" className="mt-2.5 flex h-[52px] items-center justify-center rounded-full text-[15px] ring-1 ring-white/25 transition-colors hover:bg-white/10">Dodaj još proizvoda</Link>
          <a href={tel(firma.fiksni)} className="mt-4 block text-center text-[14px] font-light text-white/70 transition-colors hover:text-white">Poručite i telefonom: <span className="font-medium whitespace-nowrap">{firma.fiksni}</span></a>
        </aside>
      </div>
    </div>
  );
}
