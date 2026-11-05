import type { CSSProperties } from "react";
import { Award, Headset, House, ShoppingCart } from "lucide-react";
import Otkrij from "./Otkrij";

const stavke = [
  { Ikona: ShoppingCart, boja: "bg-[#e6f8f0] text-[#14a06a]", naslov: "Širok izbor", tekst: "Sve za vaše projekte na jednom mestu." },
  { Ikona: Award, boja: "bg-[#eeeafd] text-plava", naslov: "Provereni brendovi", tekst: "Kvalitetni i pouzdani proizvodi." },
  { Ikona: Headset, boja: "bg-[#fde8f5] text-[#e0189a]", naslov: "Stručna podrška", tekst: "Savet i pomoć pri izboru." },
  { Ikona: House, boja: "bg-[#fff1e3] text-[#f07d12]", naslov: "Za majstore i vaš dom", tekst: "Rešenja za profesionalce i hobiste." },
];

export default function Prednosti() {
  return (
    <section className="relative z-10 -mt-8 lg:-mt-12">
      <Otkrij stavke className="omot">
        <ul className="grid grid-cols-1 gap-3 px-3 sm:grid-cols-2 lg:gap-4 lg:px-6 xl:grid-cols-4">
          {stavke.map(({ Ikona, boja, naslov, tekst }, i) => (
            <li key={naslov} style={{ "--i": i } as CSSProperties}>
              <div className="group flex h-full items-center gap-4 rounded-2xl bg-white p-4 shadow-[0_20px_50px_-28px_rgba(11,16,48,.45)] ring-1 ring-linija transition-transform duration-300 hover:-translate-y-1 xl:p-5">
                <span className={`grid size-13 shrink-0 place-items-center rounded-full ${boja}`}>
                  <Ikona aria-hidden className="size-6 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.9} />
                </span>
                <div>
                  <h2 className="text-[15px] leading-tight font-bold tracking-tight text-plava xl:text-base">{naslov}</h2>
                  <p className="mt-1 text-[13px] leading-snug text-sivi xl:text-sm">{tekst}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Otkrij>
    </section>
  );
}
