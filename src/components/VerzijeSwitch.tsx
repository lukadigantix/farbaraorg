"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check } from "lucide-react";

// Novu verziju početne dodaješ ovde
const verzije = [
  { href: "/v1", oznaka: "V1", naziv: "Prva verzija" },
  { href: "/v2", oznaka: "V2", naziv: "Druga verzija" },
];

export default function VerzijeSwitch() {
  const putanja = usePathname();
  const [otvoreno, setOtvoreno] = useState(false);
  const koren = useRef<HTMLDivElement>(null);
  const trenutna = verzije.find((v) => putanja.startsWith(v.href));

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

  return (
    <div ref={koren} className="fixed bottom-4 left-4 z-[70] font-sans">
      {otvoreno && (
        <div className="absolute bottom-full left-0 mb-2 w-52 rounded-2xl bg-[#111] p-1.5 text-white shadow-2xl ring-1 ring-white/15">
          <p className="px-2.5 pt-1.5 pb-1 text-[11px] text-white/50">Verzija početne</p>
          {verzije.map((v) => (
            <Link
              key={v.href}
              href={v.href}
              onClick={() => setOtvoreno(false)}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] hover:bg-white/10"
            >
              <span className="w-5 font-semibold">{v.oznaka}</span>
              <span className="flex-1 text-white/70">{v.naziv}</span>
              {v === trenutna && <Check aria-hidden className="size-4" />}
            </Link>
          ))}
        </div>
      )}
      <button
        type="button"
        aria-expanded={otvoreno}
        aria-label={`Promeni verziju početne, sada ${trenutna?.naziv ?? ""}`}
        onClick={() => setOtvoreno((o) => !o)}
        className="grid size-10 place-items-center rounded-full bg-[#111] text-[13px] font-semibold text-white shadow-lg ring-1 ring-white/25 transition-colors hover:bg-[#2a2a2a]"
      >
        {trenutna?.oznaka ?? "V"}
      </button>
    </div>
  );
}
