import type { Metadata } from "next";
import StranaSacuvano from "@/components/v2/sacuvano/StranaSacuvano";

export const metadata: Metadata = { title: "Sačuvani proizvodi - Lisa Comerc" };

export default function SacuvaniProizvodi() {
  return <StranaSacuvano />;
}
