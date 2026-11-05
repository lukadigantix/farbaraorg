// Obrada artikala iz stare prodavnice; koriste je skripta za katalog i server (pretraga, chat, strana proizvoda).
const BRENDOVI = [
  ["Mobihel", /mobihel/], ["Mipa", /\bmipa\b/], ["Novol", /novol|novakryl/], ["4CR", /\b4cr\b/], ["Gravi Hel", /gravi ?hel/], ["HB Body", /\bbody\b/],
  ["Heliomix", /heliomix/], ["Helios", /helios/], ["Kraft", /\bkraft\b/], ["Irkom", /irkom/], ["Maxima", /maxima|maxipol|maxidis/], ["JUB", /\bjub\b|jupol/],
  ["Zvezda", /zvezda|zvezdapol|sekolin/], ["Svjetlost", /svjetlost|kemocel/], ["Beorol", /beorol/], ["Fischer", /fischer/], ["Schuller", /schul+er/],
  ["Smirdex", /smirdex/], ["Tolsen", /tolsen/], ["Einhell", /einhell/], ["Sika", /\bsika/], ["TKK", /\btkk\b/], ["Austrotherm", /austrotherm/], ["Izolirka", /izolirka/],
  ["Happy Color", /happy ?color/], ["Moment", /\bmoment\b/], ["Saratoga", /saratoga/], ["Henkel", /henkel/], ["Bison", /bison/], ["Ceresit", /ceresit/],
  ["Masters", /masters/], ["Dupli Color", /dupli|\bdll\b/], ["Hardy", /hardy/], ["WD-40", /wd[- ]?40/], ["3M", /\b3 ?m\b/], ["Albo", /\balbo\b/], ["Duga", /\bduga\b/], ["Er-Lac", /er-?lac/], ["Hemmax", /hemmax/], ["Beohemik", /beohemik/], ["Sparta", /sparta/], ["Protech", /protech/], ["Villiger", /villiger/], ["Praktika", /praktika/], ["Maxwork", /maxwork/], ["MaxWerk", /maxwerk/], ["Rigips", /rigips/], ["Q Refinish", /q refinish/], ["Tesa", /\btesa\b/], ["Biokolor", /biokolor/], ["Agrodil", /agrodil/],
];

const VELIKA = new Set(["3m", "hs", "uhs", "ms", "uv", "pu", "pvc", "htz", "dll", "pe", "ps", "abs", "led", "sds", "mig", "wd-40", "jub", "tkk", "4cr", "cc8"]);
const KVACICE = { cekic: "čekić", srafciger: "šrafciger", cetka: "četka", cetkica: "četkica", razredjivac: "razređivač", ucvrscivac: "učvršćivač", utvrdjivac: "utvrđivač", smirgla: "šmirgla", sundjer: "sunđer", zica: "žica", pistolj: "pištolj", pistolji: "pištolji", pistoljska: "pištoljska", strec: "streč", stitnik: "štitnik", stitnici: "štitnici", celik: "čelik", celicna: "čelična", naocare: "naočare", skidac: "skidač", cistac: "čistač", rucni: "ručni", rucna: "ručna", tecni: "tečni", tecna: "tečna", zuti: "žuti", zuta: "žuta", kec: "keč", zastita: "zaštita", zastitna: "zaštitna", zastitne: "zaštitne", zastitni: "zaštitni", drzalja: "držalja", busilica: "bušilica", masinski: "mašinski", masinska: "mašinska", slajferica: "šlajferica", perac: "perač", usisivac: "usisivač", vruce: "vruće", mrezica: "mrežica", mreza: "mreža", strugac: "strugač", dugacki: "dugački", povrsine: "površine", spakla: "špakla", spaklica: "špaklica", cetvrtasta: "četvrtasta", resetke: "rešetke", smirgle: "šmirgle", tacna: "tacna", masina: "mašina", nozic: "nožić", noz: "nož", hemijska: "hemijska", kuciste: "kućište", plasticni: "plastični", plasticna: "plastična", mesac: "mešač", cetke: "četke", krec: "kreč", kreč: "kreč", sofersajbna: "šoferšajbna", kozna: "kožna", kozne: "kožne", zaptivna: "zaptivna", brusilica: "brusilica", srafovi: "šrafovi", sraf: "šraf", resetka: "rešetka", spric: "špric", sredstvo: "sredstvo", sirina: "širina", visina: "visina", duzina: "dužina", zelena: "zelena", cistog: "čistog", ciste: "čiste" };
const LEPO = Object.fromEntries(BRENDOVI.map(([b]) => [b.toLowerCase(), b]));

