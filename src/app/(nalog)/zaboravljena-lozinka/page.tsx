import type { Metadata } from "next";
import Link from "next/link";
import FormaLozinke from "@/components/v2/nalog/FormaLozinke";

export const metadata: Metadata = { title: "Zaboravljena lozinka", robots: { index: false } };

export default function ZaboravljenaLozinka() {
  return (
    <>
      <FormaLozinke />
      <p className="mt-6 text-center text-[15px]">
        <Link href="/prijava" className="text-narandza underline-offset-2 hover:underline">Nazad na prijavu</Link>
      </p>
    </>
  );
}
