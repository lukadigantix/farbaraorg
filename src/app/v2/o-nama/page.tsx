import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import Brendovi from "@/components/Brendovi";
import { PodaciFirme, Putanja } from "@/components/v2/strane/Delovi";

export const metadata: Metadata = {
  title: "O nama - Lisa Comerc",
  description: "Porodična firma osnovana 1991. Promet boja i lakova na veliko i malo, Beograd.",
};

const ROBA = ["Boje", "Lakovi", "Premazi", "Fasade", "Lepila", "Kitovi", "Alati", "Rastvarači"];
const NASLOV = "text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.1] font-[550] tracking-[-0.03em]";

// Tekst je sa strane „O nama" na farbara.org
export default function ONama() {
  return (
    <>
      <section className="v2-omot pt-4 lg:pt-6">
        <Putanja naziv="O nama" />

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
          <div className="flex flex-col justify-between gap-10 overflow-hidden rounded-[28px] rounded-br-[72px] bg-narandza p-7 text-white [container-type:inline-size] sm:col-span-2 sm:p-10 lg:col-span-5 lg:min-h-[520px]">
            <h1 className="text-[clamp(1.75rem,8cqw,2.5rem)] leading-tight font-[550] tracking-[-0.03em]">
              Porodična firma od
              <span className="mt-2 -ml-[0.04em] block text-[clamp(5rem,54cqw,15rem)] leading-[0.9] tracking-[-0.06em]">1991.</span>
            </h1>
            <p className="max-w-[28em] text-[17px] leading-[1.45]">Osnovana marta 1991. godine, na čelu sa osnivačem i direktorom Milonjom Golubovićem. Glavna delatnost preduzeća je promet boja i lakova na veliko i malo.</p>
          </div>

          <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] rounded-tr-[72px] bg-dim sm:col-span-2 lg:col-span-7 lg:aspect-auto">
            <Image src="/img/v2/radnja-police-ai.webp" alt="Police sa auto bojama i lakovima u radnji Lisa Comerc" fill priority unoptimized className="object-cover object-[16%_center]" />
          </div>

          <figure className="flex flex-col justify-center rounded-[28px] rounded-bl-[72px] bg-ugalj p-7 text-white sm:col-span-2 sm:p-10 lg:col-span-7 lg:min-h-[420px] lg:p-14">
            <figcaption className="v2-nad">Naša filozofija</figcaption>
            <blockquote className="mt-4 text-[clamp(1.75rem,3.2vw,2.875rem)] leading-[1.12] font-[550] tracking-[-0.03em]">Svi naši zaposleni, naši kupci i potrošači pripadaju porodici.</blockquote>
            <p className="mt-5 text-[clamp(1.125rem,1.5vw,1.25rem)] font-light text-white/65">To svima pokazujemo. Tako se ponašamo.</p>
          </figure>

          <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] bg-dim sm:col-span-2 lg:col-span-5 lg:aspect-auto">
            <Image src="/img/v2/radnja-alati-ai.webp" alt="Zid sa alatom, rukavicama i molerskim priborom u radnji Lisa Comerc" fill unoptimized className="origin-top scale-[1.1] object-cover object-[42%_center]" />
          </div>

          <div className="rounded-[28px] bg-sivka p-7 sm:col-span-2 sm:p-9 lg:col-span-5">
            <h2 className={NASLOV}>Volimo ono što radimo</h2>
            <div className="mt-4 space-y-3 text-[16px] leading-[1.5] font-light text-[#4d5361]">
              <p>Od samog početka pa do danas svakom poslu pristupamo puni entuzijazma i motiva kako bismo opravdali ukazano poverenje, u tome uspevamo najviše zato što volimo ono što radimo.</p>
              <p>Dokaz da i drugi vole ono što radimo i da to radimo najbolje su naši klijenti kojih je svakim danom sve više.</p>
              <p>Našu budućnost ostvarujemo sopstvenom dobiti. Uspešni i zadovoljni kupci su za to preduslov.</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8 rounded-[28px] bg-breskva p-7 lg:col-span-4">
            <ul className="flex flex-wrap gap-2">
              {ROBA.map((r) => (
                <li key={r} className="rounded-full bg-white px-4 py-2 text-[15px] text-narandza-tamna">{r}</li>
              ))}
            </ul>
            <div>
              <h2 className={NASLOV}>Naši dobavljači</h2>
              <p className="mt-3 text-[16px] leading-[1.45] font-light text-[#4d5361]">Naši dobavljači su najbolji proizvođači boja, lakova, premaza, fasada, lepila, kitova, alata i rastvarača.</p>
            </div>
          </div>

          <div className="relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[28px] bg-dim p-7 lg:col-span-3">
            <Globe aria-hidden className="absolute -top-14 -right-14 size-[220px] text-white/70" strokeWidth={0.75} />
            <div className="relative">
              <h2 className={NASLOV}>Spoljna trgovina</h2>
              <p className="mt-3 text-[16px] leading-[1.45] font-light text-[#4d5361]">Registrovani smo i za spoljnotrgovinski promet i usluge u spoljnotrgovinskom prometu.</p>
            </div>
          </div>
        </div>
      </section>

      <Brendovi />

      <section className="v2-omot grid gap-3 pt-(--razmak) lg:grid-cols-12 lg:gap-4">
        <div className="flex flex-col justify-between gap-8 rounded-[28px] rounded-br-[72px] bg-narandza p-7 text-white sm:p-10 lg:col-span-5">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.12] font-[550] tracking-[-0.03em]">U našem i Vašem interesu slobodni smo da Vas pozovemo na saradnju.</h2>
          <div>
            <Link href="/v2/kontakt" className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 text-[16px] font-medium text-narandza uppercase transition-colors hover:bg-breskva">
              Kontakt
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
        <div className="rounded-[28px] bg-sivka p-7 sm:p-10 lg:col-span-7">
          <h2 className={NASLOV}>Podaci o firmi</h2>
          <div className="mt-3"><PodaciFirme /></div>
        </div>
      </section>
    </>
  );
}
