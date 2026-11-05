import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { Store } from "lucide-react";
import Dugme from "./Dugme";
import Potez from "./Potez";

const nijanse = ["#1103a3", "#ec5fb4", "#14a06a", "#f5c518"];

function Rec({ i, children }: { i: number; children: ReactNode }) {
  return (
    <span className="rec">
      <span style={{ "--i": i } as CSSProperties}>{children}</span>
    </span>
  );
}

function Cip({ kasni, className = "", children }: { kasni: string; className?: string; children: ReactNode }) {
  return (
    <div className={`lebdi ${className}`} style={{ "--k": kasni } as CSSProperties}>
      <div
        className="pojavi flex items-center gap-3 rounded-2xl bg-white/90 py-2.5 pr-4 pl-2.5 shadow-[0_18px_40px_-20px_rgba(11,16,48,.4)] ring-1 ring-white backdrop-blur"
        style={{ "--k": kasni } as CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

function CipArtikli() {
  return (
    <>
      <span className="flex -space-x-2 pl-1">
        {nijanse.map((c) => (
          <span key={c} className="size-6 rounded-full ring-2 ring-white" style={{ background: c }} />
        ))}
      </span>
      <span className="text-sm font-bold text-plava">Preko 2.500 artikala</span>
    </>
  );
}

function CipFirma() {
  return (
    <>
      <span className="grid size-8 place-items-center rounded-xl bg-crvena text-white">
        <Store aria-hidden className="size-4" strokeWidth={2.25} />
      </span>
      <span className="text-sm font-bold text-plava">Porodična firma od 1991.</span>
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] lg:h-[clamp(400px,34vw,660px)]">
      <div className="omot relative z-10 lg:flex lg:h-full lg:items-center">
        <div className="pt-10 pb-8 lg:max-w-[42%] lg:py-0 lg:pb-12">
          <h1 className="naslov text-[clamp(2.5rem,4.4vw,4.5rem)]">
            <Rec i={0}>Dajte</Rec> <Rec i={1}>svom</Rec> <Rec i={2}>prostoru</Rec>{" "}
            <span className="relative whitespace-nowrap">
              <Rec i={3}>novu</Rec> <Rec i={4}>boju.</Rec>
              <Potez className="potez-crtaj -bottom-[0.1em] left-[40%] h-[0.2em] w-[66%]" />
            </span>
          </h1>
          <p
            className="pojavi mt-5 text-lg leading-snug text-sivi lg:mt-7 lg:text-[clamp(1.125rem,1.6vw,1.5rem)]"
            style={{ "--k": "450ms" } as CSSProperties}
          >
            Boje, alati i materijali za male <br className="hidden lg:block" />
            popravke i velike promene.
          </p>
          <div className="pojavi mt-7 lg:mt-9" style={{ "--k": "600ms" } as CSSProperties}>
            <Dugme href="#" velika>Istražite ponudu</Dugme>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 lg:hidden">
            <Cip kasni="800ms"><CipArtikli /></Cip>
            <Cip kasni="950ms"><CipFirma /></Cip>
          </div>
        </div>
      </div>

      <div className="relative aspect-[736/335] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[70%] lg:[mask-image:linear-gradient(to_right,transparent,black_12%)]">
        <Image
          src="/img/hero-ai.webp"
          alt="Valjak sa plavom bojom, kante boje i lepeza nijansi na stolu"
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="object-cover object-right"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
        <Cip kasni="900ms" className="absolute top-10 right-[6%]"><CipArtikli /></Cip>
        <Cip kasni="1100ms" className="absolute top-10 right-[26%]"><CipFirma /></Cip>
      </div>
    </section>
  );
}
