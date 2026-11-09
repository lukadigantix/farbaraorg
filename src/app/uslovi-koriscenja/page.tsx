import type { Metadata } from "next";
import Link from "next/link";
import PravnaStrana, { type Odeljak } from "@/components/v2/strane/Pravno";
import { PodaciFirme } from "@/components/v2/strane/Delovi";
import { firma } from "@/data/sadrzaj";
import { tel } from "@/data/v2";

export const metadata: Metadata = { alternates: { canonical: "/uslovi-koriscenja/" },
  title: "Uslovi korišćenja",
  description: "Uslovi kupovine na sajtu Farbare Lisa Comerc: porudžbina, cene, odustanak od kupovine i reklamacije.",
};

// NACRT: stari sajt ove uslove nema. Odustanak i reklamacije prate Zakon o zaštiti potrošača;
// plaćanje i dostava se samo upućuju na svoje strane dok klijent ne da uslove. Klijent treba da potvrdi tekst.
const odeljci: Odeljak[] = [
  {
    id: "prodavac",
    naslov: "Prodavac",
    sadrzaj: (
      <>
        <p>
          Sajt farbara.org vodi {firma.naziv}, {firma.adresa}. Telefoni: <a href={tel(firma.fiksni)}>{firma.fiksni}</a> i <a href={tel(firma.mobilni)}>{firma.mobilni}</a>.
        </p>
        <div className="rounded-2xl bg-sivka px-5 py-1">
          <PodaciFirme />
        </div>
      </>
    ),
  },
  {
    id: "nalog",
    naslov: "Nalog",
    sadrzaj: (
      <p>
        Za kupovinu nalog nije obavezan. Ako ga otvorite, podaci treba da budu tačni, a lozinku čuvate vi. Ako primetite da neko drugi koristi vaš nalog, javite nam se odmah. Kako postupamo sa podacima piše u <Link href="/politika-privatnosti">Politici privatnosti</Link>.
      </p>
    ),
  },
  {
    id: "artikli",
    naslov: "Artikli i cene",
    sadrzaj: (
      <>
        <p>Cene su iskazane u dinarima. Važi cena koja stoji na sajtu u trenutku slanja porudžbine.</p>
        <p>Fotografije su informativne. Nijansa boje na ekranu može se razlikovati od stvarne, zato za tačan ton pitajte u radnji ili tražite uzorak.</p>
        <p>Stanje na lageru se menja. Ako poručenog artikla nema, javićemo vam se i dogovoriti zamenu ili izmenu porudžbine.</p>
      </>
    ),
  },
  {
    id: "porudzbina",
    naslov: "Porudžbina",
    sadrzaj: (
      <p>
        Porudžbina je ponuda za kupovinu. Ugovor je zaključen kad vam potvrdimo porudžbinu. Do tada je možete izmeniti ili otkazati pozivom na <a href={tel(firma.fiksni)}>{firma.fiksni}</a>.
      </p>
    ),
  },
  {
    id: "placanje-dostava",
    naslov: "Plaćanje i dostava",
    sadrzaj: (
      <p>
        Načini plaćanja i uslovi isporuke opisani su na stranama <Link href="/nacin-placanja">Način plaćanja</Link> i <Link href="/dostava">Dostava</Link>.
      </p>
    ),
  },
  {
    id: "odustanak",
    naslov: "Odustanak od kupovine",
    sadrzaj: (
      <>
        <p>Ako kupujete kao fizičko lice, od ugovora zaključenog na daljinu možete odustati u roku od 14 dana od dana kada ste primili robu, bez navođenja razloga. Dovoljno je da nas o tome obavestite pre isteka roka.</p>
        <ul>
          <li>Robu vratite neoštećenu, najkasnije 14 dana od obaveštenja. Troškove vraćanja snosite vi.</li>
          <li>Novac vraćamo bez odlaganja, najkasnije 14 dana od prijema obaveštenja, a možemo ga zadržati dok ne primimo vraćenu robu.</li>
          <li>Odustanak nije moguć za robu napravljenu po vašem zahtevu, kao što su tonirane boje i auto boje mešane po kodu.</li>
        </ul>
        <p>Ovo pravo nemaju firme i preduzetnici koji kupuju za svoju delatnost.</p>
      </>
    ),
  },
  {
    id: "reklamacije",
    naslov: "Reklamacije",
    sadrzaj: (
      <>
        <p>Odgovaramo za nesaobraznost robe ugovoru koja se pojavi u roku od dve godine od predaje robe.</p>
        <p>
          Reklamaciju možete izjaviti u radnji na adresi {firma.adresa} ili telefonom na <a href={tel(firma.fiksni)}>{firma.fiksni}</a>. Ponesite ili pošaljite račun ili drugi dokaz o kupovini.
        </p>
        <p>Na reklamaciju odgovaramo najkasnije u roku od 8 dana od prijema, a rešavamo je najkasnije u roku od 15 dana.</p>
      </>
    ),
  },
  {
    id: "sporovi",
    naslov: "Sporovi",
    sadrzaj: (
      <p>
        Nesporazum ćemo pokušati da rešimo dogovorom. Kao potrošač možete pokrenuti i vansudsko rešavanje spora pred telom sa liste koju vodi ministarstvo nadležno za zaštitu potrošača. Za sve što ovde nije navedeno važe Zakon o zaštiti potrošača i Zakon o obligacionim odnosima.
      </p>
    ),
  },
  {
    id: "izmene",
    naslov: "Izmene uslova",
    sadrzaj: <p>Uslove možemo izmeniti. Na porudžbinu se primenjuju uslovi koji su važili kada ste je poslali.</p>,
  },
];

export default function UsloviKoriscenja() {
  return (
    <PravnaStrana
      naziv="Uslovi korišćenja"
      uvod={<p>Ovi uslovi važe za kupovinu na sajtu farbara.org. Slanjem porudžbine potvrđujete da ste ih pročitali i prihvatili.</p>}
      odeljci={odeljci}
    />
  );
}
