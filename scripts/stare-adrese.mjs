// Spisak preusmerenja sa adresa starog WordPress sajta na nove, da Google ne izgubi stare strane.
// Pokretanje: node scripts/stare-adrese.mjs  (upisuje src/data/stare-adrese.json, čita ga next.config.ts)
// Povlači samo spisak kategorija (oko 170), ne artikle. Artikli (/artikli/<slug>/) se rešavaju uživo, u app/artikli/[slug]/route.ts.
import fs from "node:fs";
import { MAPA } from "./mapa-kategorija.mjs";

const API = "https://www.farbara.org/wp-json/wc/store/v1/products/categories";

const uSlug = (t) =>
  t
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const grupa = (naziv, stavka) => `/kategorija/${uSlug(naziv)}/${stavka ? `?pod=${uSlug(stavka)}` : ""}`;

// Kategorija starog sajta -> grupa i stavka, po istoj mapi po kojoj je složen katalog
const poId = new Map();
for (const [g, stavke] of Object.entries(MAPA))
  for (const [s, izvori] of Object.entries(stavke))
    for (const i of izvori) if (i.c && !poId.has(i.c)) poId.set(i.c, grupa(g, s));

// Glavne kategorije starog sajta kojih nema u mapi
const GLAVNE = {
  alati: grupa("Alati"),
  autoprogram: grupa("Auto program"),
  "boje-i-lakovi": grupa("Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"),
  fasade: grupa("Fasade"),
  hidroiolacije: grupa("Hidro i termo izolacija"),
  "molerski-material": grupa("Molerski materijal"),
  "silikoni-purpene": grupa("Silikoni, lepkovi, pur pene, trake"),
  trake: grupa("Silikoni, lepkovi, pur pene, trake"),
  "htz-oprema": grupa("Alati", "HTZ oprema"),
  folije: grupa("Alati", "Folije"),
  lajsne: grupa("Fasade", "Lajsne"),
};

const kategorije = [];
for (let strana = 1; ; strana++) {
  const r = await fetch(`${API}?per_page=100&page=${strana}`, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`Kategorije: ${r.status}`);
  const deo = await r.json();
  kategorije.push(...deo);
  if (deo.length < 100) break;
}
const poIdStare = new Map(kategorije.map((k) => [k.id, k]));

const cilj = (k) => {
  for (let x = k; x; x = poIdStare.get(x.parent)) if (poId.has(x.id)) return poId.get(x.id);
  const glavna = new URL(k.permalink).pathname.split("/").filter(Boolean)[1];
  return GLAVNE[glavna] ?? grupa("Ostali program");
};

// Ostale strane starog sajta (WordPress / WooCommerce)
const strane = [
  ["/shop", "/"],
  ["/home-base", "/"],
  ["/portfolio", "/"],
  ["/cart", "/korpa/"],
  ["/checkout", "/porudzbina/"],
  ["/lista-omiljenih", "/sacuvani-proizvodi/"],
  ["/privacy-policy-2", "/politika-privatnosti/"],
  ["/custom-404", "/"],
  ["/custom-404-2", "/"],
  ["/moj-nalog/lost-password", "/zaboravljena-lozinka/"],
  ["/moj-nalog/orders", "/moj-nalog/#porudzbine"],
  ["/moj-nalog/edit-account", "/moj-nalog/#podaci"],
  ["/moj-nalog/edit-address", "/moj-nalog/#podaci"],
];

const spisak = [
  ...strane.map(([izvor, odrediste]) => ({ izvor, cilj: odrediste })),
  ...kategorije
    .map((k) => ({ izvor: new URL(k.permalink).pathname.replace(/\/$/, ""), cilj: cilj(k) }))
    // Ista adresa postoji i na novom sajtu (npr. /kategorija/alati): tu nema preusmerenja
    .filter((x) => x.izvor !== x.cilj.split("?")[0].replace(/\/$/, ""))
    .sort((a, b) => a.izvor.localeCompare(b.izvor)),
];

fs.writeFileSync(new URL("../src/data/stare-adrese.json", import.meta.url), JSON.stringify(spisak, null, 1) + "\n");
console.log(`${spisak.length} preusmerenja (${kategorije.length} kategorija sa starog sajta)`);
