import type { Metadata } from "next";
import { ArrowUpRight, MapPin, Phone, Smartphone } from "lucide-react";
import { PodaciFirme, Putanja, VelikiNaslov } from "@/components/v2/strane/Delovi";
import Mapa from "@/components/v2/strane/Mapa";
import { firma } from "@/data/sadrzaj";
import { tel } from "@/data/v2";

export const metadata: Metadata = { alternates: { canonical: "/kontakt/" },
  title: "Kontakt",
  description: `Lisa Comerc d.o.o., ${firma.adresa}. Telefon ${firma.fiksni}.`,
};

const NA_MAPI = "https://www.google.com/maps/search/?api=1&query=Farbara%20LISA%20COMERC%20d.o.o.%2C%2011.%20kraji%C5%A1ke%20divizije%2062%2C%20Beograd";

const krug = "grid size-12 shrink-0 place-items-center rounded-full bg-breskva text-narandza transition-colors group-hover:bg-narandza group-hover:text-white";

export default function Kontakt() {
  return (
    <>
      <section className="v2-omot pt-4 lg:pt-6">
        <Putanja naziv="Kontakt" />
        <div className="mt-6 lg:mt-8">
          <VelikiNaslov>Kontakt</VelikiNaslov>
          <p className="mt-4 text-[clamp(1.0625rem,1.45vw,1.25rem)] leading-[1.4] font-light text-[#4d5361]">Boje, lakovi, izolacije, alati, auto boje i program.</p>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3 lg:mt-10 lg:gap-4">
          <a href={tel(firma.fiksni)} className="group flex flex-col justify-center rounded-[24px] rounded-br-[48px] bg-ugalj p-6 text-white sm:p-7">
            <span className="flex items-center gap-2 text-[15px] font-light text-white/65">
              <Phone aria-hidden className="size-4" strokeWidth={1.75} />
              Prodavnica, telefon i faks
            </span>
            <span className="mt-2.5 block text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-[550] tracking-[-0.025em] whitespace-nowrap transition-colors group-hover:text-zlatna">{firma.fiksni}</span>
          </a>
          <a href={tel(firma.mobilni)} className="group flex items-center gap-4 rounded-[24px] bg-sivka p-5 transition-colors hover:bg-[#e7ebea] sm:p-6">
            <span className={krug}><Smartphone aria-hidden className="size-5" strokeWidth={1.75} /></span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[14px] font-light text-sivi-2">Mobilni</span>
              <span className="mt-1 block text-[19px] font-medium whitespace-nowrap">{firma.mobilni}</span>
            </span>
          </a>
          <a href={NA_MAPI} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-[24px] bg-sivka p-5 transition-colors hover:bg-[#e7ebea] sm:p-6">
            <span className={krug}><MapPin aria-hidden className="size-5" strokeWidth={1.75} /></span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-[14px] font-light text-sivi-2">Adresa</span>
              <span className="mt-1 block text-[19px] font-medium">{firma.adresa}</span>
            </span>
            <ArrowUpRight aria-hidden className="size-5 shrink-0 text-sivi-2 transition-colors group-hover:text-narandza" />
          </a>
        </div>
      </section>

      <Mapa />

      <section className="v2-omot grid gap-x-14 gap-y-3 pt-(--razmak) lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        <div>
          <h2 className="v2-h2">Podaci o firmi</h2>
        </div>
        <PodaciFirme />
      </section>
    </>
  );
}
