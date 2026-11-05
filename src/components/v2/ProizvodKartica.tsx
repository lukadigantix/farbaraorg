import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cena, linkArtikla } from "@/data/v2";
import DodajDugme from "./korpa/DodajDugme";
import { SrceDugme } from "./sacuvano/Sacuvano";

type Props = { id: number; naziv: string; brend?: string; cena: number; slika: string; sizes: string; sifra?: string; puna?: boolean; izbor?: boolean };

const dugme = "ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-narandza text-white transition-colors hover:bg-narandza-tamna sm:size-11";

// Slike sa starog sajta imaju belu pozadinu; multiply je stapa sa pločom
export default function ProizvodKartica({ id, naziv, brend, cena: iznos, slika, sizes, sifra, puna, izbor }: Props) {
  const link = linkArtikla(id, naziv);
  return (
    <article className="group relative flex h-full flex-col rounded-[20px] bg-white p-2 shadow-[0_0_0_1px_#e8ebed,0_8px_14px_-10px_rgba(35,40,50,.28)] transition-shadow duration-200 hover:shadow-[0_0_0_1px_var(--color-zlatna),0_8px_14px_-10px_rgba(35,40,50,.28)]">
      <div className="relative shrink-0">
        <Link href={link} aria-label={naziv} className="relative block h-[150px] overflow-hidden rounded-xl bg-sivka sm:h-[196px]">
          <span className={`absolute ${puna ? "inset-0" : "inset-x-[12%] top-[14%] bottom-[8%]"}`}>
            <Image src={slika} alt="" fill sizes={sizes} className={`transition-transform duration-300 group-hover:scale-[1.04] ${puna ? "object-cover" : "object-contain mix-blend-multiply"}`} />
          </span>
          {brend && <span className="absolute top-2.5 left-2.5 max-w-[calc(100%-56px)] truncate rounded-full bg-white px-2.5 py-1 text-[12px] leading-none font-medium">{brend}</span>}
        </Link>
        <SrceDugme stavka={{ id, naziv, cena: iznos, slika, brend, sifra, puna, izbor }} klasa="absolute top-1.5 right-1.5 grid size-9 place-items-center rounded-full bg-white text-tinta shadow-[0_2px_8px_rgba(35,40,50,.18)] transition-colors hover:text-narandza" />
      </div>
      <h3 className="mt-3.5 line-clamp-2 min-h-[2.8em] px-2 text-[16px] leading-[1.4]">
        <Link href={link} className="transition-colors hover:text-narandza">{naziv}</Link>
      </h3>
      {sifra && <p className="mt-0.5 truncate px-2 text-[12px] font-light text-sivi-2">Šifra: {sifra}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-1.5 gap-y-2 pt-2 pl-2">
        <p className="text-[clamp(15px,4.6vw,20px)] leading-none font-semibold tracking-[-0.01em] whitespace-nowrap text-narandza sm:text-[18px] xl:text-[20px]">{cena(iznos)}</p>
        {izbor ? (
          <Link href={link} aria-label={`Izaberite opcije: ${naziv}`} className={dugme}>
            <ArrowRight aria-hidden className="size-[18px]" strokeWidth={2.25} />
          </Link>
        ) : (
          <DodajDugme klasa={dugme} stavka={{ id, naziv, sifra, cena: iznos, slika, puna, link }} />
        )}
      </div>
    </article>
  );
}
