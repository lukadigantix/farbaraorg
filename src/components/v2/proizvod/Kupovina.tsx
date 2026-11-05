"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Kolicina, useKorpa, type StavkaKorpe } from "../korpa/Korpa";
import MarkaPolje from "../MarkaPolje";
import { SrceDugme } from "../sacuvano/Sacuvano";

const polje = "h-[62px] w-full min-w-0 rounded-xl bg-[#f0f1f1] px-4 pt-[22px] text-base outline-none placeholder:text-[#8a8e93] focus:ring-2 focus:ring-zlatna sm:text-[15px]";
const oznaka = "pointer-events-none absolute top-2.5 left-4 z-10 text-[12px] text-sivi-2";

type Props = { stavka: Omit<StavkaKorpe, "kolicina" | "napomena">; opcije: { naziv: string; vrednosti: string[] }[]; trazikod?: boolean; brend?: string; sifra?: string };

export default function Kupovina({ stavka, opcije, trazikod, brend, sifra }: Props) {
  const { dodaj } = useKorpa();
  const [kolicina, setKolicina] = useState(1);
  const [izbor, setIzbor] = useState<Record<string, string>>({});
  const [kod, setKod] = useState("");
  const [greska, setGreska] = useState("");
  const [dodato, setDodato] = useState(false);

  const kupi = () => {
    const nedostaje = opcije.find((o) => !izbor[o.naziv]);
    if (nedostaje) return setGreska(`Izaberite: ${nedostaje.naziv.toLowerCase()}`);
    if (trazikod && !kod.trim()) return setGreska("Upišite kod boje sa nalepnice na autu");
    setGreska("");
    const delovi = [...opcije.map((o) => `${o.naziv}: ${izbor[o.naziv]}`), ...(trazikod ? [`Kod boje: ${kod.trim()}`] : [])];
    dodaj({ ...stavka, sifra, kolicina, napomena: delovi.join(", ") || undefined });
    setDodato(true);
    setTimeout(() => setDodato(false), 1600);
  };

  return (
    <div className="mt-6">
      {(opcije.length > 0 || trazikod) && (
        <div className="mb-3 grid gap-3 sm:grid-cols-2">
          {opcije.map((o) => (
            <MarkaPolje key={o.naziv} oznaka={o.naziv} opcije={o.vrednosti} placeholder="Izaberite" klasa={polje} oznakaKlasa={oznaka} ikonaKlasa="text-sivi-2" onIzbor={(v) => setIzbor((x) => ({ ...x, [o.naziv]: v }))} />
          ))}
          {trazikod && (
            <div className="relative">
              <label htmlFor="kod-artikla" className={oznaka}>Kod boje</label>
              <input id="kod-artikla" value={kod} onChange={(e) => setKod(e.target.value)} autoComplete="off" placeholder="Sa nalepnice na autu" className={polje} />
            </div>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Kolicina velika vrednost={kolicina} promeni={setKolicina} naziv={stavka.naziv} />
        <SrceDugme
          stavka={{ id: stavka.id, naziv: stavka.naziv, cena: stavka.cena, slika: stavka.slika, puna: stavka.puna, brend, sifra, izbor: opcije.length > 0 || trazikod }}
          velicina="size-6"
          klasa="grid size-[60px] shrink-0 place-items-center rounded-full bg-[#f0f1f1] text-tinta transition-colors hover:text-narandza"
        />
        <button type="button" onClick={kupi} className="flex h-[60px] min-w-[220px] flex-1 items-center justify-center gap-2.5 rounded-full bg-narandza px-6 text-[16px] font-medium text-white uppercase transition-colors hover:bg-narandza-tamna">
          {dodato ? <Check aria-hidden className="size-5" strokeWidth={2.75} /> : <ShoppingBag aria-hidden className="size-5" strokeWidth={2} />}
          {dodato ? "Dodato" : "Dodaj u korpu"}
        </button>
      </div>
      {greska && <p role="alert" className="mt-2.5 text-[14px] text-crvena">{greska}</p>}
    </div>
  );
}
