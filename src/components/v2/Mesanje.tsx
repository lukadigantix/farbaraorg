"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Phone, RotateCcw } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { tel } from "@/data/v2";
import { izHex, nazivNijanse, PIGMENTI, pomesaj, PRIMERI, uHex, type Delovi } from "@/lib/mesanje";

const MAX_DELOVA = 12;
const hexPigmenta = (id: string) => izHex(PIGMENTI.find((p) => p.id === id)!.hex);

type Sim = {
  polje: Float32Array;
  sledece: Float32Array;
  N: number;
  cilj: number[];
  energija: number;
  vuci: [number, number, number, number];
  aktivno: boolean;
  vidljivo: boolean;
  raf: number;
  t: number;
  crtaj: () => void;
};

// Boja u kanti je polje koje se nosi kroz vrtlog: vidi se kako se pigmenti razvlače pre nego što se stope.
function napraviSim(platno: HTMLCanvasElement, N: number): Sim {
  const ctx = platno.getContext("2d")!;
  platno.width = N;
  platno.height = N;
  const slika = ctx.createImageData(N, N);
  const sim: Sim = {
    polje: new Float32Array(N * N * 3),
    sledece: new Float32Array(N * N * 3),
    N,
    cilj: [1, 1, 1],
    energija: 0,
    vuci: [0, 0, 0, 0],
    aktivno: false,
    vidljivo: false,
    raf: 0,
    t: 0,
    crtaj() {
      const d = slika.data;
      const p = sim.polje;
      for (let i = 0, j = 0; i < N * N; i++, j += 3) {
        d[i * 4] = p[j] * 255;
        d[i * 4 + 1] = p[j + 1] * 255;
        d[i * 4 + 2] = p[j + 2] * 255;
        d[i * 4 + 3] = 255;
      }
      ctx.putImageData(slika, 0, 0);
    },
  };
  return sim;
}

function korak(s: Sim, dt: number) {
  const { N, polje, sledece, cilj, energija: e, vuci } = s;
  s.t += dt * 0.016;
  const t = s.t;
  const okret = e * 0.05 * dt;
  const talas = e * 0.022 * dt;
  const k = Math.min(1, (0.004 + 0.03 * (1 - e) ** 2) * dt);
  const [px, py, vx0, vy0] = vuci;
  const imaVuce = Math.abs(vx0) + Math.abs(vy0) > 1e-4;
  let razlika = 0;
  for (let y = 0; y < N; y++) {
    const ny = ((y + 0.5) / N) * 2 - 1;
    for (let x = 0; x < N; x++) {
      const i = (y * N + x) * 3;
      const nx = ((x + 0.5) / N) * 2 - 1;
      let vx = -ny * okret + talas * Math.sin(3.4 * ny + t * 1.7) + talas * 0.6 * Math.sin(7.1 * ny - t);
      let vy = nx * okret + talas * Math.sin(2.9 * nx - t * 1.3) + talas * 0.6 * Math.sin(6.3 * nx + t * 0.8);
      if (imaVuce) {
        const dx = nx - px;
        const dy = ny - py;
        const w = Math.exp(-(dx * dx + dy * dy) / 0.07);
        vx += vx0 * w;
        vy += vy0 * w;
      }
      const sx = Math.min(N - 1.001, Math.max(0, ((nx - vx + 1) / 2) * N - 0.5));
      const sy = Math.min(N - 1.001, Math.max(0, ((ny - vy + 1) / 2) * N - 0.5));
      const x0 = sx | 0;
      const y0 = sy | 0;
      const fx = sx - x0;
      const fy = sy - y0;
      const a = (y0 * N + x0) * 3;
      const b = a + 3;
      const c = a + N * 3;
      const d = c + 3;
      for (let m = 0; m < 3; m++) {
        const v = (polje[a + m] * (1 - fx) + polje[b + m] * fx) * (1 - fy) + (polje[c + m] * (1 - fx) + polje[d + m] * fx) * fy;
        const n = v + (cilj[m] - v) * k;
        sledece[i + m] = n;
        const r = Math.abs(cilj[m] - n);
        if (r > razlika) razlika = r;
      }
    }
  }
  s.polje = sledece;
  s.sledece = polje;
  s.energija = e * 0.9955 ** dt;
  vuci[2] *= 0.82 ** dt;
  vuci[3] *= 0.82 ** dt;
  return razlika;
}

function pokreni(s: Sim) {
  if (s.aktivno) {
    if (!s.raf && s.vidljivo) petlja(s);
    return;
  }
  s.aktivno = true;
  if (s.vidljivo) petlja(s);
}