export function lepNaziv(naziv) {
  const t = naziv
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b3 ?m\b/g, "3m")
    .replace(/(\d)\s*(lit|kg|gr|ml|mm|cm|m|l|g)\b\.?/g, (x, a, b) => (a === "3" && b === "m" ? "3m" : `${a} ${b}`))
    .replace(/\blit\b/g, "l")
    .replace(/\bgr\b/g, "g");
  const reci = t.split(" ").map((r) => {
    if (LEPO[r]) return LEPO[r];
    if (VELIKA.has(r)) return r.toUpperCase();
    if (KVACICE[r]) return KVACICE[r];
    if (/^[a-z]{1,4}-?\d/.test(r) || /^\d+[a-z]{1,2}$/.test(r)) return r.toUpperCase().replace(/^(\d+)(L|G|KG|ML|MM|CM|M)$/, (_, a, b) => a + b.toLowerCase());
    return r;
  });
  const s = reci.join(" ");
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const bezKvacica = (t) => t.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "dj");

// Artikli za koje imamo oštriju sliku bez pozadine
const LOKALNE = new Map(
  ["9037", "7019", "6814", "9023", "13371", "15286", "9026", "13372", "6395", "8662", "6434", "6418", "13387", "6903", "15307", "14982", "14959"].map((id) => [Number(id), `/img/v2/proizvodi/${id}.webp`]),
);
LOKALNE.set(14973, "/img/v2/proizvodi/mobihel-2k.webp");
LOKALNE.set(5300, "/img/v2/proizvodi/auto-korektor.webp");

const ENTITETI = { nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "-", mdash: "-", hellip: "...", scaron: "š", Scaron: "Š", zcaron: "ž", Zcaron: "Ž", ccaron: "č", Ccaron: "Č", cacute: "ć", Cacute: "Ć", dstrok: "đ", Dstrok: "Đ", deg: "°", sup2: "²", times: "x" };

export function uTekst(html = "") {
  return String(html)
    .replace(/<\/(p|li|div|h\d|tr)>|<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-zA-Z0-9]+);/g, (x, n) => ENTITETI[n] ?? x)
    .replace(/[\u2013\u2014]/g, "-")
    .split("\n")
    .map((r) => r.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

export function mapiraj(a) {
  const ime = bezKvacica(a.name);
  const atributi = (a.attributes ?? []).filter((x) => x.terms?.length);
  const originali = (a.images ?? []).map((i) => i.src);
  const lokalna = LOKALNE.get(a.id);
  return {
    id: a.id,
    naziv: lepNaziv(uTekst(a.name)),
    sifra: a.sku || "",
    cena: Math.round(Number(a.prices.price) / 10 ** a.prices.currency_minor_unit),
    slike: (lokalna ? [lokalna, ...originali.slice(1)] : originali).slice(0, 5),
    lokalna: !!lokalna,
    ...(a.id === 5300 ? { puna: true } : {}),
    opis: uTekst(a.description || a.short_description).slice(0, 1400),
    brend: /** @type {string} */ (BRENDOVI.find(([, re]) => re.test(ime))?.[0] ?? ""),
    opcije: a.type === "variable" ? atributi.map((x) => ({ naziv: uTekst(x.name), vrednosti: x.terms.map((t) => uTekst(t.name)) })) : [],
    osobine: a.type === "variable" ? [] : atributi.map((x) => ({ naziv: uTekst(x.name), vrednost: x.terms.map((t) => uTekst(t.name)).join(", ") })),
  };
}
