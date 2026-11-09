import Image from "next/image";
import Link from "next/link";
import { PhoneCall } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { tel } from "@/data/v2";
import { KorpaDugme } from "./korpa/Korpa";
import { MobilniMeniV2, ProdavnicaDugme } from "./Meni";
import Pretraga from "./Pretraga";
import { SacuvanoIkonica } from "./sacuvano/Sacuvano";

export default function Zaglavlje() {
  return (
    <>
      <div className="bg-zlatna text-[14px] text-white">
        <div className="v2-omot flex h-12 items-center justify-between gap-6">
          <p className="hidden truncate md:block xl:w-1/3">Promet boja i lakova na veliko i malo</p>
          <p className="hidden truncate min-[900px]:block xl:w-1/3 xl:text-center">Porodična firma od 1991.</p>
          <nav className="ml-auto flex shrink-0 items-center justify-end gap-6 whitespace-nowrap md:ml-0 xl:w-1/3">
            <Link href="/pitanja-i-odgovori" className="hidden hover:opacity-80 sm:inline">Pitanja i odgovori</Link>
            <Link href="/kontakt" className="hover:opacity-80">Kontakt</Link>
            <span aria-hidden className="hidden h-4 w-px bg-white/40 sm:block" />
            <Link href="/prijava" className="hidden hover:opacity-80 sm:inline">Prijava / Registracija</Link>
          </nav>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_var(--color-linija)]">
        <div className="v2-omot flex flex-wrap items-center gap-x-3 gap-y-2 py-2 lg:h-[72px] lg:flex-nowrap lg:gap-x-5 lg:py-0 xl:gap-x-7">
          <Link href="/" aria-label="Farbara Lisa Comerc, početna" className="flex h-11 shrink-0 items-center">
            <Image src="/img/logo.svg" alt="Farbara Lisa Comerc" width={2037} height={616} unoptimized priority className="h-11 w-auto max-[360px]:h-9 xl:h-[52px]" />
          </Link>

          <ProdavnicaDugme />

          <nav className="hidden items-center gap-5 text-[15px] font-medium text-[#55586f] uppercase xl:flex">
            <Link href="/" className="whitespace-nowrap hover:text-narandza">Početna</Link>
            <Link href="/o-nama" className="whitespace-nowrap hover:text-narandza">O nama</Link>
          </nav>

          <Pretraga />

          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3 lg:ml-0 xl:gap-5">
            <SacuvanoIkonica />
            <KorpaDugme />
            <a href={tel(firma.fiksni)} className="hidden items-center gap-2.5 hover:text-narandza min-[1180px]:flex">
              <span className="grid size-10 place-items-center rounded-full bg-narandza text-white">
                <PhoneCall aria-hidden className="size-[18px]" strokeWidth={2} />
              </span>
              <span className="text-[15px] whitespace-nowrap">{firma.fiksni}</span>
            </a>
            <MobilniMeniV2 />
          </div>
        </div>
      </header>
    </>
  );
}
