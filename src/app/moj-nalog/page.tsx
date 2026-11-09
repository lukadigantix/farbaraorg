import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import MojNalog from "@/components/v2/nalog/MojNalog";
import { Putanja } from "@/components/v2/strane/Delovi";
import { primerNaloga } from "@/data/primer-naloga";
import { trenutniNalog } from "@/lib/nalog";

export const metadata: Metadata = { title: "Moj nalog", robots: { index: false, follow: false } };

export default function Strana() {
  return (
    <section className="v2-omot pt-4 lg:pt-6">
      <Putanja naziv="Moj nalog" />
      <Suspense fallback={<div aria-hidden className="mt-8 h-[560px] animate-pulse rounded-[28px] bg-sivka" />}>
        <Sadrzaj />
      </Suspense>
    </section>
  );
}

async function Sadrzaj() {
  const nalog = await trenutniNalog();
  if (nalog) return <MojNalog nalog={nalog} />;
  // Dok nalozi nisu povezani, u razvoju se vidi primer; na pravom sajtu neprijavljen kupac ide na prijavu
  if (process.env.NODE_ENV === "production") redirect("/prijava");
  return <MojNalog nalog={primerNaloga} primer />;
}