function petlja(s: Sim) {
  let pre = performance.now();
  const kadar = (sad: number) => {
    const dt = Math.min(2.5, (sad - pre) / 16.67);
    pre = sad;
    const razlika = korak(s, dt);
    s.crtaj();
    if (razlika < 0.006 && Math.abs(s.vuci[2]) + Math.abs(s.vuci[3]) < 1e-3) {
      s.polje.fill(0);
      for (let i = 0; i < s.polje.length; i += 3) s.polje.set(s.cilj, i);
      s.crtaj();
      s.aktivno = false;
      s.raf = 0;
      return;
    }
    s.raf = s.vidljivo ? requestAnimationFrame(kadar) : 0;
  };
  s.raf = requestAnimationFrame(kadar);
}

// Pigmenti kreću kao kriške u kanti, onda ih vrtlog meša
function ulijKriske(s: Sim, delovi: Delovi) {
  const sastav = Object.entries(delovi).filter(([, n]) => n > 0);
  const ukupno = sastav.reduce((z, [, n]) => z + n, 0);
  if (!ukupno) {
    for (let i = 0; i < s.polje.length; i += 3) s.polje.set(s.cilj, i);
    return;
  }
  const boje = sastav.map(([id]) => hexPigmenta(id));
  const granice: number[] = [];
  let zbir = 0;
  for (const [, n] of sastav) granice.push((zbir += n / ukupno));
  for (let y = 0; y < s.N; y++)
    for (let x = 0; x < s.N; x++) {
      const u = (Math.atan2(y - s.N / 2, x - s.N / 2) / (2 * Math.PI) + 1.25) % 1;
      s.polje.set(boje[Math.max(0, granice.findIndex((g) => u < g))], (y * s.N + x) * 3);
    }
}

function kapni(s: Sim, id: string) {
  const c = hexPigmenta(id);
  const ugao = Math.random() * Math.PI * 2;
  const rr = 0.25 + Math.random() * 0.35;
  const cx = Math.cos(ugao) * rr;
  const cy = Math.sin(ugao) * rr;
  const R = 0.3;
  for (let y = 0; y < s.N; y++) {
    const ny = ((y + 0.5) / s.N) * 2 - 1;
    for (let x = 0; x < s.N; x++) {
      const nx = ((x + 0.5) / s.N) * 2 - 1;
      const d = Math.hypot(nx - cx, ny - cy) / R;
      if (d >= 1) continue;
      const a = d < 0.82 ? 1 : (1 - d) / 0.18;
      const i = (y * s.N + x) * 3;
      for (let m = 0; m < 3; m++) s.polje[i + m] += (c[m] - s.polje[i + m]) * a;
    }
  }
}

