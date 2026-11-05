"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUp, Car, Check, ChevronRight, ClipboardList, MessageCircle, PackageSearch, PaintRoller, Phone, Plus, RotateCcw, Search, Square, Tag, Trash2, X } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { cena, tel } from "@/data/v2";
import { brojArtikala, Kolicina, kljucStavke, useKorpa } from "./korpa/Korpa";

type Artikal = { id: number; naziv: string; sifra: string; kategorija: string; cena: number; slika: string; link: string; izbor?: boolean };
type Poruka = { id: string; role: "user" | "assistant"; content: string; artikli?: Artikal[]; predlozi?: string[]; greska?: boolean };
type Dogadjaj =
  | { t: "tekst"; v: string }
  | { t: "ponisti" }
  | { t: "trazi"; v: string }
  | { t: "proizvodi"; v: Artikal[] }
  | { t: "predlozi"; v: string[] }
  | { t: "greska" }
  | { t: "kraj" };

const KLJUC = "lisa-chat-v1";
const GRESKA = "Trenutno ne mogu da odgovorim. Pokušajte ponovo ili pitajte prodavca.";

// Teme sa „dopuna" samo započnu poruku, da kupac u redu odmah upiše naziv artikla
const TEME = [
  { Ikona: Tag, naslov: "Koliko nešto košta", opis: "Upišite naziv artikla", dopuna: "Koliko košta " },
  { Ikona: PackageSearch, naslov: "Imate li neki artikal", opis: "Upišite šta tražite", dopuna: "Imate li " },
  { Ikona: PaintRoller, naslov: "Šta mi treba za posao", opis: "Krečenje, drvo, metal, fasada", pitanje: "Šta mi sve treba za posao koji radim?" },
  { Ikona: Car, naslov: "Boja za auto po kodu", opis: "Miksovanje, auto korektor, sprejevi", pitanje: "Treba mi boja za auto po kodu" },
];

const noviId = () => Math.random().toString(36).slice(2);
const uTelefon = /(\+381[\d\s-]{6,}\d|\b0\d{1,2}[\s/-]?\d[\d\s-]{4,}\d)/g;

// Brojevi telefona postaju linkovi, **tekst** postaje podebljan
function Tekst({ children }: { children: string }) {
  const delovi: ReactNode[] = [];
  children.split(/(\*\*.+?\*\*)/g).forEach((deo, i) => {
    if (deo.startsWith("**") && deo.endsWith("**") && deo.length > 4) {
      delovi.push(<strong key={i} className="font-medium">{deo.slice(2, -2)}</strong>);
      return;
    }
    deo.split(uTelefon).forEach((d, j) => {
      if (j % 2) delovi.push(<a key={`${i}-${j}`} href={tel(d)} className="whitespace-nowrap underline underline-offset-2">{d}</a>);
      else if (d) delovi.push(d);
    });
  });
  return <>{delovi}</>;
}

