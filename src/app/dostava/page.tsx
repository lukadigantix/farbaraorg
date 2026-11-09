import type { Metadata } from "next";
import { PozivKartica, Putanja, VelikiNaslov } from "@/components/v2/strane/Delovi";

export const metadata: Metadata = { alternates: { canonical: "/dostava/" }, title: "Dostava", description: "Uslovi dostave za porudžbine iz Farbare Lisa Comerc, XI krajiške divizije 62, Beograd." };

// Klijent još nije dao uslove; stari sajt ovu stranu ima praznu
export default function Dostava() {
  return (
    <section className="v2-omot pt-4 lg:pt-6">
      <Putanja naziv="Dostava" />
      <div className="mt-6 mb-8 lg:mt-8 lg:mb-12"><VelikiNaslov>Dostava</VelikiNaslov></div>
      <PozivKartica naslov="Za uslove dostave pozovite nas." tekst="Rado ćemo vam sve objasniti." />
    </section>
  );
}
