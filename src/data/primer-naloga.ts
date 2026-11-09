// SAMO ZA RAZVOJ: da se strana /moj-nalog vidi dok nalozi nisu povezani.
// U produkciji se ne prikazuje (vidi app/moj-nalog/page.tsx). Artikli i cene su pravi, iz katalog.json.
import katalog from "@/data/katalog.json";
import { linkArtikla } from "@/data/v2";
import type { Nalog, StavkaPorudzbine } from "@/lib/nalog";

const stavka = (id: number, kolicina: number): StavkaPorudzbine => {
  const p = katalog.find((a) => a.id === id)!;
  return { id, naziv: p.naziv, slika: p.slike[0], cena: p.cena, kolicina, link: linkArtikla(id, p.naziv) };
};

const zbir = (s: StavkaPorudzbine[]) => s.reduce((z, x) => z + x.cena * x.kolicina, 0);

const prva = [stavka(9037, 1), stavka(7019, 2), stavka(13371, 1)];
const druga = [stavka(6395, 1), stavka(8662, 1)];
const treca = [stavka(9026, 3)];

export const primerNaloga: Nalog = {
  tip: "fizicko",
  ime: "Petar Petrović",
  email: "kupac@example.com",
  telefon: "+381 60 000 0000",
  adresa: "Primer ulica 1",
  mesto: "Beograd",
  postanskiBroj: "11000",
  porudzbine: [
    { broj: "1042", datum: "2026-11-07T10:24:00", status: "u-pripremi", ukupno: zbir(prva), preuzimanje: "Preuzimanje u radnji", placanje: "Plaćanje u radnji", stavke: prva },
    { broj: "1027", datum: "2026-10-18T16:02:00", status: "zavrsena", ukupno: zbir(druga), preuzimanje: "Preuzimanje u radnji", placanje: "Plaćanje u radnji", stavke: druga },
    { broj: "1009", datum: "2026-09-30T08:45:00", status: "otkazana", ukupno: zbir(treca), preuzimanje: "Preuzimanje u radnji", placanje: "Plaćanje u radnji", stavke: treca },
  ],
};
