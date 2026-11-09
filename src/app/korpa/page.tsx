import type { Metadata } from "next";
import StranaKorpe from "@/components/v2/korpa/StranaKorpe";

export const metadata: Metadata = { title: "Korpa", robots: { index: false } };

export default function Korpa() {
  return <StranaKorpe />;
}
