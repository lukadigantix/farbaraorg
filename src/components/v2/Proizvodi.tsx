import { slikaArtikla, type Artikal } from "@/data/v2";
import Karusel from "./Karusel";
import LinkStrelica from "./LinkStrelica";
import NaslovV2 from "./NaslovV2";
import ProizvodKartica from "./ProizvodKartica";

export default function Proizvodi({ naslov, artikli, link }: { naslov: string; artikli: Artikal[]; link: string }) {
  return (
    <section className="v2-omot pt-[72px]">
      <NaslovV2 nad="Lisa Comerc prodavnica" naslov={naslov} />
      <div className="mt-7">
        <Karusel strelice listaKlasa="-mx-4 px-4 pt-2 pb-6 sm:-mx-3 sm:-mb-4 sm:px-3">
          {artikli.map((p) => (
            <li key={p.id} className="w-[66%] shrink-0 snap-start scroll-ml-4 sm:w-[calc((100%-40px)/3)] sm:scroll-ml-3 lg:w-[calc((100%-60px)/4)] xl:w-[calc((100%-80px)/5)]">
              <ProizvodKartica id={Number(p.id)} naziv={p.naziv} brend={p.brend} cena={p.cena} slika={slikaArtikla(p.id)} sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 640px) 26vw, 50vw" />
            </li>
          ))}
        </Karusel>
      </div>
      <div className="mt-7 flex justify-center">
        <LinkStrelica tekst="Pogledaj proizvode" href={link} className="gap-7" />
      </div>
    </section>
  );
}