function Znak({ velicina = "size-7" }: { velicina?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-black/5 ${velicina}`}>
      <Image src="/img/logo.svg" alt="" fill unoptimized className="object-contain p-[3px]" />
    </span>
  );
}

function DodajNaSpisak({ a, naKlik, siroko }: { a: Artikal; naKlik: () => void; siroko?: boolean }) {
  const { stavke, dodaj } = useKorpa();
  const klasa = `flex h-9 shrink-0 items-center justify-center gap-1 rounded-full text-[14px] font-medium transition-colors ${siroko ? "w-full" : "px-3"}`;
  if (a.izbor) {
    return <Link href={a.link} onClick={naKlik} className={`${klasa} text-narandza-tamna ring-1 ring-narandza/40 hover:bg-breskva`}>Izaberi</Link>;
  }
  const n = stavke.find((s) => s.id === a.id && !s.napomena)?.kolicina ?? 0;
  return (
    <button
      type="button"
      aria-label={n ? `Dodaj još: ${a.naziv}, na spisku ${n}` : `Dodaj na spisak: ${a.naziv}`}
      onClick={() => dodaj({ id: a.id, naziv: a.naziv, sifra: a.sifra, cena: a.cena, slika: a.slika, link: a.link }, true)}
      className={`${klasa} ${n ? "bg-ugalj text-white hover:bg-noc" : "bg-narandza text-white hover:bg-narandza-tamna"}`}
    >
      {n ? <Check aria-hidden className="size-4" strokeWidth={2.75} /> : <Plus aria-hidden className="size-4" strokeWidth={2.5} />}
      {n ? `Na spisku: ${n}` : "Dodaj"}
    </button>
  );
}

function KarticeArtikala({ artikli, naKlik }: { artikli: Artikal[]; naKlik: () => void }) {
  if (artikli.length === 1) {
    const a = artikli[0];
    return (
      <div className="rounded-2xl bg-white p-2 shadow-[0_0_0_1px_#e8ebed]">
        <Link href={a.link} onClick={naKlik} className="group flex items-center gap-3">
          <span className="relative block size-[72px] shrink-0 overflow-hidden rounded-xl bg-white">
            {a.slika && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={a.slika} alt="" loading="lazy" className="absolute inset-1 size-[calc(100%-.5rem)] object-contain" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="line-clamp-2 text-[14px] leading-snug group-hover:text-narandza">{a.naziv}</span>
            <span className="mt-1 block text-[16px] leading-none font-semibold text-narandza">{cena(a.cena)}</span>
          </span>
          <ChevronRight aria-hidden className="size-4 shrink-0 text-sivi-2" />
        </Link>
        <div className="mt-2"><DodajNaSpisak a={a} naKlik={naKlik} siroko /></div>
      </div>
    );
  }
  return (
    <ul className="v2-karusel -mr-4 flex snap-x gap-2 overflow-x-auto pr-4 pb-1 pl-px">
      {artikli.map((a) => (
        <li key={a.id} className="w-[158px] shrink-0 snap-start py-px">
          <div className="flex h-full flex-col rounded-2xl bg-white p-2 shadow-[0_0_0_1px_#e8ebed]">
            <Link href={a.link} onClick={naKlik} className="group block flex-1">
              <span className="relative block h-[104px] overflow-hidden rounded-xl bg-white">
                {a.slika && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.slika} alt="" loading="lazy" className="absolute inset-1.5 size-[calc(100%-.75rem)] object-contain" />
                )}
              </span>
              <span className="mt-2 line-clamp-2 min-h-[2.6em] px-1 text-[13px] leading-[1.3] group-hover:text-narandza">{a.naziv}</span>
              <span className="mt-1.5 mb-2 block px-1 text-[15px] leading-none font-semibold text-narandza">{cena(a.cena)}</span>
            </Link>
            <DodajNaSpisak a={a} naKlik={naKlik} siroko />
          </div>
        </li>
      ))}
    </ul>
  );
}

// Ekran koji kupac pokazuje prodavcu kad dođe na red
function Spisak({ nazad, naKlik }: { nazad: () => void; naKlik: () => void }) {
  const { stavke, ukupno, promeni, ukloni } = useKorpa();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-4">
        <button type="button" onClick={nazad} className="-ml-1 flex h-10 items-center gap-1.5 pr-3 text-[15px] text-sivi-2 transition-colors hover:text-tinta">
          <ArrowLeft aria-hidden className="size-4" />
          Nazad na chat
        </button>
        <h3 className="mt-1 text-[26px] leading-[1.15] font-[550] tracking-[-0.025em]">Pokažite spisak prodavcu</h3>
        <ul className="mt-2 divide-y divide-sivka">
          {stavke.map((s) => {
            const k = kljucStavke(s);
            return (
              <li key={k} className="py-3.5">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-[17px] leading-snug font-medium break-words">{s.naziv}</p>
                    {s.sifra && <p className="mt-0.5 text-[15px] font-light text-[#5c6470] tabular-nums">Šifra: {s.sifra}</p>}
                    {s.napomena && <p className="mt-0.5 text-[14px] leading-snug font-light text-[#5c6470]">{s.napomena}</p>}
                  </div>
                  <button type="button" aria-label={`Ukloni: ${s.naziv}`} onClick={() => ukloni(k)} className="-mt-1 -mr-1.5 grid size-9 shrink-0 place-items-center rounded-full text-sivi-2 transition-colors hover:bg-sivka hover:text-crvena">
                    <Trash2 aria-hidden className="size-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <Kolicina vrednost={s.kolicina} promeni={(n) => promeni(k, n)} naziv={s.naziv} />
                  <span className="text-[17px] font-semibold whitespace-nowrap">{cena(s.cena * s.kolicina)}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="shrink-0 border-t border-sivka px-4 pt-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-[15px] font-light text-sivi-2">Ukupno</span>
          <span className="text-[28px] leading-none font-[550] tracking-[-0.03em] whitespace-nowrap">{cena(ukupno)}</span>
        </div>
        <Link href="/v2/porudzbina" onClick={naKlik} className="mt-3 flex h-12 items-center justify-center rounded-full text-[15px] ring-1 ring-[#d8dbdb] transition-colors hover:bg-sivka">Poruči preko sajta</Link>
      </div>
    </div>
  );
}

export default function Asistent() {
  const [otvoreno, setOtvoreno] = useState(false);
  const [poruke, setPoruke] = useState<Poruka[]>([]);
  const [unos, setUnos] = useState("");
  const [radi, setRadi] = useState(false);
  const [trazi, setTrazi] = useState<string | null>(null);
  const [blizuDna, setBlizuDna] = useState(true);
  const [najava, setNajava] = useState(false);
  const [zaCitac, setZaCitac] = useState("");
  const [spisak, setSpisak] = useState(false);
  const { broj, ukupno, stavke } = useKorpa();

  const polje = useRef<HTMLTextAreaElement>(null);
  const lista = useRef<HTMLDivElement>(null);
  const dugme = useRef<HTMLButtonElement>(null);
  const prekid = useRef<AbortController | null>(null);
  const prati = useRef(true);
  const bioOtvoren = useRef(false);

  // Adresa /v2/chat, koju prodavci daju kupcima u redu, odmah otvara chat
  useEffect(() => {
    const adresa = new URL(location.href);
    if (!adresa.searchParams.has("chat")) return;
    adresa.searchParams.delete("chat");
    history.replaceState(history.state, "", adresa);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- adresa postoji tek u browseru
    setOtvoreno(true);
  }, []);

  // Isprazni li se spisak, nema šta da se pokaže prodavcu
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- spisak prati korpu
    if (!stavke.length) setSpisak(false);
  }, [stavke.length]);

  // Razgovor preživljava osvežavanje i prelazak na drugu stranu
  useEffect(() => {
    try {
      const sacuvano = sessionStorage.getItem(KLJUC);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage postoji tek u browseru
      if (sacuvano) setPoruke(JSON.parse(sacuvano));
    } catch {}
  }, []);

  useEffect(() => {
    if (radi) return;
    try {
      if (poruke.length) sessionStorage.setItem(KLJUC, JSON.stringify(poruke));
      else sessionStorage.removeItem(KLJUC);
    } catch {}
  }, [poruke, radi]);

  // Jedna kratka najava po poseti, samo na većem ekranu
  useEffect(() => {
    let vidjeno = false;
    try {
      vidjeno = sessionStorage.getItem(`${KLJUC}-najava`) === "1";
    } catch {}
    if (vidjeno || !matchMedia("(min-width: 640px)").matches) return;
    const pokazi = setTimeout(() => setNajava(true), 6000);
    const sakrij = setTimeout(() => setNajava(false), 16000);
    try {
      sessionStorage.setItem(`${KLJUC}-najava`, "1");
    } catch {}
    return () => {
      clearTimeout(pokazi);
      clearTimeout(sakrij);
    };
  }, []);

  useEffect(() => {
    if (!otvoreno) {
      if (bioOtvoren.current) dugme.current?.focus();
      return;
    }
    bioOtvoren.current = true;
    const veliki = matchMedia("(min-width: 640px)").matches;
    if (veliki) polje.current?.focus();
    const staro = document.body.style.overflow;
    if (!veliki) document.body.style.overflow = "hidden";
    const taster = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtvoreno(false);
    };
    document.addEventListener("keydown", taster);
    return () => {
      document.body.style.overflow = staro;
      document.removeEventListener("keydown", taster);
    };
  }, [otvoreno]);

  const naDno = useCallback((blago = false) => {
    const el = lista.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: blago ? "smooth" : "auto" });
  }, []);

  useLayoutEffect(() => {
    if (otvoreno && prati.current && poruke.length) naDno();
  }, [poruke, trazi, otvoreno, naDno]);

  useLayoutEffect(() => {
    const el = polje.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [unos, otvoreno]);

  useEffect(() => () => prekid.current?.abort(), []);

  const izmeniPoslednju = (izmena: (p: Poruka) => Poruka) =>
    setPoruke((sve) => (sve.length ? [...sve.slice(0, -1), izmena(sve[sve.length - 1])] : sve));

  const posalji = async (tekst: string, osnova: Poruka[] = poruke) => {
    const pitanje = tekst.trim().slice(0, 1000);
    if (!pitanje || radi) return;
    const prethodne = osnova.map((p) => ({ ...p, predlozi: undefined }));
    // Greške i prazni odgovori ne idu nazad modelu
    const istorija = [...prethodne.filter((p) => !p.greska && p.content), { role: "user" as const, content: pitanje }];

    setPoruke([...prethodne, { id: noviId(), role: "user", content: pitanje }, { id: noviId(), role: "assistant", content: "" }]);
    setUnos("");
    setRadi(true);
    setNajava(false);
    prati.current = true;
    setBlizuDna(true);
    const kontroler = new AbortController();
    prekid.current = kontroler;

    const neuspeh = () => izmeniPoslednju((p) => (p.content ? p : { ...p, content: GRESKA, greska: true }));
    let odgovor = "";

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poruke: istorija.map(({ role, content }) => ({ role, content })) }),
        signal: kontroler.signal,
      });
      if (!r.ok || !r.body) throw new Error();

      const citac = r.body.pipeThrough(new TextDecoderStream()).getReader();
      let bafer = "";
      for (;;) {
        const { value, done } = await citac.read();
        if (done) break;
        bafer += value;
        const redovi = bafer.split("\n");
        bafer = redovi.pop() ?? "";
        for (const red of redovi) {
          if (!red) continue;
          const d = JSON.parse(red) as Dogadjaj;
          if (d.t === "tekst") {
            odgovor += d.v;
            setTrazi(null);
            izmeniPoslednju((p) => ({ ...p, content: p.content + d.v }));
          } else if (d.t === "ponisti") {
            odgovor = "";
            izmeniPoslednju((p) => ({ ...p, content: "" }));
          } else if (d.t === "trazi") setTrazi(d.v);
          else if (d.t === "proizvodi") {
            setTrazi(null);
            izmeniPoslednju((p) => ({ ...p, artikli: [...(p.artikli ?? []), ...d.v] }));
          } else if (d.t === "predlozi") izmeniPoslednju((p) => ({ ...p, predlozi: d.v }));
          else if (d.t === "greska") neuspeh();
        }
      }
      if (odgovor) setZaCitac(odgovor);
    } catch {
      if (!kontroler.signal.aborted) neuspeh();
    } finally {
      // Prekinut odgovor bez teksta ne ostavlja prazan oblačić
      setPoruke((sve) => {
        const p = sve[sve.length - 1];
        return p?.role === "assistant" && !p.content && !p.artikli?.length ? sve.slice(0, -1) : sve;
      });
      setTrazi(null);
      setRadi(false);
      if (matchMedia("(min-width: 640px)").matches) polje.current?.focus();
    }
  };

  const ponovo = () => {
    const i = poruke.findLastIndex((p) => p.role === "user");
    if (i >= 0) posalji(poruke[i].content, poruke.slice(0, i));
  };

  const iznova = () => {
    prekid.current?.abort();
    setPoruke([]);
    setUnos("");
    polje.current?.focus();
  };

  const zapocni = (tekst: string) => {
    setUnos(tekst);
    requestAnimationFrame(() => {
      polje.current?.focus();
      polje.current?.setSelectionRange(tekst.length, tekst.length);
    });
  };

  const naTelefonuZatvori = () => {
    if (!matchMedia("(min-width: 640px)").matches) setOtvoreno(false);
  };

  const poslednja = poruke[poruke.length - 1];
  const prazno = poruke.length === 0;

  return (
    <div className="v2">
      {!otvoreno && najava && (
        <div className="v2-chat-dugme v2-chat-ulaz fixed right-6 bottom-[92px] z-[60] flex max-w-[290px] items-start gap-2.5 rounded-2xl rounded-br-md bg-white p-3 pr-2 shadow-[0_18px_44px_-14px_rgba(35,40,50,.45)] ring-1 ring-black/5">
          <Znak velicina="size-8" />
          <button type="button" onClick={() => setOtvoreno(true)} className="min-w-0 flex-1 text-left text-[14px] leading-snug">
            Imate pitanje? Pitajte ovde, bez čekanja.
          </button>
          <button type="button" aria-label="Zatvori poruku" onClick={() => setNajava(false)} className="grid size-6 shrink-0 place-items-center rounded-full text-sivi-2 hover:bg-sivka">
            <X aria-hidden className="size-3.5" />
          </button>
        </div>
      )}

      <button
        ref={dugme}
        type="button"
        aria-label="Otvori chat"
        aria-expanded={otvoreno}
        onClick={() => setOtvoreno(true)}
        className={`v2-chat-dugme fixed right-4 bottom-4 z-[60] flex h-14 items-center gap-2.5 rounded-full bg-narandza px-4 font-medium text-white shadow-[0_14px_30px_-10px_rgba(35,40,50,.6)] transition-colors hover:bg-narandza-tamna sm:right-6 sm:bottom-6 ${otvoreno ? "hidden" : ""}`}
      >
        <MessageCircle aria-hidden className="size-6" strokeWidth={1.75} />
        <span className="pr-1">Chat</span>
      </button>

      <p className="sr-only" aria-live="polite">{zaCitac}</p>

      {otvoreno && (
        <section
          role="dialog"
          aria-label="Chat sa Lisa Comerc"
          className="v2-chat-ulaz fixed inset-0 z-[80] flex flex-col overflow-hidden bg-white sm:inset-auto sm:right-6 sm:bottom-6 sm:h-[min(700px,calc(100dvh-48px))] sm:w-[420px] sm:origin-bottom-right sm:rounded-3xl sm:shadow-[0_32px_80px_-20px_rgba(35,40,50,.6)] sm:ring-1 sm:ring-black/5"
        >
          <header className="shrink-0 bg-ugalj text-white">
            <div className="flex items-center gap-3 py-3 pr-2.5 pl-4">
              <Znak velicina="size-11" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[16px] leading-tight font-medium">Lisa Comerc</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-[13px] leading-tight font-light text-white/65">
                  <span aria-hidden className="size-1.5 rounded-full bg-[#3ddc97]" />
                  <span className="truncate">AI asistent<span className="hidden sm:inline">, odgovara odmah</span></span>
                </p>
              </div>
              {!prazno && !spisak && (
                <button type="button" aria-label="Novi razgovor" title="Novi razgovor" onClick={iznova} className="grid size-10 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                  <RotateCcw aria-hidden className="size-[18px]" />
                </button>
              )}
              <a href={tel(firma.fiksni)} aria-label={`Pozovite prodavca: ${firma.fiksni}`} title={`Pozovite ${firma.fiksni}`} className="grid size-10 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                <Phone aria-hidden className="size-[18px]" />
              </a>
              <button type="button" aria-label="Zatvori chat" onClick={() => setOtvoreno(false)} className="grid size-10 shrink-0 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            <div aria-hidden className="flex h-1">
              {["#2a7fc9", "#f5c518", "#e81825", "#ea8a1e", "#d4167c", "#7cb518"].map((b) => (
                <span key={b} className="flex-1" style={{ background: b }} />
              ))}
            </div>
          </header>

          {spisak ? <Spisak nazad={() => setSpisak(false)} naKlik={naTelefonuZatvori} /> : <>
          <div className="relative min-h-0 flex-1">
            <div
              ref={lista}
              onScroll={(e) => {
                const el = e.currentTarget;
                const blizu = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
                prati.current = blizu;
                setBlizuDna(blizu);
              }}
              className="h-full overflow-y-auto overscroll-contain px-4 py-5"
            >
              {prazno ? (
                <div>
                  <h3 className="text-[26px] leading-[1.15] font-[550] tracking-[-0.025em]">Pitajte ovde, bez čekanja</h3>
                  <ul className="mt-5 space-y-2">
                    {TEME.map(({ Ikona, naslov, opis, pitanje, dopuna }) => (
                      <li key={naslov}>
                        <button type="button" onClick={() => (pitanje ? posalji(pitanje) : zapocni(dopuna ?? ""))} className="group flex w-full items-center gap-3 rounded-2xl bg-sivka p-3 text-left transition-colors hover:bg-breskva">
                          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-narandza">
                            <Ikona aria-hidden className="size-5" strokeWidth={1.75} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] leading-tight">{naslov}</span>
                            <span className="mt-0.5 block truncate text-[13px] leading-tight font-light text-sivi-2">{opis}</span>
                          </span>
                          <ChevronRight aria-hidden className="size-4 shrink-0 text-sivi-2 transition-colors group-hover:text-narandza" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  {poruke.map((p, i) => {
                    const pise = radi && i === poruke.length - 1 && p.role === "assistant";
                    return p.role === "user" ? (
                      <p key={p.id} className="ml-auto w-fit max-w-[84%] rounded-[20px] rounded-br-md bg-ugalj px-4 py-2.5 text-[15px] leading-snug break-words whitespace-pre-wrap text-white">
                        {p.content}
                      </p>
                    ) : (
                      <div key={p.id} className="flex items-start gap-2">
                        <span className="pt-0.5"><Znak /></span>
                        <div className="min-w-0 flex-1 space-y-2">
                          {p.content && (
                            <p className={`w-fit max-w-full rounded-[20px] rounded-tl-md bg-sivka px-4 py-2.5 text-[15px] leading-[1.4] break-words whitespace-pre-wrap ${pise && !trazi ? "v2-kursor" : ""}`}>
                              <Tekst>{p.content}</Tekst>
                            </p>
                          )}
                          {p.artikli && p.artikli.length > 0 && <KarticeArtikala artikli={p.artikli} naKlik={naTelefonuZatvori} />}
                          {p.greska && !radi && (
                            <div className="flex flex-wrap gap-2">
                              <button type="button" onClick={ponovo} className="flex h-9 items-center gap-1.5 rounded-full bg-narandza px-3.5 text-[14px] font-medium text-white transition-colors hover:bg-narandza-tamna">
                                <RotateCcw aria-hidden className="size-3.5" />
                                Pokušaj ponovo
                              </button>
                              <a href={tel(firma.fiksni)} className="flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[14px] text-tinta ring-1 ring-[#d8dbdb] transition-colors hover:bg-sivka">
                                <Phone aria-hidden className="size-3.5" />
                                Pozovi prodavca
                              </a>
                            </div>
                          )}
                          {pise && !p.content && !trazi && (
                            <span className="flex w-fit gap-1 rounded-[20px] rounded-tl-md bg-sivka px-4 py-3.5" aria-label="Asistent piše">
                              <span className="size-1.5 animate-bounce rounded-full bg-sivi-2" />
                              <span className="size-1.5 animate-bounce rounded-full bg-sivi-2 [animation-delay:.15s]" />
                              <span className="size-1.5 animate-bounce rounded-full bg-sivi-2 [animation-delay:.3s]" />
                            </span>
                          )}
                          {pise && trazi && (
                            <p className="flex w-fit items-center gap-2 rounded-full bg-breskva px-3 py-1.5 text-[13px] text-narandza-tamna">
                              <Search aria-hidden className="size-3.5 animate-pulse" />
                              Tražim „{trazi}“ u prodavnici
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {!radi && poslednja?.predlozi && poslednja.predlozi.length > 0 && (
                    <div className="v2-chat-ulaz flex flex-wrap justify-end gap-2 pt-1">
                      {poslednja.predlozi.map((o) => (
                        <button key={o} type="button" onClick={() => posalji(o)} className="rounded-full px-3.5 py-2 text-left text-[14px] leading-tight text-narandza-tamna ring-1 ring-narandza/40 transition-colors hover:bg-breskva">
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {!blizuDna && (
              <button
                type="button"
                aria-label="Idi na najnoviju poruku"
                onClick={() => {
                  prati.current = true;
                  setBlizuDna(true);
                  naDno(true);
                }}
                className="absolute bottom-3 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full bg-white text-tinta shadow-[0_8px_20px_-6px_rgba(35,40,50,.45)] ring-1 ring-black/5"
              >
                <ArrowDown aria-hidden className="size-4" />
              </button>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              posalji(unos);
            }}
            className="shrink-0 border-t border-sivka px-3 pt-3 pb-[max(.625rem,env(safe-area-inset-bottom))]"
          >
            {broj > 0 && (
              <button type="button" onClick={() => setSpisak(true)} className="v2-chat-ulaz mb-2 flex h-12 w-full items-center gap-2 rounded-2xl bg-ugalj pr-2.5 pl-3.5 text-left text-[15px] text-white transition-colors hover:bg-noc">
                <ClipboardList aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate">Spisak: {brojArtikala(broj)}</span>
                <span className="font-medium whitespace-nowrap">{cena(ukupno)}</span>
                <ChevronRight aria-hidden className="size-4 shrink-0" />
              </button>
            )}
            <div className="flex items-end gap-2 rounded-[22px] bg-[#f0f1f1] p-1.5 transition-shadow focus-within:bg-white focus-within:ring-2 focus-within:ring-zlatna">
              <textarea
                ref={polje}
                rows={1}
                value={unos}
                maxLength={1000}
                aria-label="Vaša poruka"
                placeholder="Napišite poruku..."
                onChange={(e) => setUnos(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    posalji(unos);
                  }
                }}
                className="min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2 text-base leading-snug outline-none placeholder:text-[#8a8e93] sm:text-[15px]"
              />
              {radi ? (
                <button type="button" aria-label="Zaustavi odgovor" onClick={() => prekid.current?.abort()} className="grid size-10 shrink-0 place-items-center rounded-full bg-ugalj text-white transition-colors hover:bg-noc">
                  <Square aria-hidden className="size-3.5 fill-current" />
                </button>
              ) : (
                <button type="submit" aria-label="Pošalji" disabled={!unos.trim()} className="grid size-10 shrink-0 place-items-center rounded-full bg-narandza text-white transition-colors hover:bg-narandza-tamna disabled:bg-[#d8dbdb]">
                  <ArrowUp aria-hidden className="size-5" strokeWidth={2.25} />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[12px] leading-tight font-light text-sivi-2">AI asistent može da pogreši. Cenu i stanje proverite sa prodavcem.</p>
          </form>
          </>}
        </section>
      )}
    </div>
  );
}
