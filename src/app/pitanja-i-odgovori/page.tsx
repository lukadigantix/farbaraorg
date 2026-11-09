import type { Metadata } from "next";
import Link from "next/link";
import { PozivKartica, Putanja, VelikiNaslov } from "@/components/v2/strane/Delovi";
import ListaPitanja from "@/components/v2/strane/ListaPitanja";
import { firma } from "@/data/sadrzaj";
import { linkArtikla, markeVozila, putanjaGrupe, tel } from "@/data/v2";
import { JsonLd, tekstIzCvora } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/pitanja-i-odgovori/" }, title: "Pitanja i odgovori", description: "Auto boje po kodu, auto korektor, punjenje spreja, toniranje boja, prodaja na veliko i stanje artikala: odgovori Farbare Lisa Comerc iz Beograda." };

const veza = "font-normal text-narandza underline underline-offset-2";
const telefon = <a href={tel(firma.fiksni)} className={`${veza} whitespace-nowrap`}>{firma.fiksni}</a>;

// Odgovori su sastavljeni samo od podataka sa farbara.org i flajera firme; klijent treba da ih potvrdi
const pitanja = [
  { p: "Da li možete da napravite boju za moj automobil?", o: <p>Da, miksovanje boja za automobile je naša specijalnost. <Link href={linkArtikla(5300, "Auto korektor")} className={veza}>Auto korektor</Link> radimo po originalnom broju, odnosno kodu boje vašeg automobila.</p> },
  { p: "Gde da nađem kod boje automobila?", o: <p>Ako ne znate gde se nalazi kod boje, pozovite nas na {telefon} i pomoći ćemo vam.</p> },
  { p: "Za koje marke vozila radite auto korektor?", o: <p>{markeVozila.join(", ")}.</p> },
  { p: "Da li punite spreje?", o: <p>Da, punimo spreje bojom koju želite. Pogledajte i ceo <Link href={putanjaGrupe("Auto program")} className={veza}>auto program</Link>.</p> },
  { p: "Da li tonirate boje?", o: <p>Da. Molerski materijal toniramo u preko 5.000 nijansi, a fasadne boje imamo u više od 1000 nijansi.</p> },
  { p: "Da li prodajete na veliko?", o: <p>Da, bavimo se prometom boja i lakova na veliko i malo. Za saradnju nas pozovite na {telefon}.</p> },
  { p: "Gde se nalazite?", o: <p>{firma.adresa}. Mapu i sve kontakte imate na strani <Link href="/kontakt" className={veza}>Kontakt</Link>.</p> },
  { p: "Kako da proverim da li je artikal na stanju?", o: <p>Pozovite nas na {telefon} ili {<a href={tel(firma.mobilni)} className={`${veza} whitespace-nowrap`}>{firma.mobilni}</a>}.</p> },
];

export default function PitanjaIOdgovori() {
  return (
    <>
      <JsonLd
        podaci={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pitanja.map((x) => ({ "@type": "Question", name: x.p, acceptedAnswer: { "@type": "Answer", text: tekstIzCvora(x.o) } })),
        }}
      />
      <section className="v2-omot pt-4 lg:pt-6">
        <Putanja naziv="Pitanja i odgovori" />
        <div className="mt-6 lg:mt-8"><VelikiNaslov>Pitanja i odgovori</VelikiNaslov></div>
        <div className="mt-8 lg:mt-12"><ListaPitanja pitanja={pitanja} /></div>
      </section>
      <section className="v2-omot pt-(--razmak)">
        <PozivKartica naslov="Niste našli odgovor?" tekst="Pozovite nas, rado ćemo pomoći oko izbora i količine." />
      </section>
    </>
  );
}
