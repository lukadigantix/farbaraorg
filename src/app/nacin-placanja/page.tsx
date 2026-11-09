import type { Metadata } from "next";
import { PozivKartica, Putanja, VelikiNaslov } from "@/components/v2/strane/Delovi";

export const metadata: Metadata = { alternates: { canonical: "/nacin-placanja/" }, title: "Način plaćanja", description: "Načini plaćanja za porudžbine iz Farbare Lisa Comerc, XI krajiške divizije 62, Beograd." };

// Klijent još nije dao uslove; stari sajt ovu stranu ima praznu
export default function NacinPlacanja() {
  return (
    <section className="v2-omot pt-4 lg:pt-6">
      <Putanja naziv="Način plaćanja" />
      <div className="mt-6 mb-8 lg:mt-8 lg:mb-12"><VelikiNaslov>Način plaćanja</VelikiNaslov></div>
      <PozivKartica naslov="Za načine plaćanja pozovite nas." tekst="Rado ćemo vam sve objasniti." />
    </section>
  );
}
