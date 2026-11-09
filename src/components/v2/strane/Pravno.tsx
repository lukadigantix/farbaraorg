import type { ReactNode } from "react";
import { Putanja, VelikiNaslov } from "./Delovi";

export type Odeljak = { id: string; naslov: string; sadrzaj: ReactNode };

// Zajednički raspored za Uslove korišćenja i Politiku privatnosti: sadržaj levo, spisak odeljaka desno
export default function PravnaStrana({ naziv, uvod, odeljci }: { naziv: string; uvod: ReactNode; odeljci: Odeljak[] }) {
  return (
    <section className="v2-omot pt-4 lg:pt-6">
      <Putanja naziv={naziv} />
      <div className="mt-6 mb-8 lg:mt-8 lg:mb-12">
        <VelikiNaslov>{naziv}</VelikiNaslov>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div className="max-w-[760px] lg:order-first">
          <div className="text-[18px] leading-[1.6] font-light text-ugalj">{uvod}</div>
          {odeljci.map((o, i) => (
            <section key={o.id} id={o.id} className="scroll-mt-[130px] border-t border-linija pt-8 mt-10 lg:scroll-mt-[96px]">
              <h2 className="flex gap-3 text-[clamp(1.375rem,2vw,1.75rem)] leading-tight font-[550] tracking-[-0.02em]">
                <span className="text-narandza tabular-nums">{i + 1}.</span>
                {o.naslov}
              </h2>
              <div className="pravno mt-4 space-y-4 text-[16px] leading-[1.65] text-ugalj">{o.sadrzaj}</div>
            </section>
          ))}
        </div>
        <nav aria-label="Sadržaj strane" className="order-first lg:order-none">
          <div className="rounded-[24px] bg-sivka p-5 lg:sticky lg:top-[96px]">
            <p className="text-[13px] font-medium tracking-wide text-sivi-2 uppercase">Sadržaj</p>
            <ol className="mt-3 space-y-1">
              {odeljci.map((o, i) => (
                <li key={o.id}>
                  <a href={`#${o.id}`} className="flex gap-2 rounded-lg py-1.5 text-[15px] leading-snug transition-colors hover:text-narandza">
                    <span className="w-5 shrink-0 text-sivi-2 tabular-nums">{i + 1}.</span>
                    {o.naslov}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>
    </section>
  );
}
