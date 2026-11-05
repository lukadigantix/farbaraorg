"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronRight, LayoutGrid, X } from "lucide-react";
import { sveKategorije } from "@/data/sadrzaj";

export default function MegaMeni() {
  const [otvoreno, setOtvoreno] = useState(false);
  const [aktivna, setAktivna] = useState(0);
  const koren = useRef<HTMLDivElement>(null);
  const kategorija = sveKategorije[aktivna];

  useEffect(() => {
    if (!otvoreno) return;
    const klik = (e: MouseEvent) => {
      if (!koren.current?.contains(e.target as Node)) setOtvoreno(false);
    };
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoreno(false);
    };
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", taster);
    return () => {
      document.removeEventListener("mousedown", klik);
      document.removeEventListener("keydown", taster);
    };
  }, [otvoreno]);

  const Ikona = otvoreno ? X : LayoutGrid;

  return (
    <div ref={koren} className="hidden shrink-0 lg:block">
      <button
        type="button"
        aria-expanded={otvoreno}
        onClick={() => setOtvoreno((o) => !o)}
        className="flex h-12 items-center gap-2 rounded-full bg-plava px-5 text-sm font-bold whitespace-nowrap text-white transition-colors hover:bg-plava-tamna"
      >
        <Ikona aria-hidden className="size-[18px]" />
        Sve kategorije
      </button>

      {otvoreno && (
        <>
          <div aria-hidden onClick={() => setOtvoreno(false)} className="absolute inset-x-0 top-full h-dvh bg-[#0b1030]/40" />
          <div className="omot absolute inset-x-0 top-full pt-2">
            <div className="grid max-h-[calc(100dvh-110px)] grid-cols-[300px_1fr] overflow-hidden rounded-2xl bg-white shadow-2xl">
              <ul className="overflow-y-auto border-r border-linija bg-maglica/60 p-3">
                {sveKategorije.map((k, i) => (
                  <li key={k.naziv}>
                    <Link
                      href="#"
                      onMouseEnter={() => setAktivna(i)}
                      onFocus={() => setAktivna(i)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold ${i === aktivna ? "bg-white text-plava shadow-sm" : "text-[#1a2340]"}`}
                    >
                      {k.naziv}
                      {k.pod.length > 0 && <ChevronRight aria-hidden className="size-4 opacity-50" />}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="overflow-y-auto p-8">
                <Link href="#" className="naslov text-3xl hover:underline">{kategorija.naziv}</Link>
                {kategorija.pod.length > 0 && (
                  <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-1 xl:grid-cols-3">
                    {kategorija.pod.map((p) => (
                      <li key={p}>
                        <Link href="#" className="block rounded-lg px-3 py-2 -ml-3 text-[15px] font-medium text-[#1a2340] transition-colors hover:bg-maglica hover:text-plava">{p}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
