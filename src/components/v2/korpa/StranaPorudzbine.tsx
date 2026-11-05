"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Banknote, Check, Landmark, LoaderCircle, ShoppingBag, Store, Truck } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { cena } from "@/data/v2";
import { posaljiPorudzbinu } from "@/lib/porudzbina";
import { Polje, PorukaForme, proveri, useForma } from "../nalog/Forma";
import { kljucStavke, useKorpa } from "./Korpa";

function Deo({ broj, naslov, children }: { broj: number; naslov: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] p-5 shadow-[0_0_0_1px_#e8ebed] sm:p-7">
      <h2 className="flex items-center gap-3 text-[clamp(1.375rem,2vw,1.625rem)] leading-tight font-[550] tracking-[-0.025em]">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-narandza text-[16px] font-medium tracking-normal text-white">{broj}</span>
        {naslov}
      </h2>
      <div className="mt-5 space-y-3">{children}</div>
    </section>
  );
}

function Izbor<T extends string>({ naziv, oznaka, vrednost, promeni, opcije }: { naziv: string; oznaka: string; vrednost: T; promeni: (v: T) => void; opcije: { v: T; naslov: string; opis: string; Ikona: ComponentType<{ className?: string; strokeWidth?: number; "aria-hidden"?: boolean }> }[] }) {
  return (
    <fieldset className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">{oznaka}</legend>
      {opcije.map(({ v, naslov, opis, Ikona }) => {
        const on = vrednost === v;
        return (
          <label key={v} className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-narandza ${on ? "bg-breskva shadow-[inset_0_0_0_2px_var(--color-narandza)]" : "shadow-[inset_0_0_0_1px_#d8dbe0] hover:bg-sivka"}`}>
            <input type="radio" name={naziv} value={v} checked={on} onChange={() => promeni(v)} className="sr-only" />
            <Ikona aria-hidden className={`mt-0.5 size-6 shrink-0 ${on ? "text-narandza" : "text-sivi-2"}`} strokeWidth={1.75} />
            <span className="min-w-0 leading-snug">
              <span className="block text-[16px] font-medium">{naslov}</span>
              <span className="mt-0.5 block text-[14px] font-light text-[#5c6470]">{opis}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

export default function StranaPorudzbine() {
  const { stavke, ucitano, ukupno } = useKorpa();
  const [tip, setTip] = useState<"fizicko" | "firma">("fizicko");
  const [preuzimanje, setPreuzimanje] = useState<"dostava" | "radnja">("dostava");
  const [placanje, setPlacanje] = useState<"pouzece" | "racun">("pouzece");
  const [napomena, setNapomena] = useState("");
  const [uslovi, setUslovi] = useState(false);
  const [greskaUslova, setGreskaUslova] = useState(false);
  const f = useForma(
    { firma: "", pib: "", ime: "", email: "", telefon: "", adresa: "", mesto: "", postanskiBroj: "", uslovi: "" },
    (v) => ({
      ...(tip === "firma" ? { firma: proveri.obavezno(v.firma, "Upišite naziv firme"), pib: proveri.pib(v.pib) } : {}),
      ime: proveri.obavezno(v.ime, "Upišite ime i prezime"),
      email: proveri.email(v.email),
      telefon: proveri.telefon(v.telefon),
      ...(preuzimanje === "dostava"
        ? {
            adresa: proveri.obavezno(v.adresa, "Upišite ulicu i broj"),
            mesto: proveri.obavezno(v.mesto, "Upišite mesto"),
            postanskiBroj: !v.postanskiBroj.trim() ? "Upišite poštanski broj" : /^\d{5}$/.test(v.postanskiBroj.trim()) ? undefined : "Poštanski broj ima 5 cifara",
          }
        : {}),
      uslovi: uslovi ? undefined : "Potrebno je da prihvatite uslove",
    }),
    (v) =>
      posaljiPorudzbinu({
        tip,
        ...(tip === "firma" ? { firma: v.firma.trim(), pib: v.pib.trim() } : {}),
        ime: v.ime.trim(),
        email: v.email.trim(),
        telefon: v.telefon.trim(),
        preuzimanje,
        ...(preuzimanje === "dostava" ? { adresa: v.adresa.trim(), mesto: v.mesto.trim(), postanskiBroj: v.postanskiBroj.trim() } : {}),
        placanje,
        napomena: napomena.trim() || undefined,
        stavke,
      }),
  );

  if (!ucitano) return <div aria-hidden className="v2-omot animate-pulse pt-14"><div className="h-80 rounded-[28px] bg-sivka" /></div>;

  if (stavke.length === 0) {
    return (
      <div className="v2-omot pt-10 lg:pt-14">
        <div className="rounded-[28px] bg-sivka px-6 py-12 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-white">
            <ShoppingBag aria-hidden className="size-7" strokeWidth={1.5} />
          </span>
          <h1 className="mt-4 text-[clamp(1.875rem,3vw,2.5rem)] font-[550] tracking-[-0.03em]">Korpa je prazna</h1>
          <Link href="/v2" className="mt-6 inline-flex h-14 items-center rounded-full bg-narandza px-8 font-medium text-white uppercase transition-colors hover:bg-narandza-tamna">Nazad u prodavnicu</Link>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={f.forma}
      onSubmit={(e) => {
        if (!uslovi) setGreskaUslova(true);
        f.posalji(e);
      }}
      noValidate
      className="v2-omot pt-6 lg:pt-10"
    >
      <Link href="/v2/korpa" className="inline-flex items-center gap-2 text-[15px] text-sivi-2 transition-colors hover:text-narandza">
        <ArrowLeft aria-hidden className="size-4" />
        Nazad na korpu
      </Link>
      <h1 className="mt-3 text-[clamp(2rem,3.6vw,3.25rem)] leading-tight font-[550] tracking-[-0.03em]">Porudžbina</h1>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-10">
        <div className="space-y-4">
          <Deo broj={1} naslov="Vaši podaci">
            <Izbor
              naziv="tip"
              oznaka="Kupujete kao"
              vrednost={tip}
              promeni={setTip}
              opcije={[
                { v: "fizicko", naslov: "Fizičko lice", opis: "Kupovina na svoje ime", Ikona: ShoppingBag },
                { v: "firma", naslov: "Firma", opis: "Račun na firmu, uz PIB", Ikona: Landmark },
              ]}
            />
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
          </Deo>

          <Deo broj={2} naslov="Preuzimanje">
            <Izbor
              naziv="preuzimanje"
              oznaka="Način preuzimanja"
              vrednost={preuzimanje}
              promeni={setPreuzimanje}
              opcije={[
                { v: "dostava", naslov: "Dostava na adresu", opis: "Rok i cenu potvrđujemo telefonom", Ikona: Truck },
                { v: "radnja", naslov: "Preuzimanje u radnji", opis: firma.adresa, Ikona: Store },
              ]}
            />
            {preuzimanje === "dostava" && (
              <div className="v2-meni-ulaz space-y-3">
                <Polje oznaka="Ulica i broj" autoComplete="street-address" {...f.polje("adresa")} />
                <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
                  <Polje oznaka="Mesto" autoComplete="address-level2" {...f.polje("mesto")} />
                  <Polje oznaka="Poštanski broj" inputMode="numeric" maxLength={5} autoComplete="postal-code" {...f.polje("postanskiBroj")} />
                </div>
              </div>
            )}
          </Deo>

          <Deo broj={3} naslov="Plaćanje">
            <Izbor
              naziv="placanje"
              oznaka="Način plaćanja"
              vrednost={placanje}
              promeni={setPlacanje}
              opcije={[
                { v: "pouzece", naslov: preuzimanje === "radnja" ? "Pri preuzimanju" : "Pouzećem", opis: preuzimanje === "radnja" ? "Plaćate u radnji" : "Plaćate kuriru pri preuzimanju", Ikona: Banknote },
                { v: "racun", naslov: "Uplata na račun", opis: "Šaljemo vam predračun", Ikona: Landmark },
              ]}
            />
            <div className="relative">
              <label htmlFor="napomena" className="pointer-events-none absolute top-2.5 left-4 text-[12px] text-sivi-2">Napomena (nije obavezno)</label>
              <textarea id="napomena" name="napomena" rows={3} value={napomena} onChange={(e) => setNapomena(e.target.value)} className="block w-full resize-y rounded-xl border border-[#d8dbe0] bg-white px-4 pt-8 pb-3 text-base transition-shadow outline-none focus:border-narandza focus:ring-[3px] focus:ring-narandza/20 sm:text-[15px]" />
            </div>
          </Deo>
        </div>

        <aside className="rounded-[24px] bg-ugalj p-6 text-white lg:sticky lg:top-[88px] lg:p-7" aria-label="Pregled porudžbine">
          <h2 className="text-[22px] leading-tight font-[550] tracking-[-0.02em]">Vaša porudžbina</h2>
          <ul className="mt-5 max-h-[280px] divide-y divide-white/10 overflow-y-auto">
            {stavke.map((s) => (
              <li key={kljucStavke(s)} className="flex items-center gap-3 py-3 first:pt-0">
                <span className="relative block size-14 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image src={s.slika} alt="" fill sizes="56px" className={s.puna ? "object-cover" : "object-contain p-1.5"} />
                </span>
                <span className="min-w-0 flex-1 text-[14px] leading-snug">
                  <span className="line-clamp-2">{s.naziv}</span>
                  {s.napomena && <span className="mt-0.5 block truncate text-[12px] font-light text-white/60">{s.napomena}</span>}
                  <span className="mt-0.5 block text-[13px] font-light text-white/60">{s.kolicina} x {cena(s.cena)}</span>
                </span>
                <span className="shrink-0 text-[15px] font-medium whitespace-nowrap">{cena(s.cena * s.kolicina)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-4 text-[15px] font-light text-white/70">
            <span>Dostava</span>
            <span>{preuzimanje === "radnja" ? "Bez dostave" : "Po dogovoru"}</span>
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <span className="text-[15px] text-white/70">Ukupno</span>
            <span className="text-[clamp(2rem,3vw,2.5rem)] leading-none font-[550] tracking-[-0.03em] whitespace-nowrap">{cena(ukupno)}</span>
          </div>

          <div className="mt-5">
            <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-snug">
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
              <span className={`mt-px grid size-5 shrink-0 place-items-center rounded-md ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zlatna ${uslovi ? "bg-narandza text-white ring-narandza" : greskaUslova ? "ring-2 ring-[#ff8a80]" : "ring-white/40"}`}>
                {uslovi && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
              </span>
              <span className="text-white/85">
                Prihvatam <Link href="#" className="underline underline-offset-2">uslove korišćenja</Link> i <Link href="#" className="underline underline-offset-2">politiku privatnosti</Link>
              </span>
            </label>
            {greskaUslova && <p className="mt-1 text-[13px] text-[#ff8a80]">Potrebno je da prihvatite uslove</p>}
          </div>

          {f.poruka && <div className="mt-4"><PorukaForme tekst={f.poruka} /></div>}

          <button type="submit" disabled={f.salje} className="mt-5 flex h-[60px] w-full items-center justify-center gap-2.5 rounded-full bg-narandza text-[16px] font-medium text-white uppercase transition-colors hover:bg-narandza-tamna disabled:opacity-70">
            {f.salje ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : null}
            Poruči
            {!f.salje && <ArrowRight aria-hidden className="size-5" strokeWidth={2} />}
          </button>
        </aside>
      </div>
    </form>
  );
}
