import type { Metadata } from "next";
import StranaPorudzbine from "@/components/v2/korpa/StranaPorudzbine";

export const metadata: Metadata = { title: "Porudžbina - Lisa Comerc" };

export default function Porudzbina() {
  return <StranaPorudzbine />;
}
