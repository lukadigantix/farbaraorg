"use client";

import { useState } from "react";
import Image from "next/image";
import { cena, putanjaGrupe, slajdovi, slikaArtikla } from "@/data/v2";
import Dugme from "./Dugme";

// Tekst i dugme stoje na istom mestu; elementi se pojavljuju jedan za drugim
const korak = (on: boolean, kasni: string) =>
  `transition-[opacity,translate,visibility] duration-500 ease-out motion-reduce:transition-none ${on ? `visible translate-y-0 opacity-100 ${kasni}` : "invisible translate-y-3 opacity-0"}`;

export default function HeroSlajder() {
  const [aktivan, setAktivan] = useState(0);
  const [pauza, setPauza] = useState(false);

  return (
    <div
      className="relative overflow-hidden transition-colors duration-700 lg:h-[603px]"
      style={{ backgroundColor: slajdovi[aktivan].boja }}
      onMouseEnter={() => setPauza(true)}
      onMouseLeave={() => setPauza(false)}
      onFocusCapture={() => setPauza(true)}
      onBlurCapture={() => setPauza(false)}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[2/1] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[68%]">
        <div className="absolute inset-0 overflow-hidden lg:[mask-image:linear-gradient(to_right,transparent_13%,black_34%)]">
          {slajdovi.map((s, i) => (
            <div
              key={s.slika}
              aria-hidden={i !== aktivan}
              className={`absolute inset-0 transition-[opacity,scale,visibility] duration-[1100ms] ease-out motion-reduce:transition-none ${i === aktivan ? "visible scale-100 opacity-100" : "invisible scale-[1.05] opacity-0"}`}
            >
              <Image
                src={s.slika}
                alt={i === aktivan ? s.alt : ""}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                sizes="(min-width: 1024px) 68vw, 100vw"
                className={`object-cover ${s.kadar}`}
              />
            </div>
          ))}
        </div>

        {slajdovi.map((s, i) => (
          <div
            key={s.proizvod}
            aria-hidden={i !== aktivan}
            className={`absolute right-4 bottom-4 z-10 flex items-center gap-3 rounded-2xl bg-white py-2 pr-5 pl-2 shadow-[0_18px_34px_-18px_rgba(35,40,50,.5)] sm:right-8 lg:top-10 lg:right-10 lg:bottom-auto min-[1320px]:right-[calc((100vw-1320px)/2+40px)] ${s.bezKarticeNaTelefonu ? "max-lg:hidden" : ""} ${korak(i === aktivan, "delay-[650ms]")}`}
          >
            <span className="relative block size-[58px] rounded-xl bg-sivka">
              <Image src={slikaArtikla(s.artikal)} alt="" fill loading="eager" sizes="58px" className="object-contain p-1.5" />
            </span>
            <span className="leading-tight">
              <span className="block text-[15px] whitespace-nowrap">{s.proizvod}</span>
              <span className="mt-1 block text-[17px] font-semibold text-narandza">{cena(s.cena)}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="v2-omot relative pt-7 pb-[84px] lg:h-full lg:py-0">
        <div className="relative z-10 grid lg:absolute lg:top-[110px] lg:left-[calc(40px+12px)] lg:max-w-[45%]">
          {slajdovi.map((s, i) => {
            const Naslov = i === 0 ? "h1" : "h2";
            const on = i === aktivan;
            return (
              <div key={s.proizvod} aria-hidden={!on} className={`[grid-area:1/1] ${on ? "" : "pointer-events-none"}`}>
                <p className={`v2-nad ${korak(on, "delay-100")}`}>{s.nad}</p>
                <Naslov className={`mt-3 text-[clamp(2.5rem,4.1vw,3.625rem)] leading-[1.1] font-[550] tracking-[-0.03em] text-tinta ${korak(on, "delay-200")}`}>
                  {s.naslov[0]}
                  <br />
                  {s.naslov[1]}
                </Naslov>
                <p className={`mt-6 text-[clamp(1.125rem,1.45vw,1.3125rem)] leading-[1.33] font-light text-tinta/75 ${korak(on, "delay-300")}`}>
                  {s.tekst[0]} <br className="hidden lg:block" />
                  {s.tekst[1]}
                </p>
                <div className={`mt-8 ${korak(on, "delay-[450ms]")}`}>
                  <Dugme tekst={s.dugme} href={putanjaGrupe(s.grupa)} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-4 top-2.5 z-20 flex gap-1.5 sm:inset-x-8 lg:inset-x-auto lg:top-[52%] lg:right-3 lg:h-[170px] lg:-translate-y-1/2 lg:flex-col" role="group" aria-label="Izbor ponude">
        {slajdovi.map((s, i) => (
          <button
            key={s.proizvod}
            type="button"
            aria-label={`Ponuda ${i + 1}: ${s.proizvod}`}
            aria-current={i === aktivan}
            onClick={() => setAktivan(i)}
            className="group flex h-5 flex-1 items-center lg:h-auto lg:w-5 lg:justify-center"
          >
            <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/70 shadow-sm transition-colors group-hover:bg-white lg:h-full lg:w-[3px]">
              {i === aktivan && (
                <span
                  className="v2-puni absolute inset-0 bg-narandza"
                  style={{ animationPlayState: pauza ? "paused" : "running" }}
                  onAnimationEnd={() => setAktivan((x) => (x + 1) % slajdovi.length)}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
