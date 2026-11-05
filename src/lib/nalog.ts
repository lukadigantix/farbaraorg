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
