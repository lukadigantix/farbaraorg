"use client";

import { useEffect, useId, useRef, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import type { Rezultat } from "@/lib/nalog";

export const proveri = {
  email: (v: string) => (!v.trim() ? "Upišite e-mail" : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? undefined : "E-mail nije ispravan"),
  lozinka: (v: string) => (!v ? "Upišite lozinku" : undefined),
  novaLozinka: (v: string) => (!v ? "Izaberite lozinku" : v.length < 8 ? "Lozinka mora imati najmanje 8 znakova" : undefined),
  obavezno: (v: string, poruka: string) => (v.trim() ? undefined : poruka),
  telefon: (v: string) => (!v.trim() ? "Upišite broj telefona" : v.replace(/\D/g, "").length < 8 ? "Broj telefona nije ispravan" : undefined),
  pib: (v: string) => (!v.trim() ? "Upišite PIB" : /^\d{9}$/.test(v.trim()) ? undefined : "PIB ima tačno 9 cifara"),
};

type Greske = Record<string, string | undefined>;

// Greška se pokazuje tek kad korisnik napusti polje ili pokuša da pošalje formu
export function useForma<T extends Record<string, string>>(pocetno: T, pravila: (v: T) => Greske, slanje: (v: T) => Promise<Rezultat>) {
  const [vrednosti, setVrednosti] = useState(pocetno);
  const [dodirnuto, setDodirnuto] = useState<Record<string, boolean>>({});
  const [salje, setSalje] = useState(false);
  const [poruka, setPoruka] = useState("");
  const forma = useRef<HTMLFormElement>(null);
  const greske = pravila(vrednosti);

  // Next drži napuštenu stranu skrivenu u memoriji: lozinka i ostali unosi ne ostaju u njoj
  useEffect(
    () => () => {
      setVrednosti(pocetno);
      setDodirnuto({});
      setPoruka("");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const polje = (ime: keyof T & string) => ({
    name: ime,
    value: vrednosti[ime],
    greska: dodirnuto[ime] ? greske[ime] : undefined,
    onChange: (e: { target: { value: string } }) => {
      setVrednosti((v) => ({ ...v, [ime]: e.target.value }));
      setPoruka("");
    },
    onBlur: () => setDodirnuto((d) => ({ ...d, [ime]: true })),
  });

  const posalji = async (e: FormEvent) => {
    e.preventDefault();
    if (salje) return;
    const lose = Object.keys(greske).filter((k) => greske[k]);
    if (lose.length) {
      setDodirnuto((d) => ({ ...d, ...Object.fromEntries(lose.map((k) => [k, true])) }));
      const prvo = [...(forma.current?.elements ?? [])].find((el) => lose.includes((el as HTMLInputElement).name)) as HTMLElement | undefined;
      prvo?.focus();
      return;
    }
    setSalje(true);
    setPoruka("");
    const r = await slanje(vrednosti);
    setSalje(false);
    if (!r.ok) setPoruka(r.poruka);
  };

  return { vrednosti, setVrednosti, polje, posalji, forma, salje, poruka, greske, dodirnuto };
}

type PoljeProps = Omit<ComponentProps<"input">, "className"> & { oznaka: string; greska?: string; opis?: string; desno?: ReactNode };

export function Polje({ oznaka, greska, opis, desno, ...input }: PoljeProps) {
  const id = useId();
  const dodatak = greska ? `${id}-g` : opis ? `${id}-o` : undefined;
  return (
    <div>
      <div className="relative">
        <label htmlFor={id} className="pointer-events-none absolute top-2.5 left-4 z-10 text-[12px] text-sivi-2">{oznaka}</label>
        <input
          id={id}
          aria-invalid={!!greska}
          aria-describedby={dodatak}
          className={`h-[62px] w-full min-w-0 rounded-xl border bg-white px-4 pt-[22px] text-base transition-shadow outline-none placeholder:text-[#8a8e93] sm:text-[15px] ${desno ? "pr-12" : ""} ${greska ? "border-crvena ring-[3px] ring-crvena/15" : "border-[#d8dbe0] focus:border-narandza focus:ring-[3px] focus:ring-narandza/20"}`}
          {...input}
        />
        {desno}
      </div>
      {greska ? (
        <p id={`${id}-g`} className="mt-1.5 px-1 text-[13px] text-crvena">{greska}</p>
      ) : (
        opis && <p id={`${id}-o`} className="mt-1.5 px-1 text-[13px] font-light text-sivi-2">{opis}</p>
      )}
    </div>
  );
}

export function PoljeLozinke(props: Omit<PoljeProps, "desno" | "type">) {
  const [vidi, setVidi] = useState(false);
  const Ikona = vidi ? EyeOff : Eye;
  return (
    <Polje
      {...props}
      type={vidi ? "text" : "password"}
      desno={
        <button type="button" aria-label={vidi ? "Sakrij lozinku" : "Prikaži lozinku"} aria-pressed={vidi} onMouseDown={(e) => e.preventDefault()} onClick={() => setVidi((x) => !x)} className="absolute top-1/2 right-2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-sivi-2 transition-colors hover:text-tinta">
          <Ikona aria-hidden className="size-5" strokeWidth={1.75} />
        </button>
      }
    />
  );
}

export function DugmeSlanja({ salje, children }: { salje: boolean; children: ReactNode }) {
  return (
    <button type="submit" disabled={salje} className="flex h-[60px] w-full items-center justify-center gap-2.5 rounded-full bg-narandza text-[16px] font-medium text-white uppercase transition-colors hover:bg-narandza-tamna disabled:opacity-70">
      {salje && <LoaderCircle aria-hidden className="size-5 animate-spin" />}
      {children}
    </button>
  );
}

export function PorukaForme({ tekst }: { tekst: string }) {
  if (!tekst) return null;
  return <p role="alert" className="v2-chat-ulaz rounded-xl bg-breskva px-4 py-3 text-[14px] leading-snug text-narandza-tamna">{tekst}</p>;
}
