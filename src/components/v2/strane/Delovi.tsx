import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { tel } from "@/data/v2";

export function Putanja({ naziv }: { naziv: string }) {
  return (
    <nav aria-label="Putanja" className="flex items-center gap-1.5 text-[14px] text-sivi-2">
      <Link href="/" className="transition-colors hover:text-tinta">Početna</Link>
      <ChevronRight aria-hidden className="size-3.5" />
      <span className="text-tinta">{naziv}</span>
    </nav>
  );
}

export function VelikiNaslov({ children }: { children: ReactNode }) {
  return <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.03] font-[550] tracking-[-0.035em]">{children}</h1>;
}

export function PodaciFirme() {
  const redovi = [
    ["Puno poslovno ime", firma.naziv],
    ["Matični broj", firma.maticni],
    ["PIB", firma.pib],
    ["Broj registracije", firma.registracija],
    ["Šifra delatnosti", firma.delatnost],
    ["Broj računa", firma.racun],
  ];
  return (
    <dl className="divide-y divide-linija text-[16px]">
      {redovi.map(([n, v]) => (
        <div key={n} className="flex flex-wrap justify-between gap-x-6 gap-y-0.5 py-3">
          <dt className="font-light text-sivi-2">{n}</dt>
          <dd className="tabular-nums">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PozivKartica({ naslov, tekst }: { naslov: string; tekst: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-6 rounded-[28px] rounded-br-[64px] bg-ugalj p-7 text-white sm:p-10 lg:p-14">
      <div className="max-w-[34em]">
        <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] font-[550] tracking-[-0.03em]">{naslov}</h2>
        <p className="mt-3 text-[17px] leading-snug font-light text-white/65">{tekst}</p>
      </div>
      <a href={tel(firma.fiksni)} className="v2-dugme w-full justify-center sm:w-auto">
        <Phone aria-hidden className="size-5" strokeWidth={1.75} />
        <span className="normal-case">{firma.fiksni}</span>
      </a>
    </div>
  );
}
