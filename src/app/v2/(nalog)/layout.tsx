import type { ReactNode } from "react";
import Image from "next/image";
import Naslovi from "@/components/v2/nalog/Naslovi";

export default function NalogLayout({ children }: { children: ReactNode }) {
  return (
    <section className="v2-omot grid gap-6 pt-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-0 lg:pt-6">
      <div className="relative h-[190px] overflow-hidden rounded-[24px] lg:h-auto lg:min-h-[max(640px,calc(100dvh-168px))] lg:rounded-[28px]">
        <Image src="/img/v2/auto-lakiranje-logo-m.webp" alt="Lakirer u zaštitnom odelu farba branik automobila pištoljem" fill priority unoptimized className="object-cover object-[50%_38%] lg:object-center" />
        <div aria-hidden className="absolute inset-0 hidden bg-gradient-to-t from-[#141821]/90 via-[#141821]/25 to-[#141821]/5 lg:block" />
        <div className="absolute inset-x-9 bottom-9 hidden text-white lg:block">
          <p className="text-[clamp(1.625rem,2.3vw,2.125rem)] leading-[1.15] font-[550] tracking-[-0.025em]">„Svi naši zaposleni, naši kupci i potrošači pripadaju porodici.“</p>
          <p className="mt-6 text-[16px] font-medium">Lisa Comerc d.o.o.</p>
          <p className="mt-0.5 text-[15px] font-light text-white/80">Porodična firma od 1991.</p>
        </div>
      </div>
      <div className="flex items-center justify-center lg:px-10 lg:py-12">
        <div className="w-full max-w-[460px]">
          <Naslovi />
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}
