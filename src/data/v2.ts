// Cene i nazivi: farbara.org, 4.11.2026. Sadržaj koji nije sa sajta klijenta je označen komentarom.

export type Artikal = { id: string; naziv: string; cena: number; brend: string };

export const slikaArtikla = (id: string) => `/img/v2/proizvodi/${id}.webp`;

export const cena = (rsd: number) => `${String(rsd).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} RSD`;

export const tel = (broj: string) => `tel:${broj.replace(/[^+\d]/g, "")}`;

// Smene u hero-u: raspored je isti, menjaju se sadržaj, fotografija i boja pozadine
export const slajdovi = [
  {
    nad: "Lisa Comerc prodavnica",
    naslov: ["Dajte svom prostoru", "novu boju"],
    tekst: ["Boje, alati i materijali za male popravke", "i velike promene."],
    dugme: "Pogledaj ponudu",
    grupa: "Molerski materijal",
    proizvod: "Jupol Gold 15 l",
    cena: 4700,
    artikal: "9037",
    slika: "/img/hero-ai.webp",
    alt: "Valjak sa plavom bojom, kante boje i lepeza nijansi",
    kadar: "object-right",
    boja: "#faf7f2",
  },
  {
    nad: "Auto program",
    naslov: ["Auto boje i lakovi", "za svaku nijansu"],
    tekst: ["Metalik baza, 2K akril boja, lakovi i kitevi.", "Punimo i spreje bojom koju želite."],
    dugme: "Pogledaj auto boje",
    grupa: "Auto program",
    proizvod: "Mobihel metalik, set",
    cena: 8900,
    artikal: "mobihel-2k",
    slika: "/img/v2/baneri/komora-gklasa-2.webp",
    alt: "Beli automobil u komori za lakiranje",
    kadar: "object-bottom",
    bezKarticeNaTelefonu: true,
    boja: "#eceded",
  },
  {
    nad: "Einhell alati",
    naslov: ["Einhell alat", "za svaki posao"],
    tekst: ["Aku bušilice, brusilice i perači pod pritiskom", "za kuću i radionicu."],
    dugme: "Pogledaj alate",
    grupa: "Alati",
    proizvod: "Einhell TH-CD12Li",
    cena: 5200,
    artikal: "6395",
    slika: "/img/v2/baneri/alat-na-stolu.webp",
    alt: "Einhell aku bušilica i ugaona brusilica na radnom stolu",
    kadar: "object-center",
    boja: "#f1e6d8",
  },
  {
    nad: "Boje i lakovi",
    naslov: ["Zaštita za drvo", "i metal"],
    tekst: ["Emajli, lakovi i temeljne boje", "za ogradu, vrata i prozore."],
    dugme: "Pogledaj premaze",
    grupa: "Molerski materijal",
    proizvod: "Irkom Aqua 700 ml",
    cena: 840,
    artikal: "6814",
    slika: "/img/v2/baneri/drvo.webp",
    alt: "Četka sa plavom bojom na drvenoj ogradi",
    kadar: "object-[70%_center]",
    boja: "#e3ebf2",
  },
  {
    nad: "Molerski materijal",
    naslov: ["Sve za krečenje", "na jednom mestu"],
    tekst: ["Kvalitetne boje, provereni brendovi", "i sav pribor za savršen rezultat."],
    dugme: "Pogledaj ponudu",
    grupa: "Molerski materijal",
    proizvod: "Zvezdapol 5 kg",
    cena: 400,
    artikal: "9026",
    slika: "/img/v2/baneri/krecenje.webp",
    alt: "Molerski valjak na bež zidu",
    kadar: "object-center",
    boja: "#d9c9b5",
  },
];

// Podela prema flajeru firme (docs/flajer.jpg). Stavka sa pod ima još jedan nivo.
export type StavkaGrupe = { naziv: string; pod?: string[] };
export type Grupa = { naziv: string; slika: string; akcent: string; usluga?: string; brendovi: string[]; stavke: StavkaGrupe[] };

