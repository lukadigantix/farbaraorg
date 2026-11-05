"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export type Sacuvan = { id: number; naziv: string; cena: number; slika: string; brend?: string; sifra?: string; puna?: boolean; izbor?: boolean };

type Vrednost = {
  stavke: Sacuvan[];
  ucitano: boolean;
  jeSacuvan: (id: number) => boolean;
  prebaci: (s: Sacuvan) => void;
  ukloni: (id: number) => void;
};

const KLJUC = "lisa-sacuvano-v1";
const Kontekst = createContext<Vrednost | null>(null);

export function useSacuvano() {
  const v = useContext(Kontekst);
  if (!v) throw new Error("useSacuvano van SacuvanoProvider");
  return v;
}

export function SacuvanoProvider({ children }: { children: ReactNode }) {
  const [stavke, setStavke] = useState<Sacuvan[]>([]);
  const [ucitano, setUcitano] = useState(false);
  const [uklonjen, setUklonjen] = useState<{ stavka: Sacuvan; mesto: number } | null>(null);
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
    const naPromenu = (e: StorageEvent) => {
      if (e.key === KLJUC) procitaj();
    };
    addEventListener("storage", naPromenu);
    return () => {
      removeEventListener("storage", naPromenu);
      if (tajmer.current) clearTimeout(tajmer.current);
    };
  }, []);

  useEffect(() => {
    if (!ucitano) return;
    try {
      localStorage.setItem(KLJUC, JSON.stringify(stavke));
    } catch {}
  }, [stavke, ucitano]);

  const ukloni = useCallback(
    (id: number) => {
      const mesto = stavke.findIndex((s) => s.id === id);
      if (mesto < 0) return;
      setUklonjen({ stavka: stavke[mesto], mesto });
      if (tajmer.current) clearTimeout(tajmer.current);
      tajmer.current = setTimeout(() => setUklonjen(null), 6000);
      setStavke(stavke.filter((s) => s.id !== id));
    },
    [stavke],
  );

  const prebaci = useCallback(
    (s: Sacuvan) => {
      if (stavke.some((x) => x.id === s.id)) ukloni(s.id);
      else {
        setUklonjen(null);
        setStavke([s, ...stavke]);
      }
    },
    [stavke, ukloni],
  );

  const vrednost = useMemo<Vrednost>(() => ({ stavke, ucitano, jeSacuvan: (id) => stavke.some((s) => s.id === id), prebaci, ukloni }), [stavke, ucitano, prebaci, ukloni]);

  return (
    <Kontekst.Provider value={vrednost}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-[88px] z-[75] flex justify-center">
        {uklonjen && (
          <div key={uklonjen.stavka.id} className="v2 v2-chat-ulaz pointer-events-auto flex w-full max-w-[380px] items-center gap-3 rounded-2xl bg-ugalj p-2.5 pl-4 text-white shadow-[0_24px_50px_-16px_rgba(35,40,50,.7)]">
            <span className="min-w-0 flex-1 text-[14px] leading-tight">
              Uklonjeno iz sačuvanih
              <span className="mt-0.5 block truncate text-white/70">{uklonjen.stavka.naziv}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                const { stavka, mesto } = uklonjen;
                setStavke((sve) => [...sve.slice(0, mesto), stavka, ...sve.slice(mesto)]);
                setUklonjen(null);
              }}
              className="h-9 shrink-0 rounded-full bg-white px-3.5 text-[14px] font-medium text-tinta transition-colors hover:bg-sivka"
            >
              Vrati
            </button>
          </div>
        )}
      </div>
    </Kontekst.Provider>
  );
}

export function SacuvanoIkonica() {
  const { stavke } = useSacuvano();
  const n = stavke.length;
  return (
    <Link href="/v2/sacuvani-proizvodi" aria-label={`Sačuvani proizvodi: ${n}`} className="relative grid size-10 place-items-center transition-colors hover:text-narandza">
      <Heart aria-hidden className="size-[22px]" strokeWidth={1.75} />
      {n > 0 && (
        <span key={n} className="v2-bedz absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-narandza px-1 text-[11px] leading-none font-medium text-white">
          {n > 99 ? "99+" : n}
        </span>
      )}
    </Link>
  );
}

export function SrceDugme({ stavka, klasa, velicina = "size-[18px]" }: { stavka: Sacuvan; klasa: string; velicina?: string }) {
  const { jeSacuvan, prebaci } = useSacuvano();
  const on = jeSacuvan(stavka.id);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? `Ukloni iz sačuvanih: ${stavka.naziv}` : `Sačuvaj: ${stavka.naziv}`} onClick={() => prebaci(stavka)} className={klasa}>
      <Heart key={String(on)} aria-hidden className={`${velicina} ${on ? "v2-bedz fill-narandza text-narandza" : ""}`} strokeWidth={2} />
    </button>
  );
}
