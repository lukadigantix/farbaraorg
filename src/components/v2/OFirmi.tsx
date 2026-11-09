import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

const ROBA = ["Boje", "Lakovi", "Fasade", "Lepila", "Alati"];

export default function OFirmi() {
  return (
    <section className="v2-omot pt-[72px]" aria-labelledby="o-firmi">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        <div className="flex flex-col justify-between gap-10 overflow-hidden rounded-[28px] rounded-br-[72px] bg-narandza p-7 text-white [container-type:inline-size] sm:col-span-2 sm:p-10 lg:col-span-5 lg:min-h-[480px]">
          <h2 id="o-firmi" className="text-[clamp(1.75rem,8cqw,2.5rem)] leading-tight font-[550] tracking-[-0.03em]">
            Porodična firma od
            <span className="mt-2 -ml-[0.04em] block text-[clamp(5rem,54cqw,15rem)] leading-[0.9] tracking-[-0.06em]">1991.</span>
          </h2>
          <div>
            <p className="max-w-[26em] text-[17px] leading-[1.45]">Osnovana marta 1991. godine, sa osnivačem i direktorom Milonjom Golubovićem na čelu.</p>
            <Link href="/o-nama" className="mt-6 inline-flex h-14 items-center gap-3 rounded-full bg-white px-7 text-[16px] font-medium text-narandza uppercase transition-colors hover:bg-breskva">
              O nama
              <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="relative aspect-[3/2] overflow-hidden rounded-[28px] rounded-tr-[72px] bg-dim sm:col-span-2 lg:col-span-7 lg:aspect-auto">
          <Image src="/img/v2/pistolj-komora.webp" alt="Pištolj za lakiranje iznad delova automobila u komori" fill unoptimized className="object-cover" />
        </div>

        <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[28px] bg-noc p-7 text-white sm:col-span-2 lg:col-span-4">
          <Image src="/img/v2/radnja-police-ai.webp" alt="Police sa auto bojama i lakovima u radnji Lisa Comerc" fill unoptimized className="object-cover object-[14%_center]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#141821] via-[#141821]/75 to-[#141821]/5" />
          <div className="relative">
            <h3 className="text-[clamp(1.625rem,2.3vw,2rem)] leading-tight font-[550] tracking-[-0.025em]">Na veliko i malo</h3>
            <p className="mt-2 text-[16px] leading-[1.45] font-light text-white/85">Glavna delatnost preduzeća je promet boja i lakova na veliko i malo.</p>
          </div>
        </div>

        <div className="flex min-h-[280px] flex-col justify-between gap-8 rounded-[28px] bg-ugalj p-7 text-white lg:col-span-4">
          <ul className="flex flex-wrap gap-2">
            {ROBA.map((r) => (
              <li key={r} className="rounded-full bg-white/10 px-4 py-2 text-[15px]">{r}</li>
            ))}
          </ul>
          <div>
            <h3 className="text-[clamp(1.625rem,2.3vw,2rem)] leading-tight font-[550] tracking-[-0.025em]">Najbolji proizvođači</h3>
            <p className="mt-2 text-[16px] leading-[1.45] font-light text-white/70">Zastupamo domaće i strane proizvođače boja, lakova, fasada, lepila i alata.</p>
          </div>
        </div>

        <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-[28px] rounded-bl-[72px] bg-dim p-7 lg:col-span-4">
          <Globe aria-hidden className="absolute -top-14 -right-14 size-[240px] text-white/70" strokeWidth={0.75} />
          <div className="relative">
            <h3 className="text-[clamp(1.625rem,2.3vw,2rem)] leading-tight font-[550] tracking-[-0.025em]">Spoljna trgovina</h3>
            <p className="mt-2 text-[16px] leading-[1.45] font-light text-[#4d5361]">Registrovani smo i za spoljnotrgovinski promet i usluge u spoljnoj trgovini.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
