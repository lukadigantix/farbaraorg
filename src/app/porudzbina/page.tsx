import type { Metadata } from "next";
import StranaPorudzbine from "@/components/v2/korpa/StranaPorudzbine";

export const metadata: Metadata = { title: "Porudžbina", robots: { index: false } };

export default function Porudzbina() {
  return <StranaPorudzbine />;
}
