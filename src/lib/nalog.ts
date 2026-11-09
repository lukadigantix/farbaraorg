// Jedina tačka koja se menja kad dođe baza. Lozinke se nikad ne čuvaju u browseru.
export type Rezultat = { ok: true } | { ok: false; poruka: string };

export type Registracija = {
  tip: "fizicko" | "firma";
  ime: string;
  email: string;
  telefon: string;
  lozinka: string;
  firma?: string;
  pib?: string;
};

const NEPOVEZANO: Rezultat = { ok: false, poruka: "Nalozi još nisu povezani sa bazom, pa se ovi podaci nigde ne šalju." };

export async function prijaviSe(_podaci: { email: string; lozinka: string }): Promise<Rezultat> {
  return NEPOVEZANO;
}

export async function registrujSe(_podaci: Registracija): Promise<Rezultat> {
  return NEPOVEZANO;
}

export async function posaljiLinkZaLozinku(_email: string): Promise<Rezultat> {
  return NEPOVEZANO;
}

// ---- Moj nalog ----

export type StatusPorudzbine = "primljena" | "u-pripremi" | "spremna" | "poslata" | "zavrsena" | "otkazana";

export type StavkaPorudzbine = { id: number; naziv: string; slika: string; cena: number; kolicina: number; link: string; napomena?: string };

export type PorudzbinaNaloga = {
  broj: string;
  datum: string; // ISO
  status: StatusPorudzbine;
  ukupno: number;
  preuzimanje: string; // tekst kako ga backend vrati, npr. „Preuzimanje u radnji“
  placanje: string;
  adresa?: string;
  stavke: StavkaPorudzbine[];
};

export type PodaciNaloga = {
  tip: "fizicko" | "firma";
  ime: string;
  email: string;
  telefon: string;
  firma?: string;
  pib?: string;
  adresa?: string;
  mesto?: string;
  postanskiBroj?: string;
};

export type Nalog = PodaciNaloga & { porudzbine: PorudzbinaNaloga[] };

// Prijavljeni kupac ili null. Backend ovde čita sesiju (kolačić) i bazu.
export async function trenutniNalog(): Promise<Nalog | null> {
  return null;
}

export async function sacuvajPodatke(_podaci: PodaciNaloga): Promise<Rezultat> {
  return NEPOVEZANO;
}

export async function promeniLozinku(_podaci: { trenutna: string; nova: string }): Promise<Rezultat> {
  return NEPOVEZANO;
}

export async function odjaviSe(): Promise<Rezultat> {
  return NEPOVEZANO;
}
