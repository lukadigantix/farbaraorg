// Jedina tačka koja se menja kad dođe baza
import type { StavkaKorpe } from "@/components/v2/korpa/Korpa";
import type { Rezultat } from "./nalog";

export type Porudzbina = {
  tip: "fizicko" | "firma";
  firma?: string;
  pib?: string;
  ime: string;
  email: string;
  telefon: string;
  preuzimanje: "dostava" | "radnja";
  adresa?: string;
  mesto?: string;
  postanskiBroj?: string;
  placanje: "pouzece" | "racun";
  napomena?: string;
  stavke: StavkaKorpe[];
};

export async function posaljiPorudzbinu(_p: Porudzbina): Promise<Rezultat> {
  return { ok: false, poruka: "Porudžbine još nisu povezane, pa se ovi podaci nigde ne šalju." };
}
