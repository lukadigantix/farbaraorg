import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { izdvojeno } from "@/data/sadrzaj";
import NaslovSekcije from "./NaslovSekcije";
import Otkrij from "./Otkrij";

export default function Izdvojeno() {
  return (
    <section className="omot pt-(--razmak)">
      <NaslovSekcije nadnaslov="Izdvojeno" naslov="Izdvajamo iz ponude" link="Pogledajte sve proizvode" />
      <Otkrij stavke className="mt-8 lg:mt-10">
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 sm:pb-0 lg:grid-cols-4 lg:gap-4 [&::-webkit-scrollbar]:hidden">
          {izdvojeno.map((p, i) => (
            <li key={p.naziv} className="w-[72%] shrink-0 snap-start sm:w-auto" style={{ "--i": i } as CSSProperties}>
              <article className="kartica group flex h-full flex-col rounded-[24px] bg-maglica p-2.5 transition-transform duration-300 hover:-translate-y-1">
                <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white">
                  <Link href="#" aria-label={p.naziv} className="absolute inset-0">
                    <Image
                      src={p.slika}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 72vw"
                      className="object-contain p-7 transition-transform duration-700 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.06]"
                    />
                  </Link>
                  <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-maglica px-2.5 py-1 text-[11px] font-extrabold tracking-wider text-plava uppercase">
                    {p.brend}
                  </span>
                  <button
                    type="button"
                    aria-label="Dodaj u listu želja"
                    className="absolute top-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-maglica text-[#1a2340] transition-colors hover:bg-crvena hover:text-white"
                  >
                    <Heart aria-hidden className="size-4" strokeWidth={2.25} />
                  </button>
                </div>
                <h3 className="mt-4 line-clamp-2 min-h-[2.6em] px-2 text-[15px] leading-snug font-semibold text-[#1a2340]">
                  <Link href="#">{p.naziv}</Link>
                </h3>
                <div className="mt-2 flex items-center justify-between gap-3 px-2 pb-1.5">
                  <p className="kartica-kat truncate text-xs font-semibold text-sivi transition-opacity duration-300">{p.kategorija}</p>
                  <Link href="#" className="kupi" aria-label={`Pogledajte proizvod ${p.naziv}`}>
                    <span className="kupi-tekst">Pogledajte proizvod</span>
                    <span className="kupi-krug" aria-hidden><ArrowRight className="size-[18px]" strokeWidth={2.5} /></span>
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Otkrij>
    </section>
  );
}
