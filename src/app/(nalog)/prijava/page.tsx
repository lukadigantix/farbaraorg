import type { Metadata } from "next";
import Link from "next/link";
import FormaPrijave from "@/components/v2/nalog/FormaPrijave";

export const metadata: Metadata = { title: "Prijava", robots: { index: false } };

export default function Prijava() {
  return (
    <>
      <FormaPrijave />
      <p className="mt-7 text-center text-[15px] font-light text-[#4d5361]">
        Nemate nalog? <Link href="/registracija" className="font-medium text-narandza underline-offset-2 hover:underline">Registrujte se</Link>
      </p>
    </>
  );
}
