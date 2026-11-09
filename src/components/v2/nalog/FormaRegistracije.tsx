"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { registrujSe } from "@/lib/nalog";
import { DugmeSlanja, Polje, PoljeLozinke, PorukaForme, proveri, useForma } from "./Forma";

const jacina = (l: string) => {
  if (l.length < 8) return 0;
  const raznovrsna = /[a-zA-Zа-яА-Я]/.test(l) && /\d/.test(l);
  return l.length >= 12 && raznovrsna ? 3 : raznovrsna || l.length >= 12 ? 2 : 1;
};
const OZNAKA = ["", "Slaba", "Dobra", "Jaka"];
const BOJA = ["", "bg-crvena", "bg-zlatna", "bg-[#14a06a]"];

export default function FormaRegistracije() {
  const [tip, setTip] = useState<"fizicko" | "firma">("fizicko");
  const [uslovi, setUslovi] = useState(false);
  const [greskaUslova, setGreskaUslova] = useState(false);
  const f = useForma(
    { firma: "", pib: "", ime: "", email: "", telefon: "", lozinka: "", uslovi: "" },
    (v) => ({
      ...(tip === "firma" ? { firma: proveri.obavezno(v.firma, "Upišite naziv firme"), pib: proveri.pib(v.pib) } : {}),
      ime: proveri.obavezno(v.ime, "Upišite ime i prezime"),
      email: proveri.email(v.email),
      telefon: proveri.telefon(v.telefon),
      lozinka: proveri.novaLozinka(v.lozinka),
      uslovi: uslovi ? undefined : "Potrebno je da prihvatite uslove",
    }),
    (v) =>
      registrujSe({
        tip,
        ime: v.ime.trim(),
        email: v.email.trim(),
        telefon: v.telefon.trim(),
        lozinka: v.lozinka,
        ...(tip === "firma" ? { firma: v.firma.trim(), pib: v.pib.trim() } : {}),
      }),
  );
  const nivo = jacina(f.vrednosti.lozinka);

  return (
    <form
      ref={f.forma}
      onSubmit={(e) => {
        if (!uslovi) setGreskaUslova(true);
        f.posalji(e);
      }}
      noValidate
      className="space-y-3"
    >
      <fieldset className="grid grid-cols-2 gap-1 rounded-2xl bg-[#f0f1f1] p-1">
        <legend className="sr-only">Registrujete se kao</legend>
        {(
          [
            ["fizicko", "Fizičko lice"],
            ["firma", "Firma"],
          ] as const
        ).map(([v, t]) => (
          <label key={v} className={`flex h-11 cursor-pointer items-center justify-center rounded-xl text-[15px] transition-colors has-focus-visible:ring-2 has-focus-visible:ring-zlatna ${tip === v ? "bg-ugalj text-white" : "hover:bg-white/60"}`}>
            <input type="radio" name="tip" value={v} checked={tip === v} onChange={() => setTip(v)} className="sr-only" />
            {t}
          </label>
        ))}
      </fieldset>

      {tip === "firma" && (
        <div className="v2-meni-ulaz grid gap-3 sm:grid-cols-[1.6fr_1fr]">
          <Polje oznaka="Naziv firme" autoComplete="organization" {...f.polje("firma")} />
          <Polje oznaka="PIB" inputMode="numeric" maxLength={9} autoComplete="off" {...f.polje("pib")} />
        </div>
      )}
      <Polje oznaka="Ime i prezime" autoComplete="name" {...f.polje("ime")} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Polje oznaka="E-mail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" {...f.polje("email")} />
        <Polje oznaka="Telefon" type="tel" inputMode="tel" autoComplete="tel" {...f.polje("telefon")} />
      </div>
      <div>
        <PoljeLozinke oznaka="Lozinka" autoComplete="new-password" opis={nivo === 0 ? "Najmanje 8 znakova" : undefined} {...f.polje("lozinka")} />
        {nivo > 0 && (
          <div className="mt-2 flex items-center gap-2 px-1" aria-live="polite">
            <span aria-hidden className="flex flex-1 gap-1">
              {[1, 2, 3].map((n) => (
                <span key={n} className={`h-1 flex-1 rounded-full transition-colors ${n <= nivo ? BOJA[nivo] : "bg-[#e3e7e6]"}`} />
              ))}
            </span>
            <span className="w-11 text-right text-[13px] text-sivi-2">{OZNAKA[nivo]}</span>
          </div>
        )}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 py-1.5 text-[14px] leading-snug">
          <input
            type="checkbox"
            name="uslovi"
            checked={uslovi}
            onChange={(e) => {
              setUslovi(e.target.checked);
              if (e.target.checked) setGreskaUslova(false);
            }}
            aria-invalid={greskaUslova}
            className="peer sr-only"
          />
          <span className={`mt-px grid size-5 shrink-0 place-items-center rounded-md ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zlatna ${uslovi ? "bg-ugalj text-white ring-ugalj" : greskaUslova ? "ring-2 ring-crvena" : "bg-white ring-[#c4c9c8]"}`}>
            {uslovi && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
          </span>
          <span>
            Prihvatam <Link href="/uslovi-koriscenja" target="_blank" className="text-narandza underline underline-offset-2">uslove korišćenja</Link> i <Link href="/politika-privatnosti" target="_blank" className="text-narandza underline underline-offset-2">politiku privatnosti</Link>
          </span>
        </label>
        {greskaUslova && <p className="mt-0.5 px-1 text-[13px] text-crvena">Potrebno je da prihvatite uslove</p>}
      </div>

      <PorukaForme tekst={f.poruka} />
      <DugmeSlanja salje={f.salje}>Napravi nalog</DugmeSlanja>
    </form>
  );
}
