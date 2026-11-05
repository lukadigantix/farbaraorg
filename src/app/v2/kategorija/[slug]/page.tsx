import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Katalog from "@/components/v2/katalog/Katalog";
import katalog from "@/data/katalog.json";
import { grupe, putanjaGrupe, slikaArtikla, uSlug } from "@/data/v2";

const nadji = (slug: string) => grupe.find((g) => uSlug(g.naziv) === slug);

export function generateStaticParams() {
  return grupe.map((g) => ({ slug: uSlug(g.naziv) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const g = nadji((await params).slug);
  return g ? { title: `${g.naziv} - Lisa Comerc`, description: `${g.naziv} u prodavnici Lisa Comerc, Beograd.` } : {};
}

function Kostur() {
  return (
    <div aria-hidden className="v2-omot animate-pulse pt-4 lg:pt-6">
      <div className="h-[230px] rounded-[28px] bg-sivka" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[264px_minmax(0,1fr)]">
        <div className="hidden h-[520px] rounded-2xl bg-sivka lg:block" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-[320px] rounded-[20px] bg-sivka" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Strana({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<Kostur />}>
      <StranaKategorije params={params} />
    </Suspense>
  );
}

async function StranaKategorije({ params }: { params: Promise<{ slug: string }> }) {
  const grupa = nadji((await params).slug);
  if (!grupa) notFound();
  const artikli = katalog
    .filter((p) => p.grupa === grupa.naziv)
    .map((p) => ({ id: p.id, naziv: p.naziv, sifra: p.sifra, cena: p.cena, slika: p.slike[0], brend: p.brend, stavke: p.stavke, puna: "puna" in p ? !!p.puna : false, izbor: p.opcije.length > 0 }));

  return (
    <>
      <section className="v2-omot pt-4 lg:pt-6">
        <div className="relative overflow-hidden rounded-[28px] px-6 py-7 sm:px-10 sm:py-10 lg:px-14 lg:py-12" style={{ background: `color-mix(in srgb, ${grupa.akcent} 13%, white)` }}>
          <nav aria-label="Putanja" className="flex items-center gap-1.5 text-[14px] text-tinta/60">
            <Link href="/v2" className="transition-colors hover:text-tinta">Početna</Link>
            <ChevronRight aria-hidden className="size-3.5" />
            <span className="text-tinta">{grupa.naziv}</span>
          </nav>
          <div className="relative z-10 max-w-[62%] sm:max-w-[68%]">
            <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.5rem)] leading-[1.06] font-[550] tracking-[-0.03em]">{grupa.naziv}</h1>
            {grupa.usluga && <p className="mt-3 text-[16px] leading-snug text-tinta/75 sm:text-[18px]">{grupa.usluga}</p>}
          </div>
          <div className="absolute top-1/2 right-4 h-[78%] w-[32%] -translate-y-1/2 sm:right-10 lg:right-16 lg:w-[22%]">
            <Image src={slikaArtikla(grupa.slika)} alt="" fill priority sizes="(min-width: 1024px) 280px, 32vw" className="object-contain drop-shadow-[0_18px_18px_rgba(35,40,50,.25)]" />
          </div>
        </div>
      </section>

      <Katalog key={grupa.naziv} artikli={artikli} stavke={grupa.stavke} akcent={grupa.akcent} nazivGrupe={grupa.naziv} />

      <section className="v2-omot pt-16" aria-label="Ostale kategorije">
        <h2 className="v2-h2">Ostale kategorije</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {grupe
            .filter((g) => g !== grupa)
            .map((g) => (
              <li key={g.naziv}>
                <Link href={putanjaGrupe(g.naziv)} className="group flex h-full flex-col rounded-2xl bg-sivka p-3 transition-colors hover:bg-breskva">
                  <span className="relative block h-24 w-full">
                    <Image src={slikaArtikla(g.slika)} alt="" fill sizes="180px" className="object-contain" />
                  </span>
                  <span className="mt-3 text-[15px] leading-tight transition-colors group-hover:text-narandza">{g.naziv}</span>
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </>
  );
}