const s = (...nazivi: string[]): StavkaGrupe[] => nazivi.map((naziv) => ({ naziv }));

export const grupe: Grupa[] = [
  {
    naziv: "Auto program",
    akcent: "#2a7fc9",
    slika: "mobihel-2k",
    usluga: "Punimo spreje bojom koju želite",
    brendovi: ["4CR", "Gravi Hel", "Mipa", "Mobihel", "HB Body"],
    stavke: [
      { naziv: "Boje i lakovi", pod: ["Metalik baza", "2K akril boja", "Industrijske boje"] },
      ...s("Špric gitevi i kitevi", "Učvršćivači", "Razređivači", "Polir paste na meru"),
    ],
  },
  {
    naziv: "Molerski materijal",
    akcent: "#f5c518",
    slika: "9037",
    usluga: "Toniranje preko 5.000 nijansi",
    brendovi: ["Helios", "Heliomix", "Kraft", "Irkom", "Maxima", "JUB", "Jumix sistem"],
    stavke: s("Disperzije", "Poludisperzije", "Akrilne boje", "Glet mase", "Podloge", "Mašinski malteri", "Boje, lakovi i zaštitni premazi za drvo i metal"),
  },
  {
    naziv: "Alati",
    akcent: "#e81825",
    slika: "6395",
    brendovi: ["Beorol", "Fischer", "Schuller Eh'klar", "Smirdex", "Tolsen"],
    stavke: s("Molerski", "Farbarski", "Autolakirerski", "Baštenski", "Creva", "HTZ oprema", "Burgije", "Drvene i metalne merdevine", "Šmirgle", "Folije", "Pištolji za farbanje", "Pištolji za pur pene", "Pištolji za silikone", "Šrafovska roba"),
  },
  {
    naziv: "Hidro i termo izolacija",
    akcent: "#ea8a1e",
    slika: "15307",
    brendovi: ["Sika", "TKK", "Austrotherm", "Tim Izolirka"],
    stavke: s("Kondori", "Poliazbitol", "Penetrati", "Aditivi za betone", "Stiropor", "Stirodur", "Mrežice", "Plastifikatori"),
  },
  {
    naziv: "Fasade",
    akcent: "#d4167c",
    slika: "6903",
    usluga: "Fasadne boje u više od 1000 nijansi",
    brendovi: ["Helios", "JUB", "Jumix sistem"],
    stavke: [
      ...s("Lepkovi", "Tiplovi"),
      { naziv: "Bavaliti", pod: ["Mineralni malteri", "Akrilni malteri"] },
      ...s("Fasadne boje", "Stiropor", "Stirodur", "Mrežice", "Fasadni glet", "Lajsne", "Kuliri"),
    ],
  },
  {
    naziv: "Silikoni, lepkovi, pur pene, trake",
    akcent: "#7cb518",
    slika: "14982",
    brendovi: ["Happy Color", "Moment", "Saratoga", "Henkel", "Bison", "Ceresit"],
    stavke: s("Sve vrste silikona", "Sve vrste pur pena", "Lepkovi za drvo", "Lepkovi za šoferšajbne", "Montaž i akrilni kitovi", "Super lepkovi", "Univerzalni lepkovi", "Dvokomponentni lepkovi", "Lepkovi za keramiku", "Krep trake", "Mat i selotejp trake", "Streč folije", "Trake za kade", "Diht trake"),
  },
  // Nije na flajeru, a postoji u prodavnici na farbara.org; naziv grupe je moj predlog
  {
    naziv: "Ostali program",
    akcent: "#38504c",
    slika: "13387",
    brendovi: [],
    stavke: s("Baštenski program", "Bravarski program", "Čistači", "Fug mase", "Građevina", "Kućni program", "Sprejevi", "Suva gradnja / gips", "Tapete"),
  },
];

// Adresa strane kategorije i vrednost filtera u adresi
export const uSlug = (t: string) =>
  t
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const linkArtikla = (id: number | string, naziv: string) => `/proizvod/${uSlug(naziv)}-${id}/`;

export const putanjaGrupe = (naziv: string) => `/kategorija/${uSlug(naziv)}/`;

