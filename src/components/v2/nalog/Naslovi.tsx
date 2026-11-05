"use client";

import { usePathname } from "next/navigation";

const TEKST = {
  prijava: ["Dobro došli nazad", "Prijavite se na svoj nalog u Farbari Lisa Comerc."],
  registracija: ["Napravite nalog", "Kupujte u Farbari Lisa Comerc kao fizičko lice ili firma."],
  lozinka: ["Nova lozinka", "Upišite e-mail i poslaćemo vam link za novu lozinku."],
};

export default function Naslovi() {
  const putanja = usePathname();
  const [naslov, podnaslov] = putanja.endsWith("/zaboravljena-lozinka") ? TEKST.lozinka : putanja.endsWith("/registracija") ? TEKST.registracija : TEKST.prijava;
  return (
    <div className="text-center">
      <h1 className="text-[clamp(2rem,3.2vw,2.625rem)] leading-[1.1] font-[550] tracking-[-0.03em]">{naslov}</h1>
      <p className="mx-auto mt-3 max-w-[380px] text-[17px] leading-snug font-light text-[#4d5361]">{podnaslov}</p>
    </div>
  );
}
