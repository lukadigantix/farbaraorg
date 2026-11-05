"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { grupe, linkArtikla, putanjaGrupe, slikaArtikla } from "@/data/v2";
import { brojArtikala, useKorpa } from "../korpa/Korpa";
import ProizvodKartica from "../ProizvodKartica";
import { Putanja, VelikiNaslov } from "../strane/Delovi";
import { useSacuvano } from "./Sacuvano";

export default function StranaSacuvano() {
  const { stavke, ucitano } = useSacuvano();
  const { dodaj } = useKorpa();
  const zaKorpu = stavke.filter((s) => !s.izbor);

  return (
    <div className="v2-omot pt-4 lg:pt-6">
      <Putanja naziv="Sačuvani proizvodi" />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 lg:mt-8">
        <VelikiNaslov>Sačuvani proizvodi</VelikiNaslov>
        {zaKorpu.length > 0 && (
          <button
            type="button"
            onClick={() => zaKorpu.forEach((s) => dodaj({ id: s.id, naziv: s.naziv, cena: s.cena, slika: s.slika, puna: s.puna, link: linkArtikla(s.id, s.naziv) }))}
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-narandza px-7 font-medium text-white uppercase transition-colors hover:bg-narandza-tamna sm:w-auto"
          >
            <ShoppingBag aria-hidden className="size-5" strokeWidth={2} />
            Dodaj sve u korpu
          </button>
        )}
      </div>

      {!ucitano ? (
        <div aria-hidden className="mt-8 h-80 animate-pulse rounded-[28px] bg-sivka" />
      ) : stavke.length === 0 ? (
        <>
          <div className="mt-8 rounded-[28px] bg-sivka px-6 py-12 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
              <Heart aria-hidden className="size-7" strokeWidth={1.5} />
            </span>
            <h2 className="mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-[550] tracking-[-0.025em]">Još niste ništa sačuvali</h2>
            <p className="mt-2 text-[16px] font-light text-sivi-2">Kliknite na srce na proizvodu i naći ćete ga ovde.</p>
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
        </>
      ) : (
        <>
          <p className="mt-3 text-[15px] text-sivi-2" aria-live="polite">{brojArtikala(stavke.length)}</p>
          <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {stavke.map((s) => (
              <li key={s.id}>
                <ProizvodKartica id={s.id} naziv={s.naziv} brend={s.brend} cena={s.cena} slika={s.slika} sifra={s.sifra} puna={s.puna} izbor={s.izbor} sizes="(min-width: 1280px) 220px, (min-width: 640px) 30vw, 46vw" />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
