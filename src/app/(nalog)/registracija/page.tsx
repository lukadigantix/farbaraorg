import type { Metadata } from "next";
import Link from "next/link";
import FormaRegistracije from "@/components/v2/nalog/FormaRegistracije";

export const metadata: Metadata = { title: "Registracija", robots: { index: false } };

export default function Registracija() {
  return (
    <>
      <FormaRegistracije />
      <p className="mt-7 text-center text-[15px] font-light text-[#4d5361]">
        Već imate nalog? <Link href="/prijava" className="font-medium text-narandza underline-offset-2 hover:underline">Prijavite se</Link>
      </p>
    </>
  );
}
