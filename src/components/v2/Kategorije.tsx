import Image from "next/image";
import { kategorijeV2, putanjaGrupe, slikaArtikla } from "@/data/v2";
import Karusel from "./Karusel";
import LinkStrelica from "./LinkStrelica";
import NaslovV2 from "./NaslovV2";

export default function Kategorije() {
  return (
    <section className="v2-omot pt-10">
      <NaslovV2 nad="Lisa Comerc prodavnica" naslov="Izaberite kategoriju" />
      <div className="mt-7">
        <Karusel strelice listaKlasa="-mx-4 px-4 sm:mx-0 sm:px-0">
          {kategorijeV2.map((k) => (
            <li key={k.naziv} className="w-[78%] shrink-0 snap-start scroll-ml-4 sm:w-[calc((100%-20px)/2)] sm:scroll-ml-0 lg:w-[calc((100%-40px)/3)] xl:w-[calc((100%-60px)/4)]">
              <article className="v2-ugao flex h-full flex-col bg-sivka px-6 pt-10 pb-8">
                <div className="relative mx-auto h-[180px] w-[78%]">
                  <Image src={slikaArtikla(k.id)} alt="" fill sizes="(min-width: 1280px) 22vw, (min-width: 640px) 30vw, 70vw" className="object-contain drop-shadow-[0_14px_14px_rgba(35,40,50,.18)]" />
                </div>
                <h3 className="mt-10 flex min-h-[2.5em] items-end text-[22px] leading-tight">{k.naziv}</h3>
                <p className="mt-3 min-h-[3em] flex-1 text-[16px] leading-normal font-light text-sivi-2">{k.opis}</p>
                <div className="mt-6 border-t border-[#d8dbdb] pt-5">
                  <LinkStrelica tekst="Pogledaj proizvode" href={putanjaGrupe(k.naziv)} />
                </div>
              </article>
            </li>
          ))}
        </Karusel>
      </div>
    </section>
  );
}
