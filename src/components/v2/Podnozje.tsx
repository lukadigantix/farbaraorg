import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Smartphone } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { grupe, putanjaGrupe, tel } from "@/data/v2";

const informacije = [
  ["O nama", "/o-nama"],
  ["Dostava", "/dostava"],
  ["Način plaćanja", "/nacin-placanja"],
  ["Pitanja i odgovori", "/pitanja-i-odgovori"],
  ["Kontakt", "/kontakt"],
  ["Uslovi korišćenja", "/uslovi-koriscenja"],
  ["Politika privatnosti", "/politika-privatnosti"],
];
const nalog = [
  ["Prijava / Registracija", "/prijava"],
  ["Moj nalog", "/moj-nalog"],
  ["Sačuvani proizvodi", "/sacuvani-proizvodi"],
  ["Korpa", "/korpa"],
];

const naslovKolone = "text-[15px] font-medium text-tinta";
const lista = "mt-4 space-y-2.5 text-[15px] font-light text-sivi-2";
const link = "transition-colors hover:text-narandza";

// Boje slova F-A-R-B-A-R-A iz logoa, istim redom
const FARBARA = ["#e82337", "#1a0f9e", "#27c77a", "#6a4fd0", "#f58ab5", "#f08a3c", "#110f12"];

export default function Podnozje() {
  return (
    <footer className="mt-(--razmak)">
      <div aria-hidden className="flex h-1">
        {FARBARA.map((boja, i) => (
          <span key={i} className="flex-1" style={{ backgroundColor: boja }} />
        ))}
      </div>
      <div className="v2-omot grid gap-x-12 gap-y-12 py-14 lg:grid-cols-[300px_1fr] lg:py-20 xl:gap-x-20">
        <div>
          <Link href="/" aria-label="Farbara Lisa Comerc, početna" className="inline-block">
            <Image src="/img/logo.svg" alt="Farbara Lisa Comerc" width={2037} height={616} unoptimized className="h-14 w-auto lg:h-16" />
          </Link>
          <p className="mt-6 text-[15px] leading-relaxed font-light text-sivi-2">
            Porodična firma od 1991. Promet boja i lakova na veliko i malo. Zastupamo domaće i strane proizvođače.
          </p>
          <ul className="mt-6 space-y-3 text-[15px] font-light">
            <li className="flex items-start gap-3 text-sivi-2">
              <MapPin aria-hidden className="mt-0.5 size-[18px] shrink-0 text-narandza" strokeWidth={1.75} />
              {firma.adresa}
            </li>
            <li>
              <a href={tel(firma.fiksni)} className="flex items-center gap-3 font-normal text-tinta transition-colors hover:text-narandza">
                <Phone aria-hidden className="size-[18px] shrink-0 text-narandza" strokeWidth={1.75} />
                {firma.fiksni}
              </a>
            </li>
            <li>
              <a href={tel(firma.mobilni)} className="flex items-center gap-3 font-normal text-tinta transition-colors hover:text-narandza">
                <Smartphone aria-hidden className="size-[18px] shrink-0 text-narandza" strokeWidth={1.75} />
                {firma.mobilni}
              </a>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[1.3fr_1fr_1fr] xl:gap-x-12">
          <div className="col-span-2 sm:col-span-1">
            <h2 className={naslovKolone}>Proizvodi</h2>
            <ul className={lista}>
              {grupe.map((g) => (
                <li key={g.naziv}><Link href={putanjaGrupe(g.naziv)} className={link}>{g.naziv}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={naslovKolone}>Informacije</h2>
            <ul className={lista}>
              {informacije.map(([s, href]) => (
                <li key={s}><Link href={href} className={link}>{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className={naslovKolone}>Vaš nalog</h2>
            <ul className={lista}>
              {nalog.map(([s, href]) => (
                <li key={s}><Link href={href} className={link}>{s}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-linija">
        <div className="v2-omot flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-5 text-[13px] font-light text-sivi-2 max-sm:pb-20 sm:pr-[130px]">
          <p>© 2026 {firma.naziv} | PIB {firma.pib} | MB 07562594</p>
          <a href="https://zeroblynk.com" target="_blank" rel="noopener" aria-label="Design & Developed by Zeroblynk" className="group flex items-center gap-2 whitespace-nowrap">
            Design & Developed by
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/zeroblynk.svg" alt="" className="h-[17px] w-auto transition-opacity group-hover:opacity-80" />
          </a>
        </div>
      </div>
    </footer>
  );
}
