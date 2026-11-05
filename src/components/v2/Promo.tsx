"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, SprayCan } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { bojeAuta, cena, linkArtikla, markeVozila, putanjaGrupe, slikaArtikla, tel } from "@/data/v2";
import { useKorpa } from "./korpa/Korpa";
import MarkaPolje from "./MarkaPolje";

const SLIKA = "/img/v2/audi-salon-baza.webp";
const ODSJAJ = "/img/v2/audi-salon-sjaj.webp";
const SLIKA_KOREKTORA = "/img/v2/proizvodi/auto-korektor.webp";
const KAROSERIJA = "/img/v2/audi-salon-karoserija.webp";
const maska = { maskImage: `url(${KAROSERIJA})`, WebkitMaskImage: `url(${KAROSERIJA})`, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" };

const polje = "h-16 w-full min-w-0 rounded-xl bg-transparent px-4 pt-[22px] text-base text-tinta outline-none transition-colors placeholder:text-[#8a8e93] hover:bg-sivka focus:bg-sivka sm:text-[15px]";
const oznaka = "pointer-events-none absolute top-2.5 left-4 z-10 text-[12px] text-sivi-2";
const plocica = "flex items-center gap-3.5 rounded-2xl bg-white/[.06] p-3 ring-1 ring-white/10 transition-colors hover:bg-white/[.11]";

// Prava fotka iz salona: sloj boje u multiply samo preko karoserije, pa odsjaji laka preko njega; pod i senka su sa fotke
function Auto({ boja, prethodna }: { boja: number; prethodna: number }) {
  return (
    <>
      <Image src={SLIKA} alt="" fill sizes="(min-width: 1024px) 66vw, 122vw" className="object-fill" />
      <div aria-hidden className="absolute inset-0 overflow-hidden mix-blend-multiply" style={maska}>
        <div className="absolute inset-0" style={{ backgroundColor: bojeAuta[prethodna].boja }} />
        <div key={boja} className="v2-sprej absolute inset-y-0 left-0 w-[130%]" style={{ background: `linear-gradient(to right, ${bojeAuta[boja].boja} 84%, transparent)` }} />
      </div>
      <Image src={ODSJAJ} alt="" fill sizes="(min-width: 1024px) 66vw, 122vw" className="object-fill" />
    </>
  );
}

export default function Promo() {
  const [boja, setBoja] = useState(0);
  const [prethodna, setPrethodna] = useState(0);
  const [rucno, setRucno] = useState(false);
  const [marka, setMarka] = useState("");
  const [kod, setKod] = useState("");
  const [greska, setGreska] = useState("");
  const koren = useRef<HTMLElement>(null);
  const { dodaj } = useKorpa();

  const poruci = () => {
    if (!marka) return setGreska("Izaberite marku vozila");
    if (!kod.trim()) return setGreska("Upišite kod boje sa nalepnice na autu");
    setGreska("");
    dodaj({ id: 5300, naziv: "Auto korektor", cena: 650, slika: SLIKA_KOREKTORA, puna: true, link: linkArtikla(5300, "Auto korektor"), napomena: `Marka vozila: ${marka}, Kod boje: ${kod.trim()}` });
    setKod("");
  };

  useEffect(() => {
    if (rucno || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(t);
      if (e.isIntersecting)
        t = setInterval(() => {
          setBoja((staro) => {
            setPrethodna(staro);
            return (staro + 1) % bojeAuta.length;
          });
        }, 4200);
    });
    if (koren.current) io.observe(koren.current);
    return () => {
      io.disconnect();
      clearInterval(t);
    };
  }, [rucno]);

  return (
    <section ref={koren} className="v2-omot pt-16" aria-label="Boje za automobile">
      <div className="relative z-20 flex flex-col rounded-[28px] rounded-br-[64px] bg-[#141821] text-white [container-type:inline-size] lg:mx-3">
        <div className="relative order-2 h-[68cqw] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%)] lg:[mask-image:none] lg:absolute lg:inset-0 lg:order-none lg:h-auto lg:rounded-[inherit]">
          <div className="absolute top-0 right-[-18cqw] aspect-[1870/1052] w-[122cqw] lg:top-[13cqw] lg:right-[-8.6cqw] lg:w-[66cqw]">
            <div className="absolute inset-0 isolate">
              <Auto boja={boja} prethodna={prethodna} />
            </div>
          </div>
        </div>

        <div className="relative z-10 order-1 p-7 pb-2 sm:p-12 sm:pb-4 lg:min-h-[calc(70px+37cqw)] lg:max-w-[50cqw] xl:p-14 xl:pb-4">
          <p className="v2-nad">Naša specijalnost</p>
          <h2 className="mt-3 text-[clamp(2.25rem,5cqw,4rem)] leading-[1.06] font-[550] tracking-[-0.035em]">Miksovanje boja za automobile</h2>
          <p className="mt-5 max-w-[30em] text-[17px] leading-normal font-light text-white/65">
            Boju radimo po originalnom kodu vašeg automobila, za {markeVozila.length} marki vozila.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2" role="group" aria-label="Probajte boju na automobilu">
            <div className="flex gap-2">
              {bojeAuta.map((b, i) => (
                <button
                  key={b.naziv}
                  type="button"
                  aria-label={b.naziv}
                  aria-pressed={i === boja}
                  onClick={() => {
                    setRucno(true);
                    setPrethodna(boja);
                    setBoja(i);
                  }}
                  className={`size-8 rounded-full shadow-[inset_0_-6px_10px_rgba(0,0,0,.25),inset_0_4px_8px_rgba(255,255,255,.4)] ring-offset-[3px] ring-offset-[#141821] transition-shadow sm:size-10 ${i === boja ? "ring-2 ring-white" : "ring-1 ring-white/15 hover:ring-white/50"}`}
                  style={{ backgroundColor: b.uzorak }}
                />
              ))}
            </div>
            <span className="text-[15px] text-white/80">{bojeAuta[boja].naziv}</span>
          </div>
        </div>

        <div className="relative z-10 order-3 px-4 pb-7 sm:px-12 sm:pb-12 xl:px-14 xl:pb-14">
          <div className="grid items-center gap-y-1 rounded-[22px] bg-white p-2 text-tinta shadow-[0_30px_60px_-24px_rgba(0,0,0,.8)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto]">
            <div className="max-sm:border-b max-sm:border-sivka sm:border-r sm:border-sivka sm:pr-2">
              <MarkaPolje klasa={polje} oznakaKlasa={oznaka} ikonaKlasa="text-sivi-2" onIzbor={(m) => { setMarka(m); setGreska(""); }} />
            </div>
            <div className="relative sm:pl-2 lg:border-r lg:border-sivka lg:pr-2">
              <label htmlFor="kod-boje" className={`${oznaka} sm:left-6`}>Kod boje</label>
              <input id="kod-boje" type="text" value={kod} onChange={(e) => setKod(e.target.value)} autoComplete="off" placeholder="Sa nalepnice na autu" className={polje} />
            </div>
            <p className="px-4 py-2 text-[13px] leading-tight text-sivi-2 max-lg:border-t max-lg:border-sivka lg:pr-6 lg:pl-5">
              <span className="whitespace-nowrap">Auto korektor{marka && ` za ${marka}`}</span>
              <span className="mt-1 block text-[26px] leading-none font-[550] tracking-[-0.02em] whitespace-nowrap text-tinta">{cena(650)}</span>
            </p>
            <div className="max-lg:border-t max-lg:border-sivka max-lg:pt-2">
              <button type="button" onClick={poruci} className="v2-dugme w-full justify-center sm:w-auto">
                Poruči boju
                <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
              </button>
            </div>
          </div>
          {greska && <p role="alert" className="mt-3 px-2 text-[14px] font-medium text-[#ff9d8a]">{greska}</p>}
          <a href={tel(firma.fiksni)} className="mt-3.5 inline-flex flex-wrap gap-x-1.5 px-2 text-[14px] font-light text-white/60 transition-colors hover:text-white">
            Ne znate gde je kod? Pozovite <span className="font-normal whitespace-nowrap text-white">{firma.fiksni}</span>
          </a>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <li>
              <Link href={linkArtikla(14973, "Mobihel metalik boja u setu")} className={plocica}>
                <span className="relative block size-16 shrink-0">
                  <Image src={slikaArtikla("mobihel-2k")} alt="" fill sizes="64px" className="object-contain" />
                </span>
                <span className="min-w-0 text-[14px] leading-snug text-white/70">
                  Mobihel metalik boja u setu
                  <span className="mt-1 block text-[17px] leading-none font-medium text-white">{cena(8900)}</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href={linkArtikla(14959, "Mipa HS 2K lak CC8")} className={plocica}>
                <span className="relative block size-16 shrink-0">
                  <Image src={slikaArtikla("14959")} alt="" fill sizes="64px" className="object-contain" />
                </span>
                <span className="min-w-0 text-[14px] leading-snug text-white/70">
                  Mipa HS 2K lak CC8, 1 l
                  <span className="mt-1 block text-[17px] leading-none font-medium text-white">{cena(2020)}</span>
                </span>
              </Link>
            </li>
            <li>
              <Link href={putanjaGrupe("Auto program")} className={plocica}>
                <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-white/[.08] text-zlatna">
                  <SprayCan aria-hidden className="size-7" strokeWidth={1.5} />
                </span>
                <span className="min-w-0 text-[15px] leading-snug text-white">Punimo spreje bojom koju želite</span>
              </Link>
            </li>
            <li>
              <Link href={putanjaGrupe("Auto program")} className={`group ${plocica}`}>
                <span className="grid size-16 shrink-0 place-items-center rounded-xl bg-narandza text-white">
                  <ArrowRight aria-hidden className="size-6 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="min-w-0 text-[14px] leading-snug text-white/70">
                  <span className="block text-[15px] text-white">Ceo auto program</span>
                  Kitevi, učvršćivači, razređivači, polir paste
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
