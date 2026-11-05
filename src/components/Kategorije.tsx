import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { kategorije } from "@/data/sadrzaj";
import NaslovSekcije from "./NaslovSekcije";
import Otkrij from "./Otkrij";

export default function Kategorije() {
  return (
    <section className="omot pt-(--razmak)">
      <NaslovSekcije nadnaslov="Kategorije" naslov="Šta je vaš sledeći projekat?" link="Pogledajte sve kategorije" />
      <Otkrij stavke className="mt-8 lg:mt-10">
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 sm:pb-0 lg:gap-4 xl:grid-cols-6 [&::-webkit-scrollbar]:hidden">
          {kategorije.map((k, i) => (
            <li key={k.naziv} className="w-[58%] shrink-0 snap-start sm:w-auto" style={{ "--i": i } as CSSProperties}>
              <Link href="#" className="group relative block aspect-[4/5] overflow-hidden rounded-[24px] bg-maglica">
                <Image
                  src={k.slika}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 16vw, (min-width: 640px) 33vw, 58vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0b1030]/85 via-[#0b1030]/30 to-transparent" />
                <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-plava backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <span className="text-[17px] leading-tight font-bold tracking-tight text-white">{k.naziv}</span>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-plava transition-colors duration-300 group-hover:bg-crvena group-hover:text-white">
                    <ArrowUpRight aria-hidden className="size-4" strokeWidth={2.5} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Otkrij>
    </section>
  );
}
