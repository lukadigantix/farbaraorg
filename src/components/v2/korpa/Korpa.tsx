"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { cena } from "@/data/v2";

export type StavkaKorpe = { id: number; naziv: string; sifra?: string; cena: number; slika: string; puna?: boolean; link: string; napomena?: string; kolicina: number };
type Novo = Omit<StavkaKorpe, "kolicina"> & { kolicina?: number };
type Obavestenje = { tip: "dodato"; stavka: Novo } | { tip: "uklonjeno"; stavka: StavkaKorpe; mesto: number };

type Vrednost = {
  stavke: StavkaKorpe[];
  ucitano: boolean;
  broj: number;
  ukupno: number;
  dodaj: (s: Novo, tiho?: boolean) => void;
  promeni: (kljuc: string, kolicina: number) => void;
  ukloni: (kljuc: string) => void;
};

const KLJUC = "lisa-korpa-v1";
const MAX = 999;
const Kontekst = createContext<Vrednost | null>(null);

export const kljucStavke = (s: Pick<StavkaKorpe, "id" | "napomena">) => `${s.id}|${s.napomena ?? ""}`;
export const brojArtikala = (n: number) => {
  const j = n % 10;
  const d = n % 100;
  if (j === 1 && d !== 11) return `${n} artikal`;
  return `${n} ${j >= 2 && j <= 4 && (d < 12 || d > 14) ? "artikla" : "artikala"}`;
};

export function useKorpa() {
  const v = useContext(Kontekst);
  if (!v) throw new Error("useKorpa van KorpaProvider");
  return v;
}

