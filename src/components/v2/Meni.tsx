"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ChevronRight, Phone } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { grupe, putanjaGrupe, slikaArtikla, tel } from "@/data/v2";

// Meni pokazuje samo glavne kategorije; podkategorije su filteri na strani kategorije
export function ProdavnicaDugme() {
  const [otvoreno, setOtvoreno] = useState(false);
  const koren = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!otvoreno) return;
    const klik = (e: MouseEvent) => {
      if (!koren.current?.contains(e.target as Node)) setOtvoreno(false);
    };
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoreno(false);
    };
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", taster);
    return () => {
      document.removeEventListener("mousedown", klik);
      document.removeEventListener("keydown", taster);
    };
  }, [otvoreno]);

  return (
    <div ref={koren} className="hidden shrink-0 lg:block">
      <button
        type="button"
        aria-expanded={otvoreno}
        onClick={() => setOtvoreno((o) => !o)}
        className="flex h-11 items-center gap-2 rounded-xl bg-breskva px-4 text-[15px] font-medium text-narandza uppercase transition-colors hover:bg-[#fde5db]"
      >
        Prodavnica
        <ArrowDown aria-hidden className={`size-4 transition-transform ${otvoreno ? "rotate-180" : ""}`} strokeWidth={2.25} />
      </button>
      {otvoreno && (
        <div className="absolute inset-x-0 top-full border-t border-sivka bg-white shadow-[0_30px_50px_-30px_rgba(35,40,50,.5)]">
          <ul className="v2-omot grid max-h-[calc(100dvh-140px)] grid-cols-4 gap-3 overflow-y-auto py-6 xl:grid-cols-7">
            {grupe.map((g) => (
              <li key={g.naziv}>
                <Link href={putanjaGrupe(g.naziv)} onClick={() => setOtvoreno(false)} className="group flex h-full flex-col rounded-2xl bg-sivka p-3 transition-colors hover:bg-breskva">
                  <span className="relative block h-[116px] w-full">
                    <Image src={slikaArtikla(g.slika)} alt="" fill sizes="(min-width: 1280px) 150px, 220px" className="object-contain drop-shadow-[0_10px_9px_rgba(35,40,50,.2)] transition-transform duration-300 group-hover:scale-[1.04]" />
                  </span>
                  <span className="mt-3 block text-[15px] leading-tight transition-colors group-hover:text-narandza">{g.naziv}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const STAVKE = [
  { naziv: "Miksovanje boja", href: putanjaGrupe("Auto program"), istaknuto: true },
  { naziv: "O nama", href: "/v2/o-nama" },
  { naziv: "Pitanja i odgovori", href: "/v2/pitanja-i-odgovori" },
  { naziv: "Kontakt", href: "/v2/kontakt" },
  { naziv: "Prijava / Registracija", href: "/v2/prijava" },
];

const EKSPO = "ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const CRTA = `absolute left-0 block h-[1.5px] w-5 bg-current duration-300 ${EKSPO}`;

// Isto kao meni na pitbike.vercel.app: panel je stalno u stranici i klizne 16 px, stavke ulaze jedna za drugom
export function MobilniMeniV2() {
  const [otvoreno, setOtvoreno] = useState(false);
  const [podmeni, setPodmeni] = useState(false);
  const [visina, setVisina] = useState<string>();
  const panel = useRef<HTMLDivElement>(null);
  const dugme = useRef<HTMLButtonElement>(null);

  const zatvori = () => setOtvoreno(false);

  const prebaci = () => {
    if (otvoreno) return zatvori();
    const roditelj = panel.current?.offsetParent;
    if (roditelj) setVisina(`calc(100dvh - ${Math.max(0, roditelj.getBoundingClientRect().bottom)}px)`);
    setPodmeni(false);
    setOtvoreno(true);
  };

  useEffect(() => {
    if (!otvoreno) return;
    const koren = document.documentElement;
    const staro = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    koren.dataset.meniOtvoren = "";
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoreno(false);
    };
    // Logo, pretraga ili korpa iz zaglavlja zatvaraju meni pre nego što se otvori nešto drugo
    const klik = (e: MouseEvent) => {
      const cilj = e.target as Element;
      const uZaglavlju = cilj.closest("header a, header button");
      if (uZaglavlju && !panel.current?.contains(cilj) && !dugme.current?.contains(cilj)) setOtvoreno(false);
    };
    const desktop = matchMedia("(min-width: 1024px)");
    const naSirinu = () => {
      if (desktop.matches) setOtvoreno(false);
    };
    document.addEventListener("keydown", taster);
    document.addEventListener("click", klik, true);
    desktop.addEventListener("change", naSirinu);
    return () => {
      document.body.style.overflow = staro;
      delete koren.dataset.meniOtvoren;
      document.removeEventListener("keydown", taster);
      document.removeEventListener("click", klik, true);
      desktop.removeEventListener("change", naSirinu);
    };
  }, [otvoreno]);

  const ulaz = (i: number) => ({
    className: `transition-all duration-500 ${EKSPO} ${otvoreno ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`,
    style: { transitionDelay: otvoreno ? `${80 + i * 60}ms` : "0ms" },
  });

  return (
    <div className="lg:hidden">
      <button ref={dugme} type="button" aria-label={otvoreno ? "Zatvori meni" : "Otvori meni"} aria-expanded={otvoreno} aria-controls="mobilni-meni" onClick={prebaci} className="-mr-2.5 grid size-10 place-items-center text-tinta">
        <span aria-hidden className="relative block size-5">
          <span className={`${CRTA} top-[4px] transition-transform ${otvoreno ? "translate-y-[5.25px] rotate-45" : ""}`} />
          <span className={`${CRTA} top-[9.25px] transition-all ${otvoreno ? "scale-x-0 opacity-0" : ""}`} />
          <span className={`${CRTA} top-[14.5px] transition-transform ${otvoreno ? "-translate-y-[5.25px] -rotate-45" : ""}`} />
        </span>
      </button>

      <div ref={panel} id="mobilni-meni" inert={!otvoreno} className={`absolute top-full left-0 w-full ${otvoreno ? "" : "pointer-events-none"}`} style={{ height: visina ?? "calc(100dvh - 180px)" }}>
        <div className={`h-full overflow-y-auto overscroll-contain bg-white px-6 pb-24 transition-all duration-500 ${EKSPO} ${otvoreno ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}>
          <ul className="divide-y divide-linija">
            <li {...ulaz(0)}>
              <Link href="/v2" onClick={zatvori} className="block py-4 text-[16px]">Početna</Link>
            </li>
            <li {...ulaz(1)}>
              <button type="button" aria-expanded={podmeni} onClick={() => setPodmeni((o) => !o)} className="flex w-full items-center justify-between py-4 text-[16px]">
                Prodavnica
                <ChevronRight aria-hidden className={`size-3.5 opacity-60 transition-transform duration-200 ${podmeni ? "-rotate-90" : "rotate-90"}`} strokeWidth={2} />
              </button>
              {podmeni && (
                <div className="v2-meni-ulaz">
                  <ul className="flex flex-col items-center gap-10 pt-2 pb-8">
                    {grupe.map((g) => (
                      <li key={g.naziv} className="w-full">
                        <Link href={putanjaGrupe(g.naziv)} onClick={zatvori} className="flex flex-col items-center text-center">
                          <span className="text-[20px] leading-tight font-medium">{g.naziv}</span>
                          <span className="relative mt-5 block h-[170px] w-[72%]">
                            <Image src={slikaArtikla(g.slika)} alt="" fill sizes="72vw" className="object-contain" />
                          </span>
                          <span className="mt-5 inline-flex h-9 items-center rounded-full bg-narandza px-5 text-[14px] text-white">Pogledaj proizvode</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
            {STAVKE.map((s, i) => (
              <li key={s.naziv} {...ulaz(i + 2)}>
                <Link href={s.href} onClick={zatvori} className={`block py-4 text-[16px] ${s.istaknuto ? "text-narandza" : ""}`}>{s.naziv}</Link>
              </li>
            ))}
          </ul>
          <div {...ulaz(STAVKE.length + 2)}>
            <a href={tel(firma.fiksni)} className="mt-6 flex w-fit items-center gap-2 text-[15px]">
              <Phone aria-hidden className="size-4" strokeWidth={1.75} />
              {firma.fiksni}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
