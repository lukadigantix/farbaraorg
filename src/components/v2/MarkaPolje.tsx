"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { markeVozila } from "@/data/v2";

const bezKvacica = (t: string) => t.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

type Props = { klasa: string; oznakaKlasa: string; ikonaKlasa?: string; onIzbor?: (vrednost: string) => void; oznaka?: string; opcije?: string[]; placeholder?: string };

export default function MarkaPolje({ klasa, oznakaKlasa, ikonaKlasa = "text-white/60", onIzbor, oznaka = "Marka vozila", opcije = markeVozila, placeholder = "Izaberite marku" }: Props) {
  const id = useId();
  const [otvoreno, setOtvoreno] = useState(false);
  const [unos, setUnos] = useState("");
  const [izabrana, setIzabrana] = useState("");
  const [aktivna, setAktivna] = useState(0);
  const koren = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);

  const filtrirano = unos === izabrana ? opcije : opcije.filter((m) => bezKvacica(m).includes(bezKvacica(unos)));

  useEffect(() => {
    if (!otvoreno) return;
    const klik = (e: MouseEvent) => {
      if (!koren.current?.contains(e.target as Node)) {
        setOtvoreno(false);
        setUnos(izabrana);
      }
    };
    document.addEventListener("mousedown", klik);
    return () => document.removeEventListener("mousedown", klik);
  }, [otvoreno, izabrana]);

  useEffect(() => {
    lista.current?.children[aktivna]?.scrollIntoView({ block: "nearest" });
  }, [aktivna]);

  const otvori = () => {
    if (!otvoreno) setAktivna(Math.max(0, opcije.indexOf(izabrana)));
    setOtvoreno(true);
  };

  const izaberi = (m: string) => {
    setIzabrana(m);
    setUnos(m);
    setOtvoreno(false);
    onIzbor?.(m);
  };

  const taster = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!otvoreno) return setOtvoreno(true);
      const n = filtrirano.length || 1;
      setAktivna((a) => (a + (e.key === "ArrowDown" ? 1 : n - 1)) % n);
    } else if (e.key === "Enter" && otvoreno) {
      e.preventDefault();
      if (filtrirano[aktivna]) izaberi(filtrirano[aktivna]);
    } else if (e.key === "Escape" && otvoreno) {
      setOtvoreno(false);
      setUnos(izabrana);
    }
  };

  return (
    <div ref={koren} className="relative">
      <label htmlFor={id} className={oznakaKlasa}>{oznaka}</label>
      <input
        id={id}
        role="combobox"
        aria-expanded={otvoreno}
        aria-controls={`${id}-lista`}
        aria-autocomplete="list"
        autoComplete="off"
        value={unos}
        placeholder={placeholder}
        onChange={(e) => {
          setUnos(e.target.value);
          setAktivna(0);
          setOtvoreno(true);
        }}
        onFocus={otvori}
        onClick={otvori}
        onKeyDown={taster}
        className={`${klasa} pr-11`}
      />
      <ChevronDown aria-hidden className={`pointer-events-none absolute top-1/2 right-4 size-[18px] -translate-y-1/2 transition-transform ${ikonaKlasa} ${otvoreno ? "rotate-180" : ""}`} />

      {otvoreno && (
        <ul
          ref={lista}
          id={`${id}-lista`}
          role="listbox"
          aria-label={oznaka}
          className="absolute inset-x-0 top-full z-30 mt-2 max-h-[264px] overflow-y-auto overscroll-contain rounded-2xl bg-white p-1.5 text-tinta shadow-[0_24px_50px_-16px_rgba(0,0,0,.55)]"
        >
          {filtrirano.length === 0 && <li className="px-3 py-3 text-[15px] text-sivi-2">Nema rezultata. Pozovite nas.</li>}
          {filtrirano.map((m, i) => (
            <li
              key={m}
              role="option"
              aria-selected={m === izabrana}
              onMouseEnter={() => setAktivna(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => izaberi(m)}
              className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-[15px] ${i === aktivna ? "bg-sivka" : ""}`}
            >
              {m}
              {m === izabrana && <Check aria-hidden className="size-4 text-narandza" strokeWidth={2.5} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
