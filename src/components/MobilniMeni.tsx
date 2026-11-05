"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgePercent, ChevronDown, Menu, Phone, X } from "lucide-react";
import { firma, glavniMeni, sveKategorije } from "@/data/sadrzaj";

export default function MobilniMeni() {
  const [otvoreno, setOtvoreno] = useState(false);

  useEffect(() => {
    if (!otvoreno) return;
    const staro = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoreno(false);
    };
    document.addEventListener("keydown", taster);
    return () => {
      document.body.style.overflow = staro;
      document.removeEventListener("keydown", taster);
    };
  }, [otvoreno]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label="Otvori meni"
        aria-expanded={otvoreno}
        onClick={() => setOtvoreno(true)}
        className="-ml-1 grid size-11 place-items-center rounded-full text-plava hover:bg-maglica"
      >
        <Menu aria-hidden className="size-6" />
      </button>

      {otvoreno && (
        <div role="dialog" aria-modal="true" aria-label="Meni" className="fixed inset-0 z-50">
          <div aria-hidden onClick={() => setOtvoreno(false)} className="absolute inset-0 bg-[#0b1030]/50" />
          <div className="absolute inset-y-0 left-0 flex w-[88%] max-w-[380px] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-linija py-2 pr-2 pl-5">
              <span className="naslov text-xl">Meni</span>
              <button type="button" aria-label="Zatvori meni" onClick={() => setOtvoreno(false)} className="grid size-11 place-items-center rounded-full text-[#1a2340] hover:bg-maglica">
                <X aria-hidden className="size-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
              <Link href="#" className="flex h-11 items-center justify-center gap-2 rounded-full bg-crvena text-[15px] font-bold text-white">
                <BadgePercent aria-hidden className="size-5" />
                Akcije
              </Link>

              <ul className="mt-4">
                {glavniMeni.map((s) => (
                  <li key={s}><Link href="#" className="block py-2.5 text-base font-bold text-plava">{s}</Link></li>
                ))}
              </ul>

              <h2 className="mt-4 border-t border-linija pt-4 text-xs font-bold tracking-wider text-sivi uppercase">Sve kategorije</h2>
              <ul className="mt-1">
                {sveKategorije.map((k) => (
                  <li key={k.naziv}>
                    {k.pod.length > 0 ? (
                      <details className="group">
                        <summary className="flex cursor-pointer list-none items-center justify-between py-2.5 text-[15px] font-medium text-[#1a2340] [&::-webkit-details-marker]:hidden">
                          {k.naziv}
                          <ChevronDown aria-hidden className="size-4 opacity-60 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mb-2 border-l-2 border-linija pl-4">
                          {k.pod.map((p) => (
                            <li key={p}><Link href="#" className="block py-1.5 text-sm text-sivi">{p}</Link></li>
                          ))}
                        </ul>
                      </details>
                    ) : (
                      <Link href="#" className="block py-2.5 text-[15px] font-medium text-[#1a2340]">{k.naziv}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <a href={`tel:${firma.fiksni.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 border-t border-linija px-5 py-4 text-sm font-semibold text-plava">
              <Phone aria-hidden className="size-4" />
              {firma.fiksni}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