export default function Mesanje() {
  const [delovi, setDelovi] = useState<Delovi>({});
  const sim = useRef<Sim | null>(null);
  const platno = useRef<HTMLCanvasElement>(null);
  const kanta = useRef<HTMLDivElement>(null);
  const poslednja = useRef<{ x: number; y: number } | null>(null);

  const rezultat = useMemo(() => pomesaj(delovi), [delovi]);
  const hex = uHex(rezultat);
  const izabrani = PIGMENTI.filter((p) => (delovi[p.id] ?? 0) > 0);
  const ukupno = izabrani.reduce((z, p) => z + delovi[p.id], 0);
  const naziv = ukupno ? nazivNijanse(rezultat) : "";
  const puno = ukupno >= MAX_DELOVA;
  const bezPokreta = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = platno.current;
    if (!el) return;
    const s = napraviSim(el, matchMedia("(max-width: 640px)").matches ? 140 : 200);
    sim.current = s;
    // Kanta uvek kreće puna bele boje
    s.cilj = pomesaj({});
    ulijKriske(s, {});
    s.crtaj();
    const io = new IntersectionObserver(([u]) => {
      s.vidljivo = u.isIntersecting;
      if (u.isIntersecting && s.aktivno && !s.raf) petlja(s);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      s.vidljivo = false;
    };
  }, []);

  // Nova mešavina menja cilj; pokret bira onaj ko je pozvao
  const primeni = (nov: Delovi, priprema: (s: Sim) => void) => {
    setDelovi(nov);
    const s = sim.current;
    if (!s) return;
    s.cilj = pomesaj(nov);
    if (bezPokreta()) {
      for (let i = 0; i < s.polje.length; i += 3) s.polje.set(s.cilj, i);
      s.crtaj();
      return;
    }
    priprema(s);
    s.crtaj();
    pokreni(s);
  };

  const dodaj = (id: string) => {
    if (ukupno >= MAX_DELOVA) return;
    primeni({ ...delovi, [id]: (delovi[id] ?? 0) + 1 }, (s) => {
      kapni(s, id);
      s.energija = Math.max(s.energija, 0.85);
    });
  };

  const oduzmi = (id: string) => {
    const n = { ...delovi, [id]: delovi[id] - 1 };
    if (n[id] <= 0) delete n[id];
    primeni(n, (s) => {
      s.energija = Math.max(s.energija, 0.45);
    });
  };

  const primer = (d: Delovi) =>
    primeni(d, (s) => {
      ulijKriske(s, d);
      s.energija = 1;
    });

  const iznova = () =>
    primeni({}, (s) => {
      s.energija = Math.max(s.energija, 0.3);
    });

  const mesaj = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sim.current;
    const r = kanta.current?.getBoundingClientRect();
    if (!s || !r) return;
    const x = ((e.clientX - r.left) / r.width) * 2 - 1;
    const y = ((e.clientY - r.top) / r.height) * 2 - 1;
    if (poslednja.current && e.buttons) {
      s.vuci = [x, y, (x - poslednja.current.x) * 1.1, (y - poslednja.current.y) * 1.1];
      s.energija = Math.max(s.energija, 0.12);
      pokreni(s);
    }
    poslednja.current = { x, y };
  };

  return (
    <section aria-label="Mešanje boja" className="relative mt-16 overflow-hidden transition-colors duration-1000" style={{ backgroundColor: `color-mix(in srgb, ${hex} 20%, white)` }}>
      <div className="v2-omot grid gap-x-12 gap-y-7 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] lg:grid-rows-[auto_1fr] lg:py-20 xl:gap-x-20">
        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
          <p className="v2-nad">Toniranje preko 5.000 nijansi</p>
          <h2 className="mt-3 text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.03] font-[550] tracking-[-0.035em]">Pomešajte svoju nijansu</h2>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[440px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[600px] lg:self-center lg:pb-10">
          <div
            ref={kanta}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              poslednja.current = null;
            }}
            onPointerMove={mesaj}
            className="relative mx-auto aspect-square w-[min(100%,560px)] cursor-grab touch-pan-y rounded-full shadow-[0_40px_70px_-30px_rgba(20,24,33,.7)] select-none active:cursor-grabbing"
            style={{ background: "conic-gradient(from 210deg,#f5f6f7,#a8adb3,#eceef0,#8e939a,#fafafa,#9fa4aa,#e4e6e8,#a9aeb4,#f5f6f7)" }}
          >
            <div className="absolute inset-[3.2%] overflow-hidden rounded-full bg-[#8e939a]">
              <canvas ref={platno} aria-label={`Boja u kanti: ${naziv || "prazno"}`} role="img" className="absolute inset-[1%] h-[98%] w-[98%] rounded-full" />
              <span aria-hidden className="pointer-events-none absolute inset-[1%] rounded-full shadow-[inset_0_14px_30px_rgba(0,0,0,.42),inset_0_-6px_18px_rgba(255,255,255,.14)]" />
              <span aria-hidden className="pointer-events-none absolute inset-[1%] rounded-full bg-[radial-gradient(ellipse_46%_30%_at_32%_22%,rgba(255,255,255,.42),transparent_70%)]" />
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:col-start-1 lg:row-start-2">
          <div className="rounded-[28px] bg-white p-4 shadow-[0_30px_60px_-34px_rgba(20,24,33,.45)] sm:p-6">
            <div className="flex flex-col gap-x-4 gap-y-3 sm:flex-row sm:items-start" aria-live="polite">
              <div className="min-w-0 flex-1">
                <div className="flex h-14 gap-0.5 overflow-hidden rounded-2xl bg-sivka">
                  {izabrani.map((p) => (
                    <span key={p.id} className={`min-w-0 transition-[flex-grow] duration-500 ${p.id === "bela" ? "shadow-[inset_0_0_0_1px_#e3e6e6]" : ""}`} style={{ flexGrow: delovi[p.id], flexBasis: 0, backgroundColor: p.hex }} />
                  ))}
                </div>
                <p className="mt-2 text-[14px] leading-snug text-sivi-2">
                  {izabrani.length ? izabrani.map((p) => `${p.naziv} ${delovi[p.id]}`).join(" + ") : "Izaberite boje ispod"}
                </p>
              </div>
              {(
                <div className={`flex shrink-0 items-center gap-3 sm:max-w-[46%] ${izabrani.length ? "" : "max-sm:invisible sm:hidden"}`}>
                  <span aria-hidden className="text-[26px] leading-none font-light text-tinta/40">=</span>
                  <span className="size-14 shrink-0 rounded-2xl transition-colors duration-700" style={{ backgroundColor: hex }} />
                  <span className="min-w-0 text-[clamp(1.25rem,2vw,1.625rem)] leading-[1.1] font-[550] tracking-[-0.02em]">{naziv || "\u00a0"}</span>
                </div>
              )}
            </div>

            <ul className="mt-4 grid grid-cols-4 gap-1.5 sm:gap-2 xl:grid-cols-8">
              {PIGMENTI.map((p) => {
                const n = delovi[p.id] ?? 0;
                const svetla = p.id === "bela" || p.id === "zuta";
                return (
                  <li key={p.id} className="relative min-w-0">
                    <button
                      type="button"
                      aria-label={`Dodaj: ${p.naziv}`}
                      aria-disabled={puno}
                      onClick={() => dodaj(p.id)}
                      className="group block w-full overflow-hidden rounded-xl text-left shadow-[0_0_0_1px_#e8ebed] transition-shadow hover:shadow-[0_0_0_1px_var(--color-tinta)]"
                    >
                      <span className={`grid h-[60px] place-items-center text-[22px] font-medium ${svetla ? "text-tinta" : "text-white"} ${p.id === "bela" ? "border-b border-sivka" : ""}`} style={{ backgroundColor: p.hex }}>
                        {n > 0 ? n : ""}
                      </span>
                      <span className="block truncate px-0.5 py-1.5 text-center text-[12px] leading-tight">{p.naziv}</span>
                    </button>
                    {n > 0 && (
                      <button type="button" aria-label={`Ukloni deo: ${p.naziv}`} onClick={() => oduzmi(p.id)} className={`absolute top-0.5 right-0.5 grid size-5 place-items-center rounded-full transition-colors ${svetla ? "bg-black/10 text-tinta hover:bg-black/20" : "bg-white/25 text-white hover:bg-white/40"}`}>
                        <Minus aria-hidden className="size-2.5" strokeWidth={3} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
            {puno && <p className="mt-2.5 text-[13px] text-sivi-2">Najviše {MAX_DELOVA} delova u kanti.</p>}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PRIMERI.map((d) => {
              const k = Object.keys(d);
              const imena = k.map((id) => PIGMENTI.find((p) => p.id === id)!.naziv);
              const aktivan = izabrani.length === k.length && k.every((id) => delovi[id] === d[id]);
              return (
                <button
                  key={k.join() + Object.values(d).join()}
                  type="button"
                  aria-pressed={aktivan}
                  aria-label={`Primer: ${imena.join(" i ")}`}
                  onClick={() => primer(d)}
                  className={`flex min-h-12 min-w-0 items-center gap-2 rounded-2xl px-2.5 py-1.5 text-left transition-colors ${aktivan ? "bg-ugalj text-white" : "bg-white/60 hover:bg-white"}`}
                >
                  <span className="flex shrink-0">
                    {k.map((id, i) => (
                      <span key={id} className={`size-5 rounded-full ring-2 ${aktivan ? "ring-ugalj" : "ring-white"} ${i ? "-ml-1.5" : ""}`} style={{ backgroundColor: PIGMENTI.find((p) => p.id === id)!.hex }} />
                    ))}
                  </span>
                  <span className="min-w-0 flex-1 text-[13px] leading-tight">{imena.join(" + ")}</span>
                </button>
              );
            })}
          </div>
          <button type="button" onClick={iznova} inert={ukupno === 0} className={`mt-3 flex h-9 items-center gap-1.5 text-[14px] text-tinta/75 transition-colors hover:text-tinta ${ukupno ? "" : "invisible"}`}>
            <RotateCcw aria-hidden className="size-3.5" />
            Iznova
          </button>
        </div>

        <div className="relative z-10 overflow-hidden rounded-[20px] bg-white shadow-[0_34px_60px_-26px_rgba(20,24,33,.6)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-[205px] lg:-rotate-2 xl:w-[250px] lg:self-end lg:justify-self-end">
          <div className="h-20 border-b border-sivka transition-colors duration-700 lg:h-14 xl:h-24" style={{ backgroundColor: hex }} />
          <div className="p-4">
            <p className="text-[12px] font-medium tracking-[0.1em] text-sivi-2 uppercase">Vaša nijansa</p>
            <p className="mt-1 text-[26px] leading-tight font-[550] tracking-[-0.02em]">{naziv || "Izaberite boje"}</p>
            
            <a href={tel(firma.fiksni)} className="mt-3.5 flex h-11 items-center justify-center gap-2 rounded-full bg-narandza text-[14px] font-medium text-white transition-colors hover:bg-narandza-tamna">
              <Phone aria-hidden className="size-4" />
              Tonirajte u radnji
            </a>
            <p className="mt-2 text-center text-[12px] leading-tight font-light text-sivi-2">Na ekranu je nijansa približna.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
