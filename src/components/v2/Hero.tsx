import { Award, BadgeCheck, Headset, House } from "lucide-react";
import HeroSlajder from "./HeroSlajder";

const prednosti = [
  { Ikona: Award, naslov: "Širok izbor", tekst: "Sve na jednom mestu" },
  { Ikona: BadgeCheck, naslov: "Provereni brendovi", tekst: "Kvalitetni i pouzdani proizvodi" },
  { Ikona: Headset, naslov: "Stručna podrška", tekst: "Savet i pomoć pri izboru" },
  { Ikona: House, naslov: "Za majstore i vaš dom", tekst: "Za profesionalce i hobiste" },
];

export default function Hero() {
  return (
    <section>
      <HeroSlajder />

      <div className="v2-omot relative z-10 -mt-[60px]">
        <ul className="grid grid-cols-1 rounded-2xl bg-white shadow-[0_24px_50px_-24px_rgba(35,40,50,.28)] sm:grid-cols-2 xl:grid-cols-4">
          {prednosti.map(({ Ikona, naslov, tekst }, i) => (
            <li
              key={naslov}
              className={`flex items-center gap-3.5 border-sivka px-6 py-6 xl:h-[132px] xl:py-0 ${i > 0 ? "border-t sm:border-t-0" : ""} ${i > 1 ? "sm:border-t xl:border-t-0" : ""} ${i % 2 === 1 ? "sm:border-l" : ""} ${i > 0 ? "xl:border-l" : ""}`}
            >
              <Ikona aria-hidden className="size-10 shrink-0" strokeWidth={1.25} />
              <div>
                <h2 className="text-[18px] leading-tight">{naslov}</h2>
                <p className="mt-1.5 text-[14px] leading-tight font-light text-sivi-2">{tekst}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
