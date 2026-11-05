"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowDownUp, Check, ChevronDown, Phone, Search, SlidersHorizontal, X } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { cena as rsd, tel, uSlug, type StavkaGrupe } from "@/data/v2";
import ProizvodKartica from "../ProizvodKartica";

type Artikal = { id: number; naziv: string; sifra: string; cena: number; slika: string; brend: string; stavke: string[]; puna?: boolean; izbor?: boolean };
type Sort = "preporuka" | "jeftinije" | "skuplje" | "naziv";

const SORT: { v: Sort; t: string }[] = [
  { v: "preporuka", t: "Preporučeno" },
  { v: "jeftinije", t: "Cena: od najniže" },
  { v: "skuplje", t: "Cena: od najviše" },
  { v: "naziv", t: "Naziv: A-Š" },
];
const PO_STRANI = 24;
const BREND_LISTA = 8;
const abeceda = new Intl.Collator("sr");
const bezKvacica = (t: string) => t.toLowerCase().replace(/đ/g, "dj").normalize("NFD").replace(/\p{M}/gu, "");
const oblikCene = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export default function Katalog({ artikli, stavke, akcent, nazivGrupe }: { artikli: Artikal[]; stavke: StavkaGrupe[]; akcent: string; nazivGrupe: string }) {
  const [pod, setPod] = useState("");
  const [brendovi, setBrendovi] = useState<string[]>([]);
  const [opseg, setOpseg] = useState<[number, number] | null>(null);
  const [sort, setSort] = useState<Sort>("preporuka");
  const [pojam, setPojam] = useState("");
  const [vidljivo, setVidljivo] = useState(PO_STRANI);
  const [sheet, setSheet] = useState(false);
  const rezultati = useRef<HTMLDivElement>(null);
  const spremno = useRef(false);

  const [cenaMin, cenaMax] = useMemo(() => {
    const c = artikli.map((a) => a.cena);
    return [Math.min(...c), Math.max(...c)];
  }, [artikli]);

  // Filteri se čitaju iz adrese posle učitavanja, da se link može poslati ili vratiti unazad
  useEffect(() => {
    const u = new URLSearchParams(location.search);
    /* eslint-disable react-hooks/set-state-in-effect */
    setPod(u.get("pod") ?? "");
    setBrendovi(u.get("brend")?.split(",").filter(Boolean) ?? []);
    const od = Number(u.get("od"));
    const dokle = Number(u.get("do"));
    if (od || dokle) setOpseg([od || cenaMin, dokle || cenaMax]);
    const s = u.get("sort") as Sort | null;
    if (s && SORT.some((x) => x.v === s)) setSort(s);
    setPojam(u.get("q") ?? "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [cenaMin, cenaMax]);

  const potpis = JSON.stringify([pod, brendovi, opseg, sort, pojam]);

  useEffect(() => {
    if (!spremno.current) {
      spremno.current = true;
      return;
    }
    const u = new URLSearchParams();
    if (pod) u.set("pod", pod);
    if (brendovi.length) u.set("brend", brendovi.join(","));
    if (opseg) {
      u.set("od", String(opseg[0]));
      u.set("do", String(opseg[1]));
    }
    if (sort !== "preporuka") u.set("sort", sort);
    if (pojam) u.set("q", pojam);
    const q = u.toString();
    history.replaceState(history.state, "", q ? `${location.pathname}?${q}` : location.pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- nova lista kreće od početka
    setVidljivo(PO_STRANI);
    const r = rezultati.current;
    if (r && r.getBoundingClientRect().top < 0) r.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potpis]);

  const uStavci = (a: Artikal, slug: string) => {
    for (const st of stavke) {
      const deca = st.pod ?? [];
      if (uSlug(st.naziv) === slug) return a.stavke.includes(st.naziv) || deca.some((d) => a.stavke.includes(d));
      const dete = deca.find((d) => uSlug(d) === slug);
      if (dete) return a.stavke.includes(dete);
    }
    return false;
  };

  const trazeno = bezKvacica(pojam.trim());
  // Broj kod svakog filtera računa se sa svim ostalim filterima, bez njega samog
  const prolazi = (a: Artikal, bez: "pod" | "brend" | "") =>
    (bez === "pod" || !pod || uStavci(a, pod)) &&
    (bez === "brend" || !brendovi.length || brendovi.includes(a.brend)) &&
    (!opseg || (a.cena >= opseg[0] && a.cena <= opseg[1])) &&
    (!trazeno || bezKvacica(`${a.naziv} ${a.sifra} ${a.brend}`).includes(trazeno));

  const lista = useMemo(() => {
    const l = artikli.filter((a) => prolazi(a, ""));
    if (sort === "jeftinije") l.sort((a, b) => a.cena - b.cena);
    else if (sort === "skuplje") l.sort((a, b) => b.cena - a.cena);
    else if (sort === "naziv") l.sort((a, b) => abeceda.compare(a.naziv, b.naziv));
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artikli, potpis]);

  const brojPod = (slug: string) => artikli.filter((a) => prolazi(a, "pod") && uStavci(a, slug)).length;
  const sviZaPod = artikli.filter((a) => prolazi(a, "pod")).length;

  // Redosled je stalan, da se checkbox ne pomera dok kupac klikće
  const redBrendova = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of artikli) if (a.brend) m.set(a.brend, (m.get(a.brend) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || abeceda.compare(a[0], b[0])).map(([b]) => b);
  }, [artikli]);

  const brojBrend = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of artikli) if (a.brend && prolazi(a, "brend")) m.set(a.brend, (m.get(a.brend) ?? 0) + 1);
    return redBrendova.flatMap((b): [string, number][] => (m.has(b) || brendovi.includes(b) ? [[b, m.get(b) ?? 0]] : []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redBrendova, artikli, potpis]);

  const aktivnaGlavna = stavke.find((s) => uSlug(s.naziv) === pod || s.pod?.some((d) => uSlug(d) === pod));
  const prekidacBrenda = (b: string) => setBrendovi((x) => (x.includes(b) ? x.filter((y) => y !== b) : [...x, b]));
  const obrisi = () => {
    setPod("");
    setBrendovi([]);
    setOpseg(null);
    setPojam("");
  };

  const nazivPod = stavke.flatMap((s) => [s.naziv, ...(s.pod ?? [])]).find((n) => uSlug(n) === pod);
  const brojFiltera = brendovi.length + (opseg ? 1 : 0);
  const imaFiltera = brojFiltera > 0 || !!pod || !!trazeno;

  const paneli = (
    <>
      <Odeljak naslov="Cena">
        <KlizacCene min={cenaMin} max={cenaMax} opseg={opseg} akcent={akcent} promeni={setOpseg} />
      </Odeljak>
      {brojBrend.length > 0 && (
        <Odeljak naslov="Brend">
          <ListaBrendova brojevi={brojBrend} izabrani={brendovi} prekidac={prekidacBrenda} />
        </Odeljak>
      )}
    </>
  );

  return (
    <div className="v2-omot pt-6 lg:pt-8">
      {/* Glavni filter: šta kupac traži */}
      <div className="top-[112px] z-30 -mx-4 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:hidden [@media(min-height:700px)]:sticky">
        <div className="v2-karusel -mx-4 flex gap-2 overflow-x-auto px-4 sm:-mx-8 sm:px-8" role="group" aria-label="Podkategorije">
          <Cip aktivan={!pod} broj={sviZaPod} akcent={akcent} klik={() => setPod("")}>Sve</Cip>
          {stavke.map((s) => {
            const slug = uSlug(s.naziv);
            const n = brojPod(slug);
            if (n === 0 && !artikli.some((a) => uStavci(a, slug))) return null;
            return (
              <Cip key={slug} aktivan={aktivnaGlavna === s} broj={n} akcent={akcent} klik={() => setPod(pod === slug ? "" : slug)}>
                {s.naziv}
              </Cip>
            );
          })}
        </div>
        {aktivnaGlavna?.pod && (
          <div className="v2-chat-ulaz v2-karusel -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 sm:-mx-8 sm:px-8">
            {aktivnaGlavna.pod.map((d) => {
              const slug = uSlug(d);
              return (
                <Cip key={slug} manji aktivan={pod === slug} broj={brojPod(slug)} akcent={akcent} klik={() => setPod(pod === slug ? uSlug(aktivnaGlavna.naziv) : slug)}>
                  {d}
                </Cip>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid scroll-mt-[190px] gap-8 lg:scroll-mt-[80px] lg:grid-cols-[264px_minmax(0,1fr)] lg:pt-2 xl:gap-10" ref={rezultati}>
        <aside className="hidden lg:block" aria-label="Filteri">
          <div className="v2-karusel sticky top-[88px] max-h-[calc(100dvh-104px)] space-y-7 overflow-x-hidden overflow-y-auto overscroll-contain px-2 pb-4 -ml-2">
            <Odeljak naslov="Kategorija">
              <ul className="space-y-0.5">
                <RedKategorije aktivan={!pod} broj={sviZaPod} akcent={akcent} klik={() => setPod("")}>Sve</RedKategorije>
                {stavke.map((st) => {
                  const slug = uSlug(st.naziv);
                  if (brojPod(slug) === 0 && !artikli.some((a) => uStavci(a, slug))) return null;
                  return (
                    <li key={slug}>
                      <ul>
                        <RedKategorije aktivan={pod === slug} broj={brojPod(slug)} akcent={akcent} klik={() => setPod(pod === slug ? "" : slug)}>{st.naziv}</RedKategorije>
                        {aktivnaGlavna === st &&
                          st.pod?.map((d) => (
                            <RedKategorije key={d} uvuceno aktivan={pod === uSlug(d)} broj={brojPod(uSlug(d))} akcent={akcent} klik={() => setPod(pod === uSlug(d) ? slug : uSlug(d))}>{d}</RedKategorije>
                          ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </Odeljak>
            {paneli}
          </div>
        </aside>

        <div className="min-w-0">
          <div className="z-20 flex flex-wrap items-center gap-2 bg-white sm:gap-3 lg:sticky lg:top-[72px] lg:py-2">
            <label className="flex h-11 min-w-0 flex-1 basis-full items-center gap-2.5 rounded-xl bg-[#f0f1f1] px-3.5 focus-within:ring-2 focus-within:ring-zlatna sm:basis-52">
              <Search aria-hidden className="size-[18px] shrink-0 text-tinta" />
              <input value={pojam} onChange={(e) => setPojam(e.target.value)} aria-label={`Pretraga u kategoriji ${nazivGrupe}`} placeholder="Traži u ovoj kategoriji" className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-[#8a8e93] sm:text-[15px]" />
              {pojam && (
                <button type="button" aria-label="Obriši pretragu" onClick={() => setPojam("")} className="grid size-6 shrink-0 place-items-center rounded-full hover:bg-black/5">
                  <X aria-hidden className="size-3.5" />
                </button>
              )}
            </label>
            <button type="button" onClick={() => setSheet(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#f0f1f1] px-4 text-[15px] lg:hidden">
              <SlidersHorizontal aria-hidden className="size-[18px]" />
              Filteri
              {brojFiltera > 0 && <span className="grid size-5 place-items-center rounded-full bg-narandza text-[12px] font-medium text-white">{brojFiltera}</span>}
            </button>
            <Sortiranje vrednost={sort} promeni={setSort} />
          </div>

          <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2" aria-live="polite">
            <p className="mr-1 text-[15px] text-sivi-2">
              <span className="font-medium text-tinta">{lista.length}</span> {lista.length % 10 === 1 && lista.length % 100 !== 11 ? "artikal" : "artikala"}
              {nazivPod && <span> u: {nazivPod}</span>}
            </p>
            {brendovi.map((b) => (
              <Oznaka key={b} ukloni={() => prekidacBrenda(b)}>{b}</Oznaka>
            ))}
            {opseg && <Oznaka ukloni={() => setOpseg(null)}>{oblikCene(opseg[0])} - {oblikCene(opseg[1])} RSD</Oznaka>}
            {imaFiltera && (
              <button type="button" onClick={obrisi} className="px-1 text-[14px] text-narandza underline-offset-2 hover:underline">Obriši sve</button>
            )}
          </div>

          {lista.length === 0 ? (
            <div className="mt-4 rounded-[20px] bg-sivka px-6 py-14 text-center">
              <h2 className="text-[22px] font-medium">Nema artikala za ove filtere</h2>
              <p className="mt-2 text-[16px] font-light text-sivi-2">Uklonite neki filter ili nas pozovite, možda je artikal u radnji.</p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={obrisi} className="h-12 rounded-full bg-narandza px-6 font-medium text-white transition-colors hover:bg-narandza-tamna">Obriši filtere</button>
                <a href={tel(firma.fiksni)} className="flex h-12 items-center gap-2 rounded-full bg-white px-5 transition-colors hover:text-narandza">
                  <Phone aria-hidden className="size-4" />
                  {firma.fiksni}
                </a>
              </div>
            </div>
          ) : (
            <>
              <ul key={potpis} className="v2-chat-ulaz mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                {lista.slice(0, vidljivo).map((a) => (
                  <li key={a.id}>
                    <ProizvodKartica id={a.id} izbor={a.izbor} naziv={a.naziv} brend={a.brend} cena={a.cena} slika={a.slika} sifra={a.sifra} puna={a.puna} sizes="(min-width: 1280px) 220px, (min-width: 640px) 30vw, 46vw" />
                  </li>
                ))}
              </ul>
              {lista.length > vidljivo && (
                <div className="mx-auto mt-8 max-w-xs text-center">
                  <p className="text-[14px] text-sivi-2">Prikazano {vidljivo} od {lista.length}</p>
                  <div aria-hidden className="mt-2 h-1 overflow-hidden rounded-full bg-sivka">
                    <div className="h-full rounded-full bg-narandza transition-[width] duration-300" style={{ width: `${(vidljivo / lista.length) * 100}%` }} />
                  </div>
                  <button type="button" onClick={() => setVidljivo((v) => v + PO_STRANI)} className="mt-4 h-12 rounded-full px-7 text-[15px] font-medium text-narandza ring-1 ring-narandza/40 transition-colors hover:bg-breskva">
                    Prikaži još
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {sheet && (
        <PanelFiltera zatvori={() => setSheet(false)} broj={lista.length} imaFiltera={brojFiltera > 0} obrisi={() => { setBrendovi([]); setOpseg(null); }}>
          {paneli}
        </PanelFiltera>
      )}
    </div>
  );
}

function Odeljak({ naslov, children }: { naslov: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[16px] font-medium">{naslov}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Cip({ aktivan, broj, akcent, klik, manji, children }: { aktivan: boolean; broj: number; akcent: string; klik: () => void; manji?: boolean; children: ReactNode }) {
  const prazno = broj === 0 && !aktivan;
  return (
    <button
      type="button"
      aria-pressed={aktivan}
      disabled={prazno}
      onClick={klik}
      className={`flex shrink-0 items-center gap-2 rounded-full whitespace-nowrap transition-colors disabled:opacity-40 ${manji ? "h-9 px-3.5 text-[14px]" : "h-11 px-4 text-[15px]"} ${aktivan ? "bg-ugalj text-white" : "bg-sivka hover:bg-[#e3e7e6]"}`}
    >
      {!manji && <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: aktivan ? akcent : "#c4c9c8" }} />}
      {children}
      <span className={`text-[13px] ${aktivan ? "text-white/60" : "text-sivi-2"}`}>{broj}</span>
    </button>
  );
}

function RedKategorije({ aktivan, broj, akcent, klik, uvuceno, children }: { aktivan: boolean; broj: number; akcent: string; klik: () => void; uvuceno?: boolean; children: ReactNode }) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={aktivan}
        disabled={broj === 0 && !aktivan}
        onClick={klik}
        className={`relative flex w-full items-center gap-2 rounded-lg py-2 pr-2 text-left text-[15px] leading-snug transition-colors disabled:opacity-40 ${uvuceno ? "pl-6" : "pl-3"} ${aktivan ? "bg-sivka font-medium" : "enabled:hover:bg-sivka"}`}
      >
        {aktivan && <span aria-hidden className="absolute inset-y-2 left-0 w-[3px] rounded-full" style={{ backgroundColor: akcent }} />}
        <span className="min-w-0 flex-1">{children}</span>
        <span className="text-[13px] font-normal text-sivi-2">{broj}</span>
      </button>
    </li>
  );
}

function Oznaka({ ukloni, children }: { ukloni: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={ukloni} className="flex h-8 items-center gap-1.5 rounded-full bg-breskva pr-2 pl-3 text-[14px] text-narandza-tamna transition-colors hover:bg-[#fde5db]">
      {children}
      <X aria-hidden className="size-3.5" />
    </button>
  );
}

function ListaBrendova({ brojevi, izabrani, prekidac }: { brojevi: [string, number][]; izabrani: string[]; prekidac: (b: string) => void }) {
  const [svi, setSvi] = useState(false);
  const prikaz = svi ? brojevi : brojevi.slice(0, BREND_LISTA);
  return (
    <>
      <ul className="space-y-0.5">
        {prikaz.map(([b, n]) => {
          const on = izabrani.includes(b);
          return (
            <li key={b}>
              <label className={`-mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-[15px] transition-colors hover:bg-sivka ${n === 0 && !on ? "opacity-40" : ""}`}>
                <input type="checkbox" className="peer sr-only" checked={on} onChange={() => prekidac(b)} />
                <span className={`grid size-5 shrink-0 place-items-center rounded-md ring-1 ring-inset peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-zlatna ${on ? "bg-ugalj text-white ring-ugalj" : "bg-white ring-[#c4c9c8]"}`}>
                  {on && <Check aria-hidden className="size-3.5" strokeWidth={3} />}
                </span>
                <span className="min-w-0 flex-1 truncate">{b}</span>
                <span className="text-[13px] text-sivi-2">{n}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {brojevi.length > BREND_LISTA && (
        <button type="button" onClick={() => setSvi((s) => !s)} className="mt-2 flex items-center gap-1 text-[14px] text-narandza">
          {svi ? "Prikaži manje" : `Svih ${brojevi.length} brendova`}
          <ChevronDown aria-hidden className={`size-4 transition-transform ${svi ? "rotate-180" : ""}`} />
        </button>
      )}
    </>
  );
}

// Logaritamska skala: u kategoriji su artikli od 50 do 20.000 RSD, a većina je pri dnu
function KlizacCene({ min, max, opseg, akcent, promeni }: { min: number; max: number; opseg: [number, number] | null; akcent: string; promeni: (o: [number, number] | null) => void }) {
  const KORACI = 1000;
  const [od, dokle] = opseg ?? [min, max];
  const [tekst, setTekst] = useState<[string, string] | null>(null);
  if (min === max) return <p className="text-[15px] text-sivi-2">{rsd(min)}</p>;

  const uPoz = (v: number) => (Math.log(Math.max(v, min) / min) / Math.log(max / min)) * KORACI;
  const izPoz = (p: number) => {
    if (p <= 0) return min;
    if (p >= KORACI) return max;
    const v = min * Math.pow(max / min, p / KORACI);
    return Math.min(max, Math.max(min, Math.round(v / 10) * 10));
  };
  const postavi = (a: number, b: number) => promeni(a <= min && b >= max ? null : [a, b]);
  const levo = uPoz(od) / 10;
  const desno = uPoz(dokle) / 10;
  const klizac = "pointer-events-none absolute inset-0 h-full w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,.15),0_3px_8px_rgba(35,40,50,.3)] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgba(0,0,0,.15),0_3px_8px_rgba(35,40,50,.3)]";
  const polje = "h-11 w-full min-w-0 rounded-xl bg-[#f0f1f1] pr-11 pl-3 text-base outline-none focus:ring-2 focus:ring-zlatna sm:text-[15px]";

  const potvrdi = () => {
    if (!tekst) return;
    const a = Number(tekst[0].replace(/\D/g, "")) || min;
    const b = Number(tekst[1].replace(/\D/g, "")) || max;
    const nizi = Math.max(min, Math.min(a, b));
    const visi = Math.min(max, Math.max(a, b));
    postavi(nizi, visi);
    setTekst(null);
  };

  return (
    <div>
      <div className="relative h-6">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#e3e7e6]" />
        <div aria-hidden className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full" style={{ left: `${levo}%`, right: `${100 - desno}%`, backgroundColor: akcent }} />
        <input type="range" aria-label="Najniža cena" min={0} max={KORACI} value={uPoz(od)} onChange={(e) => postavi(Math.min(izPoz(+e.target.value), dokle), dokle)} className={klizac} />
        <input type="range" aria-label="Najviša cena" min={0} max={KORACI} value={uPoz(dokle)} onChange={(e) => postavi(od, Math.max(izPoz(+e.target.value), od))} className={klizac} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["od", "do"] as const).map((n, i) => (
          <label key={n} className="relative block">
            <span className="sr-only">{n === "od" ? "Cena od" : "Cena do"}</span>
            <input
              inputMode="numeric"
              className={polje}
              value={tekst ? tekst[i] : oblikCene(i ? dokle : od)}
              onFocus={() => setTekst([String(od), String(dokle)])}
              onChange={(e) => setTekst((t) => (i ? [t?.[0] ?? String(od), e.target.value] : [e.target.value, t?.[1] ?? String(dokle)]))}
              onBlur={potvrdi}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
            />
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[12px] text-sivi-2">RSD</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Sortiranje({ vrednost, promeni }: { vrednost: Sort; promeni: (s: Sort) => void }) {
  const [otvoreno, setOtvoreno] = useState(false);
  const koren = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!otvoreno) return;
    const klik = (e: MouseEvent) => {
      if (!koren.current?.contains(e.target as Node)) setOtvoreno(false);
    };
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoreno(false);
    };
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", taster);
    return () => {
      document.removeEventListener("mousedown", klik);
      document.removeEventListener("keydown", taster);
    };
  }, [otvoreno]);

  return (
    <div ref={koren} className="relative flex-1 sm:flex-none">
      <button type="button" aria-haspopup="listbox" aria-expanded={otvoreno} onClick={() => setOtvoreno((o) => !o)} className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#f0f1f1] px-4 text-[15px] whitespace-nowrap transition-colors hover:bg-[#e8eaea]">
        <ArrowDownUp aria-hidden className="size-4" />
        <span className="max-sm:hidden">{SORT.find((s) => s.v === vrednost)?.t}</span>
        <span className="sm:hidden">Sortiraj</span>
      </button>
      {otvoreno && (
        <ul role="listbox" aria-label="Sortiranje" className="v2-chat-ulaz absolute top-full right-0 z-40 mt-2 w-56 rounded-2xl bg-white p-1.5 shadow-[0_24px_50px_-16px_rgba(35,40,50,.45)] ring-1 ring-black/5">
          {SORT.map((s) => (
            <li key={s.v}>
              <button
                type="button"
                role="option"
                aria-selected={s.v === vrednost}
                onClick={() => {
                  promeni(s.v);
                  setOtvoreno(false);
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[15px] hover:bg-sivka"
              >
                {s.t}
                {s.v === vrednost && <Check aria-hidden className="size-4 text-narandza" strokeWidth={2.5} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PanelFiltera({ zatvori, broj, imaFiltera, obrisi, children }: { zatvori: () => void; broj: number; imaFiltera: boolean; obrisi: () => void; children: ReactNode }) {
  useEffect(() => {
    const staro = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") zatvori();
    };
    document.addEventListener("keydown", taster);
    return () => {
      document.body.style.overflow = staro;
      document.removeEventListener("keydown", taster);
    };
  }, [zatvori]);

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Filteri" className="v2 fixed inset-0 z-[85] flex flex-col justify-end">
      <div aria-hidden onClick={zatvori} className="v2-pretraga-pozadina absolute inset-0 bg-noc/60" />
      <div className="v2-list-gore relative flex max-h-[88dvh] flex-col rounded-t-[28px] bg-white">
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <h2 className="text-[20px] font-medium">Filteri</h2>
          <div className="flex items-center gap-1">
            {imaFiltera && <button type="button" onClick={obrisi} className="px-2 text-[14px] text-narandza">Obriši</button>}
            <button type="button" aria-label="Zatvori filtere" onClick={zatvori} className="grid size-10 place-items-center rounded-full hover:bg-sivka">
              <X aria-hidden className="size-5" />
            </button>
          </div>
        </div>
        <div className="v2-karusel flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>
        <div className="border-t border-sivka p-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
          <button type="button" onClick={zatvori} className="h-13 w-full rounded-full bg-narandza text-[16px] font-medium text-white transition-colors hover:bg-narandza-tamna">
            Prikaži {broj} {broj % 10 === 1 && broj % 100 !== 11 ? "artikal" : "artikala"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
