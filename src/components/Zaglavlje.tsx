import Image from "next/image";
import Link from "next/link";
import { BadgePercent, Search, ShoppingCart, UserRound } from "lucide-react";
import { glavniMeni } from "@/data/sadrzaj";
import MegaMeni from "./MegaMeni";
import MobilniMeni from "./MobilniMeni";

export default function Zaglavlje() {
  return (
    <>
      <div className="bg-maglica text-[13px] font-medium text-[#1a2340]">
        <div className="omot flex h-8 items-center justify-end gap-4 min-[440px]:justify-between">
          <p className="hidden truncate min-[440px]:block">Boje, alati i sve za vaš sledeći projekat</p>
          <nav className="flex shrink-0 items-center gap-3">
            <Link href="#" className="hover:text-plava">O nama</Link>
            <span aria-hidden className="size-1 rounded-full bg-[#1a2340]" />
            <Link href="#" className="hover:text-plava">Kontakt</Link>
          </nav>
        </div>
      </div>

      <header className="zaglavlje sticky top-0 z-40 border-b border-linija bg-white">
        <div className="omot flex flex-wrap items-center gap-x-2 gap-y-3 py-3 lg:flex-nowrap lg:gap-x-4 xl:gap-x-6">
          <MobilniMeni />

          <Link href="/" aria-label="Farbara Lisa Comerc, početna" className="shrink-0 lg:mr-2">
            <Image
              src="/img/logo.svg"
              alt="Farbara Lisa Comerc"
              unoptimized width={1032}
              height={304}
              priority
              className="h-11 w-auto sm:h-12 xl:h-14"
            />
          </Link>

          <MegaMeni />

          <form role="search" className="order-last w-full lg:order-none lg:w-auto lg:min-w-0 lg:flex-1">
            <label className="flex h-12 items-center gap-2 rounded-full bg-maglica pr-1.5 pl-5 transition focus-within:bg-white focus-within:ring-2 focus-within:ring-plava">
              <input
                type="search"
                placeholder="Pretražite proizvode, brendove i šifre artikala"
                aria-label="Pretraga"
                className="w-full min-w-0 truncate bg-transparent text-base text-[#1a2340] outline-none placeholder:text-[13px] placeholder:text-sivi min-[440px]:placeholder:text-sm lg:text-sm"
              />
              <button type="submit" aria-label="Pretraži" className="grid size-9 shrink-0 place-items-center rounded-full bg-plava text-white transition-colors hover:bg-plava-tamna">
                <Search aria-hidden className="size-[18px]" strokeWidth={2.5} />
              </button>
            </label>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0 xl:gap-2">
            <Link href="#" aria-label="Moj nalog" className="flex h-12 items-center gap-2 rounded-full px-3 text-[#1a2340] transition-colors hover:bg-maglica hover:text-plava">
              <UserRound aria-hidden className="size-6" strokeWidth={1.75} />
              <span className="hidden text-sm font-semibold xl:inline">Nalog</span>
            </Link>
            <Link href="#" aria-label="Korpa, 0 artikala" className="flex h-12 items-center gap-2 rounded-full px-3 text-[#1a2340] transition-colors hover:bg-maglica hover:text-plava xl:bg-maglica xl:px-4 xl:hover:bg-[#e6eaf2]">
              <span className="relative">
                <ShoppingCart aria-hidden className="size-6" strokeWidth={1.75} />
                <span className="absolute -top-1.5 -right-2 grid size-[18px] place-items-center rounded-full bg-crvena text-[11px] font-bold text-white">0</span>
              </span>
              <span className="hidden pl-1 text-sm font-semibold xl:inline">Korpa</span>
            </Link>
          </div>
        </div>
      </header>

      <nav aria-label="Glavni meni" className="hidden border-b border-linija bg-white lg:block">
        <div className="omot flex h-12 items-center justify-between gap-6">
          <ul className="flex items-center gap-7 xl:gap-9">
            {glavniMeni.map((stavka) => (
              <li key={stavka}>
                <Link
                  href="#"
                  className="relative block py-3 text-[15px] font-semibold tracking-tight whitespace-nowrap text-[#1a2340] transition-colors after:absolute after:inset-x-0 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-crvena after:transition-transform hover:text-plava hover:after:scale-x-100"
                >
                  {stavka}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="#" className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-crvena px-4 text-sm font-bold text-white transition-colors hover:bg-crvena-tamna">
            <BadgePercent aria-hidden className="size-[18px]" />
            Akcije
            <span aria-hidden className="relative ml-0.5 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
