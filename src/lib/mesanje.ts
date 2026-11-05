// Mešanje kao kod farbe, ne kao kod svetla: Kubelka-Munk po kanalu, pa plava i žuta daju zelenu.
export type Pigment = { id: string; naziv: string; hex: string; jacina: number };

export const PIGMENTI: Pigment[] = [
  { id: "bela", naziv: "Bela", hex: "#fbfaf6", jacina: 0.9 },
  { id: "zuta", naziv: "Žuta", hex: "#f9d500", jacina: 0.7 },
  { id: "oker", naziv: "Oker", hex: "#c8861a", jacina: 0.8 },
  { id: "crvena", naziv: "Crvena", hex: "#d6202c", jacina: 1 },
  { id: "magenta", naziv: "Magenta", hex: "#c4177c", jacina: 1 },
  { id: "plava", naziv: "Plava", hex: "#0052c7", jacina: 1 },
  { id: "zelena", naziv: "Zelena", hex: "#0c9455", jacina: 0.9 },
  { id: "crna", naziv: "Crna", hex: "#16171b", jacina: 1 },
];

const NAZIVI: [string, string][] = [
  ["Bela", "#f8f7f2"], ["Krem", "#f1e6c8"], ["Bež", "#d8c3a0"], ["Svetlosiva", "#c6c8ca"], ["Siva", "#8a8c8f"], ["Grafit", "#44464b"], ["Crna", "#17181b"],
  ["Limun žuta", "#f5e24a"], ["Žuta", "#f6c80c"], ["Zlatna", "#d9a521"], ["Oker", "#bf8a2a"], ["Karamel", "#a8692c"], ["Smeđa", "#6e4526"], ["Tamnosmeđa", "#3f2a1d"],
  ["Breskva", "#f6b98f"], ["Narandžasta", "#ec7a1a"], ["Terakota", "#b9502f"], ["Cigla", "#99392a"], ["Crvena", "#cf2230"], ["Vatrena", "#e2481c"], ["Koralna", "#e8666a"], ["Bordo", "#7a1a2b"],
  ["Puder roze", "#f1c3c6"], ["Roze", "#ea8ba4"], ["Malina", "#c5305f"], ["Fuksija", "#c21a7f"], ["Šljiva", "#6e2358"], ["Ljubičasta", "#5a2c8c"], ["Patlidžan", "#47304f"], ["Lavanda", "#b5a3d8"],
  ["Indigo", "#2f2f7f"], ["Teget", "#1a2a55"], ["Kraljevsko plava", "#1a4fb0"], ["Plava", "#2f78cf"], ["Nebo plava", "#9cc7e8"], ["Petrol", "#135a68"], ["Tirkizna", "#128f94"], ["Akva", "#7fd0c8"],
  ["Smaragdna", "#0f7f5a"], ["Zelena", "#2a8f3c"], ["Tamnozelena", "#1d4a30"], ["Mint", "#a8dfc0"], ["Travnata", "#6aa82d"], ["Limeta", "#b4cc2c"], ["Maslinasta", "#6f7128"], ["Kaki", "#8d8a5a"],
];

const uLin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const uSrgb = (v: number) => (v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055);

export const izHex = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
export const uHex = (c: number[]) => `#${c.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("")}`;

export type Delovi = Record<string, number>;

const PODIZANJE = 0.05;

export function pomesaj(delovi: Delovi): [number, number, number] {
  const sastav = PIGMENTI.filter((p) => (delovi[p.id] ?? 0) > 0);
  if (!sastav.length) return izHex(PIGMENTI[0].hex);
  const tezina = sastav.map((p) => delovi[p.id] * p.jacina);
  const ukupno = tezina.reduce((a, b) => a + b, 0);
  return [0, 1, 2].map((k) => {
    let ks = 0;
    sastav.forEach((p, i) => {
      // Podignuta refleksija: nijedan pigment ne guši kanal do kraja; čista boja ostaje ista
      const r = Math.min(0.995, PODIZANJE + (1 - PODIZANJE) * uLin(izHex(p.hex)[k]));
      ks += (tezina[i] / ukupno) * ((1 - r) ** 2 / (2 * r));
    });
    return uSrgb(Math.max(0, (1 + ks - Math.sqrt(ks * ks + 2 * ks) - PODIZANJE) / (1 - PODIZANJE)));
  }) as [number, number, number];
}

function uLab(c: number[]) {
  const [r, g, b] = c.map(uLin);
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.9505);
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.089);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

export function nazivNijanse(c: number[]) {
  const a = uLab(c);
  let najbliza = NAZIVI[0][0];
  let min = Infinity;
  for (const [ime, hex] of NAZIVI) {
    const b = uLab(izHex(hex));
    const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
    if (d < min) {
      min = d;
      najbliza = ime;
    }
  }
  return najbliza;
}

export const PRIMERI: Delovi[] = [
  { plava: 1, zelena: 1 },
  { plava: 1, zuta: 1 },
  { crvena: 1, zuta: 1 },
  { crvena: 1, plava: 1 },
  { crvena: 1, bela: 2 },
  { crna: 1, bela: 3 },
];
