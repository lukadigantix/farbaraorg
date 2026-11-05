import Image from "next/image";
import Link from "next/link";
import { firma } from "@/data/sadrzaj";

const kolone = [
  { naslov: "Kupovina", stavke: ["Sve kategorije", "Akcije", "Brendovi"] },
  { naslov: "Pomoć", stavke: ["Česta pitanja", "O nama", "Kontakt"] },
];

const tel = (broj: string) => `tel:${broj.replace(/[^+\d]/g, "")}`;

export default function Podnozje() {
  return (
    <footer className="mt-(--razmak) border-t border-linija">
      <div className="omot grid gap-12 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <Link href="/" aria-label="Farbara Lisa Comerc, početna" className="inline-block">
            <Image src="/img/logo.svg" alt="Farbara Lisa Comerc" unoptimized width={1032} height={304} className="h-14 w-auto lg:h-16" />
          </Link>
          <p className="nadnaslov mt-10 flex">Imate pitanje?</p>
          <a href={tel(firma.fiksni)} className="naslov mt-3 block text-[clamp(1.75rem,3.6vw,2.75rem)] transition-colors hover:text-crvena">
            {firma.fiksni}
          </a>
          <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-sivi">
            Promet boja i lakova na veliko i malo. {firma.adresa}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {kolone.map((k) => (
            <div key={k.naslov}>
              <h2 className="text-sm font-bold text-plava">{k.naslov}</h2>
              <ul className="mt-4 space-y-2.5 text-[15px] text-sivi">
                {k.stavke.map((s) => (
                  <li key={s}><Link href="#" className="transition-colors hover:text-plava">{s}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-2 sm:col-span-1">
            <h2 className="text-sm font-bold text-plava">Kontakt</h2>
            <ul className="mt-4 space-y-2.5 text-[15px] text-sivi">
              <li>{firma.adresa}</li>
              <li><a href={tel(firma.fiksni)} className="transition-colors hover:text-plava">{firma.fiksni}</a></li>
              <li><a href={tel(firma.mobilni)} className="transition-colors hover:text-plava">{firma.mobilni}</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-linija">
        <div className="omot flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-5 text-[13px] text-sivi">
          <p>{firma.naziv}, PIB {firma.pib}</p>
          <a href="https://zeroblynk.com" target="_blank" rel="noopener" aria-label="Design & Developed by Zeroblynk" className="group flex items-center gap-2 whitespace-nowrap">
            Design & Developed by
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/zeroblynk.svg" alt="" className="h-[22px] w-auto transition-opacity group-hover:opacity-80" />
          </a>
        </div>
      </div>
    </footer>
  );
}
