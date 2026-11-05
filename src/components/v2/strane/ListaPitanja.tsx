"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export default function ListaPitanja({ pitanja }: { pitanja: { p: string; o: ReactNode }[] }) {
  const [otvoreno, setOtvoreno] = useState<number | null>(0);
  const id = useId();
  return (
    <ul className="divide-y divide-linija border-y border-linija">
      {pitanja.map((x, i) => {
        const on = otvoreno === i;
        return (
          <li key={x.p}>
            <h2>
              <button type="button" id={`${id}-p${i}`} aria-expanded={on} aria-controls={`${id}-o${i}`} onClick={() => setOtvoreno(on ? null : i)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-[clamp(1.0625rem,1.6vw,1.375rem)] leading-snug transition-colors hover:text-narandza">
                {x.p}
                <ChevronDown aria-hidden className={`size-5 shrink-0 transition-transform duration-300 ${on ? "rotate-180 text-narandza" : "text-sivi-2"}`} />
              </button>
            </h2>
            <div id={`${id}-o${i}`} role="region" aria-labelledby={`${id}-p${i}`} inert={!on} className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="min-h-0 overflow-hidden">
                <div className="max-w-[46em] pb-6 text-[17px] leading-relaxed font-light text-[#4d5361]">{x.o}</div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
