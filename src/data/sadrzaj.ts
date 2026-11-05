export const firma = {
  naziv: "Lisa Comerc d.o.o.",
  adresa: "XI krajiške divizije 62, Beograd",
  mobilni: "+381 62 11-31-773",
  fiksni: "+381 11 2322 856",
  pib: "100226301",
  maticni: "07562594",
  registracija: "BD 52323",
  delatnost: "52460",
  racun: "205-18334-85",
};

export const glavniMeni = [
  "Boje i lakovi",
  "Alat i pribor",
  "Građevinski materijal",
  "Auto-program",
  "Zaštitna oprema",
];

// Kategorije i podkategorije sa postojećeg sajta farbara.org
export const sveKategorije: { naziv: string; pod: string[] }[] = [
  { naziv: "Boje i lakovi", pod: ["Boje za beton", "Boje za drvo", "Boje za metal", "Boje za tkanine", "Boja za kožu", "Boja za radijatore", "Boja za školske table", "Industrijske boje", "Kit za drvo"] },
  { naziv: "Molerski materijal", pod: ["Akrilne, latex i perive boje", "Disperzione boje", "Poludisperzione boje", "Glet mase", "Ispune / gips", "Podloge", "Toneri", "Ostalo"] },
  { naziv: "Alati", pod: ["Akumulatorski", "Autofarbarski", "Baštenski", "Električni", "Merni", "Molerski", "Rezne ploče", "Ručni"] },
  { naziv: "Autoprogram", pod: ["Akrilne boje", "Brusni program", "Fileri", "Kitevi", "Lakovi", "Polir pasta", "Razređivači", "Sunđeri", "Utvrđivači", "Zaštita"] },
  { naziv: "Baštenski program", pod: ["Pištolji", "Prskalice", "Ručni alati", "Spojnice", "Strune za trimer"] },
  { naziv: "Bravarski program", pod: ["Brusni program", "Cilindri, brave i okovi", "Ekseri / žica", "Elektrode / žice", "Šrafovska roba"] },
  { naziv: "Čistači", pod: ["Čistač odvoda"] },
  { naziv: "Fasade", pod: ["Akrilni malteri", "Fasadni premazi", "Lepkovi", "Podloga", "Termoizolacija"] },
  { naziv: "Folije", pod: ["Streč folija"] },
  { naziv: "Fug mase", pod: [] },
  { naziv: "Građevina", pod: [] },
  { naziv: "Hidroizolacije", pod: ["Bitumenske izolacije", "Cementne izolacije", "Hidro trake"] },
  { naziv: "HTZ oprema", pod: ["Cipele", "Maske", "Naočare", "Obuća", "Odeća", "Odelo", "Pantalone", "Prsluk", "Rukavice", "Štitnici za kolena"] },
  { naziv: "Kućni program", pod: ["Antikondenz program", "Hemija", "Higijenski program", "Ostalo"] },
  { naziv: "Lajsne", pod: ["Keramičke", "Molerske lajsne", "Prelazne lajsne"] },
  { naziv: "Silikoni / Purpene", pod: ["Poliuretanski", "Purpene", "Silikoni"] },
  { naziv: "Sprejevi", pod: [] },
  { naziv: "Suva gradnja / gips", pod: ["Profili", "Trake", "Ostalo"] },
  { naziv: "Tapete", pod: ["Lepkovi za tapete"] },
  { naziv: "Trake", pod: ["Bandaž", "Duplex / dukt trake", "Krep / zaštitne trake", "Pak trake"] },
];

export const kategorije = [
  { naziv: "Boje i lakovi", slika: "/img/kategorije/boje-i-lakovi-foto.webp" },
  { naziv: "Molerski pribor", slika: "/img/kategorije/molerski-pribor-foto.webp" },
  { naziv: "Ručni alat", slika: "/img/kategorije/rucni-alat-foto.webp" },
  { naziv: "Auto-program", slika: "/img/kategorije/auto-program-foto.webp" },
  { naziv: "Bašta i zalivanje", slika: "/img/kategorije/basta-i-zalivanje-foto.webp" },
  { naziv: "Zaštitna oprema", slika: "/img/kategorije/zastitna-oprema-foto.webp" },
];

// Artikli iz predloga dizajna, još nisu vezani za katalog
export const izdvojeno = [
  { naziv: "Durlin emajl beli 0,75 l", brend: "Durlin", kategorija: "Boje za metal", slika: "/img/proizvodi/durlin-emajl-ai.webp" },
  { naziv: "Tolsen čekić 200 g", brend: "Tolsen", kategorija: "Ručni alati", slika: "/img/proizvodi/tolsen-cekic-ai.webp" },
  { naziv: "Beorol brusni disk P100", brend: "Beorol", kategorija: "Brusni program", slika: "/img/proizvodi/beorol-brusni-disk-ai.webp" },
  { naziv: "Einhell TH-DY 500 E", brend: "Einhell", kategorija: "Električni alati", slika: "/img/proizvodi/einhell-busilica-ai.webp" },
];

export const brendovi = [
  { naziv: "Maxima", slika: "/img/brendovi/maxima.svg", h: "h-6 lg:h-7" },
  { naziv: "JUB", slika: "/img/brendovi/jub.svg", h: "h-8 lg:h-9" },
  { naziv: "Zvezda", slika: "/img/brendovi/zvezda.svg", h: "h-7 lg:h-8" },
  { naziv: "Tolsen", slika: "/img/brendovi/tolsen.svg", h: "h-6 lg:h-7" },
  { naziv: "Beorol", slika: "/img/brendovi/beorol.svg", h: "h-9 lg:h-10" },
  { naziv: "Einhell", slika: "/img/brendovi/einhell.svg", h: "h-8 lg:h-9" },
];
