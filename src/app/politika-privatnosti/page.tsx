import type { Metadata } from "next";
import Link from "next/link";
import PravnaStrana, { type Odeljak } from "@/components/v2/strane/Pravno";
import { firma } from "@/data/sadrzaj";
import { tel } from "@/data/v2";

export const metadata: Metadata = { alternates: { canonical: "/politika-privatnosti/" },
  title: "Politika privatnosti",
  description: "Koje podatke prikuplja sajt Farbare Lisa Comerc, zašto, koliko ih čuvamo i koja su vaša prava.",
};

// NACRT: stari sajt ima samo engleski demo tekst teme (WoodMart), pa nema šta da se prenese.
// Tekst opisuje ono što novi sajt stvarno radi; klijent treba da ga potvrdi, a backend da dopuni ako doda nešto novo.
const odeljci: Odeljak[] = [
  {
    id: "rukovalac",
    naslov: "Ko obrađuje podatke",
    sadrzaj: (
      <>
        <p>
          Rukovalac podacima je <strong>{firma.naziv}</strong>, {firma.adresa}, PIB {firma.pib}, matični broj {firma.maticni}.
        </p>
        <p>
          Za sva pitanja o podacima pozovite nas na <a href={tel(firma.fiksni)}>{firma.fiksni}</a> ili <a href={tel(firma.mobilni)}>{firma.mobilni}</a>, ili dođite u radnju.
        </p>
      </>
    ),
  },
  {
    id: "podaci",
    naslov: "Koje podatke prikupljamo",
    sadrzaj: (
      <>
        <p>Prikupljamo samo ono što nam sami date ili što je neophodno da sajt radi:</p>
        <ul>
          <li><strong>Nalog:</strong> ime i prezime, e-mail, telefon i lozinku. Za firme i naziv firme i PIB. Lozinku čuvamo samo u šifrovanom obliku.</li>
          <li><strong>Porudžbina:</strong> ime, kontakt, adresu ako je potrebna za isporuku, napomenu i artikle koje ste poručili.</li>
          <li><strong>Chat:</strong> poruke koje upišete AI asistentu.</li>
          <li><strong>Tehnički podaci:</strong> IP adresa, samo kratko i samo da bismo sprečili zloupotrebu chata i sajta.</li>
        </ul>
      </>
    ),
  },
  {
    id: "browser",
    naslov: "Šta ostaje u vašem browseru",
    sadrzaj: (
      <>
        <p>Korpa i sačuvani proizvodi pamte se u vašem browseru, da ih ne izgubite kad zatvorite stranu. Razgovor sa asistentom pamti se dok ne zatvorite karticu. Te podatke ne dobijamo dok ne pošaljete porudžbinu ili poruku.</p>
        <p>Sajt ne koristi kolačiće za praćenje ni za reklame. Kad se prijavite na nalog, koristi se samo neophodan kolačić koji pamti da ste prijavljeni.</p>
      </>
    ),
  },
  {
    id: "svrha",
    naslov: "Zašto ih koristimo",
    sadrzaj: (
      <ul>
        <li>da primimo, pripremimo i isporučimo porudžbinu i javimo vam se u vezi sa njom;</li>
        <li>da vodimo vaš nalog i istoriju porudžbina;</li>
        <li>da odgovorimo na pitanje u chatu ili telefonom;</li>
        <li>da ispunimo zakonske obaveze, na primer čuvanje računa;</li>
        <li>da zaštitimo sajt od zloupotrebe.</li>
      </ul>
    ),
  },
  {
    id: "primaoci",
    naslov: "Kome ih dajemo",
    sadrzaj: (
      <>
        <p>Podatke ne prodajemo i ne dajemo drugima radi reklame. Pristup imaju samo oni bez kojih usluga ne može:</p>
        <ul>
          <li>firma koja održava i hostuje sajt;</li>
          <li>kurirska služba, ako porudžbinu šaljemo, i to samo podatke potrebne za isporuku;</li>
          <li>Anthropic (SAD), koji pokreće AI asistenta i obrađuje poruke iz chata. U chat ne upisujte lične podatke koji nisu potrebni za pitanje.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cuvanje",
    naslov: "Koliko ih čuvamo",
    sadrzaj: <p>Podatke naloga čuvamo dok imate nalog. Podatke o porudžbinama čuvamo onoliko koliko zakon propisuje za poslovnu dokumentaciju. Posle toga ih brišemo.</p>,
  },
  {
    id: "prava",
    naslov: "Vaša prava",
    sadrzaj: (
      <>
        <p>Po Zakonu o zaštiti podataka o ličnosti imate pravo da:</p>
        <ul>
          <li>saznate koje podatke o vama imamo i dobijete kopiju;</li>
          <li>tražite ispravku ili brisanje;</li>
          <li>tražite ograničenje obrade ili uložite prigovor;</li>
          <li>povučete saglasnost, bez uticaja na ono što je urađeno pre toga.</li>
        </ul>
        <p>
          Zahtev nam možete podneti telefonom ili u radnji. Ako smatrate da su vaša prava povređena, možete se obratiti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti (
          <a href="https://www.poverenik.rs" target="_blank" rel="noopener">poverenik.rs</a>).
        </p>
      </>
    ),
  },
  {
    id: "izmene",
    naslov: "Izmene",
    sadrzaj: (
      <p>
        Ako promenimo način na koji obrađujemo podatke, izmenu ćemo objaviti na ovoj strani. Pogledajte i <Link href="/uslovi-koriscenja">Uslove korišćenja</Link>.
      </p>
    ),
  },
];

export default function PolitikaPrivatnosti() {
  return (
    <PravnaStrana
      naziv="Politika privatnosti"
      uvod={<p>Ovde piše koje podatke sajt farbara.org prikuplja, zašto, koliko ih čuvamo i koja su vaša prava.</p>}
      odeljci={odeljci}
    />
  );
}
