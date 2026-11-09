import type { Metadata } from "next";
import Hero from "@/components/v2/Hero";
import Kategorije from "@/components/v2/Kategorije";
import Proizvodi from "@/components/v2/Proizvodi";
import Promo from "@/components/v2/Promo";
import Mesanje from "@/components/v2/Mesanje";
import OFirmi from "@/components/v2/OFirmi";
import Brendovi from "@/components/Brendovi";
import { alati, boje, putanjaGrupe } from "@/data/v2";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Pocetna() {
  return (
    <>
      <Hero />
      <Kategorije />
      <Proizvodi naslov="Boje i lakovi" artikli={boje} link={putanjaGrupe("Molerski materijal")} />
      <Promo />
      <Mesanje />
      <Proizvodi naslov="Alati i oprema" artikli={alati} link={putanjaGrupe("Alati")} />
      <OFirmi />
      <Brendovi />
    </>
  );
}
