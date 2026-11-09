// Proverava da svaka adresa iz sitemap-a starog sajta radi na novom sajtu, po pravilima iz docs/SEO-MIGRACIJA.md.
// Pokretanje (dok radi next dev ili next start):
//   node scripts/proveri-stare-adrese.mjs                      -> http://localhost:3000
//   node scripts/proveri-stare-adrese.mjs https://novi.example  -> bilo koja adresa novog sajta
//   dodaj --uzorak=20 da proveri samo prvih 20 proizvoda (brza provera)
// Spisak adresa: docs/seo/stari-sitemap.tsv (snimak starog sitemap-a, ne menja se).
// Neuspele adrese upisuje u docs/seo/provera-rezultat.tsv. Izlazni kod 1 ako ima grešaka.
import fs from "node:fs";

const argumenti = process.argv.slice(2);
const BAZA = (argumenti.find((a) => !a.startsWith("--")) ?? "http://localhost:3000").replace(/\/$/, "");
const UZORAK = Number(argumenti.find((a) => a.startsWith("--uzorak="))?.split("=")[1]) || Infinity;
const SAJT = "https://www.farbara.org";
const ISTOVREMENO = 6;

// Ove adrese moraju da ostanu iste (200, kanonski link = ta ista adresa, bez noindex)
const ISTE_STRANE = new Set(["/", "/o-nama/", "/kontakt/", "/dostava/", "/nacin-placanja/", "/pitanja-i-odgovori/"]);
// Ista adresa, ali privatna strana: dovoljno je 200 (noindex je tu namerno)
const SAMO_200 = new Set(["/moj-nalog/"]);
const mora200 = (putanja, tip) =>
  (tip === "proizvod" && putanja !== "/shop/") || tip === "kategorija-proizvoda" || (tip === "strana" && ISTE_STRANE.has(putanja));

const redovi = fs
  .readFileSync(new URL("../docs/seo/stari-sitemap.tsv", import.meta.url), "utf8")
  .split("\n")
  .filter((r) => r && !r.startsWith("#"))
  .map((r) => {
    const [putanja, tip] = r.split("\t");
    return { putanja, tip };
  })
  .filter((x, _, svi) => x.tip !== "proizvod" || svi.filter((y) => y.tip === "proizvod").indexOf(x) < UZORAK);

const kanonski = (html) => html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1] ?? html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/)?.[1];
const noindex = (html) => /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html);

async function proveri({ putanja, tip }) {
  const r = await fetch(BAZA + putanja, { redirect: "manual" }).catch((e) => ({ status: 0, greska: e.message }));
  if (!r.status) return `nema odgovora (${r.greska})`;

  if (SAMO_200.has(putanja)) return r.status === 200 ? null : `očekivano 200 na istoj adresi, dobijeno ${r.status}`;

  if (mora200(putanja, tip)) {
    if (r.status !== 200) return `očekivano 200 na istoj adresi, dobijeno ${r.status}${r.headers.get("location") ? ` -> ${r.headers.get("location")}` : ""}`;
    const html = await r.text();
    const k = kanonski(html);
    if (k !== SAJT + putanja) return `kanonski link ${k ?? "(nema)"} umesto ${SAJT + putanja}`;
    if (noindex(html)) return "strana ima noindex";
    return null;
  }

  // Sve ostalo: trajno preusmerenje u jednom skoku na stranu koja radi, ili 410 za uklonjeno
  if (r.status === 410) return null;
  if (r.status !== 301 && r.status !== 308) return `očekivano 301/308 ili 410, dobijeno ${r.status}`;
  const cilj = new URL(r.headers.get("location"), BAZA + putanja);
  const r2 = await fetch(BAZA + cilj.pathname + cilj.search, { redirect: "manual" }).catch(() => ({ status: 0 }));
  if (r2.status !== 200) return `preusmerenje na ${cilj.pathname}${cilj.search} koje vraća ${r2.status} (lanac ili greška)`;
  return null;
}

const greske = [];
let gotovo = 0;
const red = [...redovi];
await Promise.all(
  Array.from({ length: ISTOVREMENO }, async () => {
    while (red.length) {
      const x = red.shift();
      const g = await proveri(x);
      if (g) greske.push([x.putanja, x.tip, g]);
      if (++gotovo % 250 === 0) console.log(`${gotovo}/${redovi.length}, grešaka ${greske.length}`);
    }
  }),
);

const poTipu = {};
for (const [, tip] of greske) poTipu[tip] = (poTipu[tip] ?? 0) + 1;
fs.writeFileSync(new URL("../docs/seo/provera-rezultat.tsv", import.meta.url), ["# putanja\ttip\tproblem", ...greske.map((g) => g.join("\t"))].join("\n") + "\n");
console.log(`\nProvereno ${redovi.length} adresa na ${BAZA}. Grešaka: ${greske.length}`, poTipu);
for (const g of greske.slice(0, 15)) console.log("  ", g.join("  |  "));
process.exit(greske.length ? 1 : 0);