export const kategorijeV2 = [
  { naziv: "Auto program", opis: "Metalik baza, 2K akril boja, kitevi, učvršćivači i polir paste na meru", id: "mobihel-2k" },
  { naziv: "Molerski materijal", opis: "Disperzije, glet mase, podloge i toniranje preko 5.000 nijansi", id: "9037" },
  { naziv: "Alati", opis: "Molerski, farbarski i baštenski alat, merdevine i HTZ oprema", id: "6395" },
  { naziv: "Hidro i termo izolacija", opis: "Kondori, poliazbitol, penetrati, stiropor, stirodur i mrežice", id: "15307" },
  { naziv: "Fasade", opis: "Lepkovi, bavaliti, kuliri i fasadne boje u više od 1000 nijansi", id: "6903" },
  { naziv: "Silikoni, lepkovi, pur pene, trake", opis: "Sve vrste silikona i pur pena, lepkovi, kitovi i trake", id: "14982" },
];

export const boje: Artikal[] = [
  { id: "9037", naziv: "Jupol Gold 15 l", cena: 4700, brend: "JUB" },
  { id: "7019", naziv: "Kemocel nitro emajl beli 0,75 l", cena: 710, brend: "Svjetlost" },
  { id: "6814", naziv: "Irkom Aqua emajl beli saten 700 ml", cena: 840, brend: "Irkom" },
  { id: "9023", naziv: "Zvezda nitro lak sjaj", cena: 650, brend: "Zvezda" },
  { id: "13371", naziv: "Maxima Aquamax beli saten 0,65 l", cena: 880, brend: "Maxima" },
  { id: "15286", naziv: "Sekolin emajl žuti Zvezda", cena: 500, brend: "Zvezda" },
  { id: "9026", naziv: "Zvezdapol 5 kg", cena: 400, brend: "Zvezda" },
  { id: "13372", naziv: "Maxima Aquamax radijator lak 0,65 l", cena: 880, brend: "Maxima" },
];

export const alati: Artikal[] = [
  { id: "6395", naziv: "Einhell aku bušilica TH-CD12Li", cena: 5200, brend: "Einhell" },
  { id: "8662", naziv: "Tesarski čekić 600 g Tolsen", cena: 1150, brend: "Tolsen" },
  { id: "6434", naziv: "Einhell ugaona brusilica TC-AG125", cena: 5400, brend: "Einhell" },
  { id: "6418", naziv: "Einhell perač pod pritiskom", cena: 9000, brend: "Einhell" },
  { id: "13387", naziv: "Odor-X eliminator 500 ml", cena: 1000, brend: "Turtle Wax" },
  { id: "6903", naziv: "JUB kontakt beton 25 kg", cena: 4500, brend: "JUB" },
];

// Marke iz artikla „Auto korektor" na farbara.org
export const markeVozila = [
  "Alfa Romeo", "Audi", "BMW", "Chevrolet", "Chrysler", "Citroen", "Dacia", "Daewoo", "Daihatsu", "Fiat",
  "Ford", "Honda", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Kia", "Lada", "Lancia", "Land Rover",
  "Lexus", "Mazda", "Mercedes", "Mitsubishi", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rover",
  "Saab", "Seat", "Škoda", "Smart", "Subaru", "Suzuki", "Toyota", "Volkswagen", "Volvo", "Zastava",
];

// boja = sloj preko belog auta, uzorak = kružić, sjaj = svetlo iza auta
export const bojeAuta = [
  { naziv: "Bela", boja: "#ffffff", uzorak: "#f6f7f8" },
  { naziv: "Crvena", boja: "#f0202c", uzorak: "#c8161f" },
  { naziv: "Plava", boja: "#2c6cf2", uzorak: "#1f4fbf" },
  { naziv: "Zelena", boja: "#1fae76", uzorak: "#14805a" },
  { naziv: "Narandžasta", boja: "#ff8412", uzorak: "#e96c10" },
  { naziv: "Grafit", boja: "#5c626c", uzorak: "#3d4149" },
];
