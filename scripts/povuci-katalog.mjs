// Povlači uzorak kataloga sa farbara.org: najviše 12 artikala po podkategoriji, NE ceo katalog.
// Pokretanje: node scripts/povuci-katalog.mjs  (upisuje src/data/katalog.json)
import fs from "node:fs";
import sharp from "sharp";
import { bezKvacica, mapiraj } from "../src/lib/obrada.mjs";
import { MAPA } from "./mapa-kategorija.mjs";

const MAX = 12;
const API = "https://www.farbara.org/wp-json/wc/store/v1/products";


const pauza = (ms) => new Promise((r) => setTimeout(r, ms));
let zahteva = 0;

async function povuci(izvor) {
  const url = izvor.c ? `${API}?per_page=${MAX + 6}&category=${izvor.c}` : `${API}?per_page=${MAX + 12}&search=${encodeURIComponent(izvor.q)}`;
  zahteva++;
  await pauza(120);
  const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const artikli = await r.json();
  if (!izvor.q) return artikli;
  const re = izvor.ceo ? new RegExp(`\\b${izvor.q}\\b`) : null;
  return artikli.filter((a) => {
    const ime = bezKvacica(a.name);
    if (izvor.ne && ime.includes(izvor.ne)) return false;
    return re ? re.test(ime) : ime.includes(izvor.q);
  });
}

const proizvodi = new Map();
function dodaj(a, grupa, stavka) {
  const kljuc = `${grupa}|${a.id}`;
  if (!proizvodi.has(kljuc)) {
    const m = mapiraj(a);
    proizvodi.set(kljuc, { ...m, grupa, stavke: [], sličica: m.lokalna ? null : a.images[0]?.thumbnail || a.images[0]?.src });
  }
  const p = proizvodi.get(kljuc);
  if (stavka && !p.stavke.includes(stavka)) p.stavke.push(stavka);
}
const izvestaj = {};
const kes = new Map();

for (const [grupa, stavke] of Object.entries(MAPA)) {
  for (const [stavka, izvori] of Object.entries(stavke)) {
    const nadjeni = new Map();
    for (const izvor of izvori) {
      if (nadjeni.size >= MAX) break;
      const kljuc = JSON.stringify(izvor);
      if (!kes.has(kljuc)) kes.set(kljuc, await povuci(izvor));
      for (const a of kes.get(kljuc)) {
        if (nadjeni.size >= MAX) break;
        const cena = Math.round(Number(a.prices.price) / 10 ** a.prices.currency_minor_unit);
        // Cena od 1 RSD je oznaka „nema cene" u staroj bazi; vijak od 2 RSD je prava cena
        if (!a.images?.[0]?.src || !(cena >= 2)) continue;
        nadjeni.set(a.id, { a, cena });
      }
    }
    izvestaj[`${grupa} > ${stavka}`] = nadjeni.size;
    for (const { a, cena } of nadjeni.values()) {
      dodaj(a, grupa, stavka);
    }
  }
}

// Artikli koje početna strana i auto sekcija direktno pominju moraju imati svoju stranu
const IZDVOJENI = [
  [9037, "Molerski materijal", "Disperzije"], [7019, "Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"], [6814, "Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"],
  [9023, "Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"], [13371, "Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"], [15286, "Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"],
  [9026, "Molerski materijal", "Disperzije"], [13372, "Molerski materijal", "Boje, lakovi i zaštitni premazi za drvo i metal"], [6395, "Alati"], [8662, "Alati"], [6434, "Alati"], [6418, "Alati"],
  [13387, "Ostali program", "Kućni program"], [6903, "Fasade"], [14973, "Auto program", "Metalik baza"], [14959, "Auto program", "Boje i lakovi"], [5300, "Auto program", "Boje i lakovi"],
];
for (const [id, grupa, stavka] of IZDVOJENI) {
  zahteva++;
  await pauza(120);
  const r = await fetch(`${API}/${id}`, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!r.ok) throw new Error(`${r.status} artikal ${id}`);
  dodaj(await r.json(), grupa, stavka);
}

// Fotografije na tamnoj ili šarenoj podlozi idu preko cele ploče; bele se stapaju sa njom
const podloga = new Map();
async function izmeri(url) {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(20000) });
    const { data, info } = await sharp(Buffer.from(await r.arrayBuffer())).resize(48, 48, { fit: "fill" }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let ivica = 0;
    let svetlih = 0;
    for (let y = 0; y < 48; y++)
      for (let x = 0; x < 48; x++) {
        if (x > 2 && x < 45 && y > 2 && y < 45) continue;
        const i = (y * 48 + x) * info.channels;
        ivica++;
        if (data[i + 3] < 40 || Math.min(data[i], data[i + 1], data[i + 2]) > 232) svetlih++;
      }
    return svetlih / ivica < 0.72;
  } catch {
    return false;
  }
}
const adrese = [...new Set([...proizvodi.values()].map((p) => p.sličica).filter(Boolean))];
for (let i = 0; i < adrese.length; i += 6) {
  await Promise.all(adrese.slice(i, i + 6).map(async (u) => podloga.set(u, await izmeri(u))));
  await pauza(80);
}
for (const p of proizvodi.values()) {
  if (podloga.get(p.sličica)) p.puna = true;
  delete p.sličica;
  delete p.lokalna;
}

const lista = [...proizvodi.values()];
fs.writeFileSync(new URL("../src/data/katalog.json", import.meta.url), JSON.stringify(lista));
console.log("zahteva", zahteva, "artikala", lista.length, "razlicitih", new Set(lista.map((p) => p.id)).size);
console.log(Object.entries(izvestaj).map(([k, v]) => `${String(v).padStart(2)}  ${k}`).join("\n"));