export function KorpaProvider({ children }: { children: ReactNode }) {
  const [stavke, setStavke] = useState<StavkaKorpe[]>([]);
  const [ucitano, setUcitano] = useState(false);
  const [poruka, setPoruka] = useState<Obavestenje | null>(null);
  const tajmer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const procitaj = () => {
      try {
        const s = JSON.parse(localStorage.getItem(KLJUC) ?? "[]");
        if (Array.isArray(s)) setStavke(s);
      } catch {}
    };
    procitaj();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage postoji tek u browseru
    setUcitano(true);
    // Druga kartica browsera menja istu korpu
    const naPromenu = (e: StorageEvent) => {
      if (e.key === KLJUC) procitaj();
    };
    addEventListener("storage", naPromenu);
    return () => removeEventListener("storage", naPromenu);
  }, []);

  useEffect(() => {
    if (!ucitano) return;
    try {
      localStorage.setItem(KLJUC, JSON.stringify(stavke));
    } catch {}
  }, [stavke, ucitano]);

  const obavesti = useCallback((o: Obavestenje) => {
    setPoruka(o);
    if (tajmer.current) clearTimeout(tajmer.current);
    tajmer.current = setTimeout(() => setPoruka(null), o.tip === "uklonjeno" ? 6000 : 3500);
  }, []);

  useEffect(
    () => () => {
      if (tajmer.current) clearTimeout(tajmer.current);
    },
    [],
  );

  const dodaj = useCallback(
    (n: Novo, tiho = false) => {
      const kolicina = n.kolicina ?? 1;
      setStavke((sve) => {
        const k = kljucStavke(n);
        return sve.some((s) => kljucStavke(s) === k)
          ? sve.map((s) => (kljucStavke(s) === k ? { ...s, kolicina: Math.min(MAX, s.kolicina + kolicina) } : s))
          : [...sve, { ...n, kolicina }];
      });
      if (!tiho) obavesti({ tip: "dodato", stavka: n });
    },
    [obavesti],
  );

  const promeni = useCallback((kljuc: string, kolicina: number) => {
    setStavke((sve) => sve.map((s) => (kljucStavke(s) === kljuc ? { ...s, kolicina: Math.min(MAX, Math.max(1, kolicina)) } : s)));
  }, []);

  const ukloni = useCallback(
    (kljuc: string) => {
      const mesto = stavke.findIndex((s) => kljucStavke(s) === kljuc);
      if (mesto < 0) return;
      obavesti({ tip: "uklonjeno", stavka: stavke[mesto], mesto });
      setStavke(stavke.filter((_, i) => i !== mesto));
    },
    [stavke, obavesti],
  );

  const vrati = () => {
    if (poruka?.tip !== "uklonjeno") return;
    const { stavka, mesto } = poruka;
    setStavke((sve) => [...sve.slice(0, mesto), stavka, ...sve.slice(mesto)]);
    setPoruka(null);
  };

  const vrednost = useMemo<Vrednost>(
    () => ({
      stavke,
      ucitano,
      broj: stavke.reduce((z, s) => z + s.kolicina, 0),
      ukupno: stavke.reduce((z, s) => z + s.kolicina * s.cena, 0),
      dodaj,
      promeni,
      ukloni,
    }),
    [stavke, ucitano, dodaj, promeni, ukloni],
  );

  return (
    <Kontekst.Provider value={vrednost}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 top-4 z-[90] flex justify-end">
        {poruka && (
          <div key={`${poruka.tip}-${kljucStavke(poruka.stavka)}-${poruka.stavka.kolicina}`} className="v2 v2-chat-ulaz pointer-events-auto flex w-full max-w-[380px] items-center gap-3 rounded-2xl bg-ugalj p-2.5 pr-3 text-white shadow-[0_24px_50px_-16px_rgba(35,40,50,.7)]">
            {poruka.tip === "dodato" ? (
              <>
                <span className="relative block size-12 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image src={poruka.stavka.slika} alt="" fill sizes="48px" className={poruka.stavka.puna ? "object-cover" : "object-contain p-1"} />
                </span>
                <span className="min-w-0 flex-1 text-[14px] leading-tight">
                  <span className="flex items-center gap-1 text-zlatna">
                    <Check aria-hidden className="size-3.5" strokeWidth={3} />
                    Dodato u korpu
                  </span>
                  <span className="mt-0.5 block truncate">{poruka.stavka.naziv}</span>
                </span>
                <Link href="/korpa" onClick={() => setPoruka(null)} className="grid h-9 shrink-0 place-items-center rounded-full bg-white px-3.5 text-[14px] font-medium text-tinta transition-colors hover:bg-sivka">
                  Korpa
                </Link>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1 pl-2 text-[14px] leading-tight">
                  Uklonjeno
                  <span className="mt-0.5 block truncate text-white/70">{poruka.stavka.naziv}</span>
                </span>
                <button type="button" onClick={vrati} className="h-9 shrink-0 rounded-full bg-white px-3.5 text-[14px] font-medium text-tinta transition-colors hover:bg-sivka">
                  Vrati
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </Kontekst.Provider>
  );
}

export function KorpaDugme() {
  const { broj } = useKorpa();
  return (
    <Link href="/korpa" aria-label={`Korpa, ${brojArtikala(broj)}`} className="relative grid size-10 place-items-center transition-colors hover:text-narandza">
      <ShoppingBag aria-hidden className="size-[22px]" strokeWidth={1.75} />
      {broj > 0 && (
        <span key={broj} className="v2-bedz absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-narandza px-1 text-[11px] leading-none font-medium text-white">
          {broj > 99 ? "99+" : broj}
        </span>
      )}
    </Link>
  );
}

export function Kolicina({ vrednost, promeni, naziv, velika }: { vrednost: number; promeni: (n: number) => void; naziv: string; velika?: boolean }) {
  const [unos, setUnos] = useState<string | null>(null);
  const dugme = `grid shrink-0 place-items-center rounded-full transition-colors enabled:hover:bg-white disabled:opacity-30 ${velika ? "size-11" : "size-8"}`;
  return (
    <div className={`inline-flex items-center rounded-full bg-[#f0f1f1] ${velika ? "h-[60px] p-2" : "h-10 p-1"}`} role="group" aria-label={`Količina: ${naziv}`}>
      <button type="button" aria-label="Manje" disabled={vrednost <= 1} onClick={() => promeni(vrednost - 1)} className={dugme}>
        <Minus aria-hidden className="size-4" strokeWidth={2.25} />
      </button>
      <input
        inputMode="numeric"
        aria-label="Količina"
        value={unos ?? vrednost}
        onFocus={(e) => e.target.select()}
        onChange={(e) => setUnos(e.target.value.replace(/\D/g, "").slice(0, 3))}
        onBlur={() => {
          if (unos !== null) promeni(Math.min(MAX, Math.max(1, Number(unos) || 1)));
          setUnos(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={`min-w-0 bg-transparent text-center text-base font-medium tabular-nums outline-none ${velika ? "w-10" : "w-8"}`}
      />
      <button type="button" aria-label="Više" disabled={vrednost >= MAX} onClick={() => promeni(vrednost + 1)} className={dugme}>
        <Plus aria-hidden className="size-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}

export function RedKorpe({ stavka, posle }: { stavka: StavkaKorpe; posle?: () => void }) {
  const { promeni, ukloni } = useKorpa();
  const k = kljucStavke(stavka);
  return (
    <div className="flex gap-3">
      <Link href={stavka.link} onClick={posle} className="relative block size-[84px] shrink-0 overflow-hidden rounded-xl bg-sivka">
        <Image src={stavka.slika} alt="" fill sizes="84px" className={stavka.puna ? "object-cover" : "object-contain p-2 mix-blend-multiply"} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <Link href={stavka.link} onClick={posle} className="line-clamp-2 text-[15px] leading-snug transition-colors hover:text-narandza">{stavka.naziv}</Link>
            {stavka.napomena && <p className="mt-0.5 text-[13px] leading-snug font-light text-sivi-2">{stavka.napomena}</p>}
          </div>
          <button type="button" aria-label={`Ukloni: ${stavka.naziv}`} onClick={() => ukloni(k)} className="-mt-1 -mr-1 grid size-8 shrink-0 place-items-center rounded-full text-sivi-2 transition-colors hover:bg-sivka hover:text-crvena">
            <Trash2 aria-hidden className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-2">
          <Kolicina vrednost={stavka.kolicina} promeni={(n) => promeni(k, n)} naziv={stavka.naziv} />
          <p className="ml-auto text-right leading-tight">
            <span className="block text-[17px] font-semibold whitespace-nowrap">{cena(stavka.cena * stavka.kolicina)}</span>
            {stavka.kolicina > 1 && <span className="block text-[12px] font-light whitespace-nowrap text-sivi-2">{cena(stavka.cena)} po komadu</span>}
          </p>
        </div>
      </div>
    </div>
  );
}
