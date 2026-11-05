"use client";

import { Children, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, type ReactElement, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = {
  children: ReactNode;
  strelice?: boolean;
  listaKlasa?: string;
};

type LiProps = { "aria-hidden"?: boolean; inert?: boolean };

// Beskonačan krug: stavke su tri puta u nizu, a kad se skrol umiri,
// pozicija se neprimetno vraća u srednji primerak.
export default function Karusel({ children, strelice, listaKlasa = "" }: Props) {
  const lista = useRef<HTMLUListElement>(null);
  const cilj = useRef<number | null>(null);
  const dodir = useRef(false);
  const tajmer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stareMere = useRef<{ krug: number; korak: number } | null>(null);

  const stavke = Children.toArray(children).filter(isValidElement) as ReactElement<LiProps>[];
  const n = stavke.length;

  const mere = useCallback(() => {
    const deca = lista.current?.children as HTMLCollectionOf<HTMLElement> | undefined;
    if (!deca || deca.length < 2 * n || n < 2) return null;
    return { krug: deca[n].offsetLeft - deca[0].offsetLeft, korak: deca[1].offsetLeft - deca[0].offsetLeft };
  }, [n]);

  const pomeriOdmah = (left: number) => lista.current?.scrollTo({ left, behavior: "instant" });

  useLayoutEffect(() => {
    const el = lista.current;
    if (!el) return;
    const postavi = () => {
      const m = mere();
      if (!m) return;
      const staro = stareMere.current;
      const indeks = staro ? Math.round((el.scrollLeft % staro.krug) / staro.korak) % n : 0;
      if (!staro || staro.krug !== m.krug) pomeriOdmah(m.krug + indeks * m.korak);
      stareMere.current = m;
    };
    postavi();
    const ro = new ResizeObserver(postavi);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mere, n]);

  const uSredinu = useCallback(() => {
    const el = lista.current;
    const m = mere();
    if (!el || !m) return;
    const x = el.scrollLeft;
    if (x < m.krug - 1) pomeriOdmah(x + m.krug);
    else if (x >= 2 * m.krug - 1) pomeriOdmah(x - m.krug);
  }, [mere]);

  const naSkrol = () => {
    if (tajmer.current) clearTimeout(tajmer.current);
    tajmer.current = setTimeout(() => {
      if (dodir.current) return;
      cilj.current = null;
      uSredinu();
    }, 140);
  };

  useEffect(
    () => () => {
      if (tajmer.current) clearTimeout(tajmer.current);
    },
    [],
  );

  const pomeri = (smer: number) => {
    const el = lista.current;
    const m = mere();
    if (!el || !m) return;
    let sledeci = (cilj.current ?? Math.round(el.scrollLeft / m.korak) * m.korak) + smer * m.korak;
    // I pri brzim klikovima cilj ostaje u srednjem primerku
    if (sledeci < m.krug || sledeci >= 2 * m.krug) {
      const pomak = sledeci < m.krug ? m.krug : -m.krug;
      pomeriOdmah(el.scrollLeft + pomak);
      sledeci += pomak;
    }
    cilj.current = sledeci;
    const blago = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    el.scrollTo({ left: sledeci, behavior: blago });
  };

  const kopije = (oznaka: string) =>
    stavke.map((s, i) => cloneElement(s, { key: `${oznaka}-${i}`, "aria-hidden": true, inert: true }));

  const dugme = "absolute top-1/2 z-10 hidden size-[47px] -translate-y-1/2 place-items-center rounded-full bg-white text-narandza shadow-[0_8px_20px_-6px_rgba(35,40,50,.35)] transition-colors hover:bg-narandza hover:text-white sm:grid";

  return (
    <div className="relative">
      {strelice && (
        <button type="button" aria-label="Prethodno" onClick={() => pomeri(-1)} className={`${dugme} left-0 -translate-x-1/2`}>
          <ArrowLeft aria-hidden className="size-5" />
        </button>
      )}
      <ul
        ref={lista}
        onScroll={naSkrol}
        onTouchStart={() => {
          dodir.current = true;
        }}
        onTouchEnd={() => {
          dodir.current = false;
          naSkrol();
        }}
        onTouchCancel={() => {
          dodir.current = false;
          naSkrol();
        }}
        className={`v2-karusel flex snap-x snap-mandatory gap-5 overflow-x-auto ${listaKlasa}`}
      >
        {kopije("pre")}
        {stavke}
        {kopije("posle")}
      </ul>
      {strelice && (
        <button type="button" aria-label="Sledeće" onClick={() => pomeri(1)} className={`${dugme} right-0 translate-x-1/2`}>
          <ArrowRight aria-hidden className="size-5" />
        </button>
      )}
    </div>
  );
}
