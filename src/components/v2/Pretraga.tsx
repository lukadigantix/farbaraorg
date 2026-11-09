"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { cena } from "@/data/v2";

type Rezultat = { id: number; naziv: string; sifra: string; kategorija: string; cena: number; slika: string; link: string };
type Stanje = { tip: "kratko" } | { tip: "ucitava" } | { tip: "greska" } | { tip: "gotovo"; pojam: string; artikli: Rezultat[] };

// Isto ponašanje kao pretraga na majice.rs
export default function Pretraga() {
  const [otvoreno, setOtvoreno] = useState(false);
  const [unos, setUnos] = useState("");
  const [stanje, setStanje] = useState<Stanje>({ tip: "kratko" });
  const [izlazi, setIzlazi] = useState(false);
  const polje = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const izlazTajmer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Panel ostaje u stranici dok ne završi izlaznu animaciju
  const zatvori = () => {
    if (izlazTajmer.current) return;
    setIzlazi(true);
    const trajanje = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180;
    izlazTajmer.current = setTimeout(() => {
      izlazTajmer.current = null;
      setIzlazi(false);
      setOtvoreno(false);
      setUnos("");
      setStanje({ tip: "kratko" });
    }, trajanje);
  };

  useEffect(
    () => () => {
      if (izlazTajmer.current) clearTimeout(izlazTajmer.current);
    },
    [],
  );

  useEffect(() => {
    if (!otvoreno) return;
    polje.current?.focus();
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
  }, [otvoreno]);

  const kucaj = (vrednost: string) => {
    setUnos(vrednost);
    setStanje(vrednost.trim().length < 2 ? { tip: "kratko" } : { tip: "ucitava" });
  };

  useEffect(() => {
    const pojam = unos.trim();
    if (pojam.length < 2) return;
    const prekid = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/pretraga/?q=${encodeURIComponent(pojam)}`, { signal: prekid.signal });
        if (!r.ok) throw new Error();
        setStanje({ tip: "gotovo", pojam, artikli: await r.json() });
      } catch {
        if (!prekid.signal.aborted) setStanje({ tip: "greska" });
      }
    }, 300);
    return () => {
      clearTimeout(t);
      prekid.abort();
    };
  }, [unos]);

  const poruka = (tekst: string) => (
    <div className="rounded-2xl border border-gray-200/60 bg-white/50 p-8 text-center text-sm text-gray-500 backdrop-blur">{tekst}</div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOtvoreno(true)}
        className="order-last flex h-11 w-full items-center gap-2.5 rounded-xl bg-[#f0f1f1] px-3.5 text-left transition-colors hover:bg-[#e8eaea] lg:order-none lg:w-auto lg:min-w-0 lg:flex-1"
      >
        <Search aria-hidden className="size-[18px] shrink-0 text-tinta" />
        <span className="truncate text-base text-[#8a8e93] lg:text-[15px]">Pretraga...</span>
      </button>

      {otvoreno &&
        createPortal(
          <div className="v2 fixed inset-0 z-[9999] flex items-start justify-center overflow-hidden px-4 pt-24 sm:px-6" role="dialog" aria-modal="true" aria-label="Pretraga">
            <div aria-hidden onClick={zatvori} className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${izlazi ? "v2-pretraga-pozadina-izlaz" : "v2-pretraga-pozadina"}`} />
            <div className={`relative w-full max-w-2xl overflow-hidden rounded-3xl border border-gray-200/60 bg-white/90 shadow-2xl backdrop-blur-2xl ${izlazi ? "v2-pretraga-izlaz" : "v2-pretraga-ulaz"}`}>
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-narandza/20 blur-[150px]" />
                <div className="absolute right-[-5%] bottom-[-30%] h-72 w-72 rounded-full bg-blue-400/20 blur-[160px]" />
              </div>

              <div className="relative flex items-center gap-3 border-b border-gray-200/60 px-5 py-4">
                <Search aria-hidden className="h-5 w-5 shrink-0 text-narandza" />
                <form
                  role="search"
                  className="contents"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const pojam = unos.trim();
                    if (pojam.length < 2) return;
                    router.push(`/pretraga/?q=${encodeURIComponent(pojam)}`);
                    zatvori();
                  }}
                >
                <input
                  ref={polje}
                  type="search"
                  enterKeyHint="search"
                  value={unos}
                  onChange={(e) => kucaj(e.target.value)}
                  aria-label="Pretraga"
                  placeholder="Pretraži po nazivu, šifri ili kategoriji..."
                  className="min-w-0 flex-1 bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
                />
                </form>
                <button type="button" aria-label="Zatvori pretragu" onClick={zatvori} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200/60 bg-white/50 text-gray-600 transition-colors hover:bg-white">
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </div>

              <div className="relative max-h-[min(500px,calc(100dvh-190px))] overflow-y-auto px-3 py-3">
                {stanje.tip === "kratko" && poruka("Unesite najmanje 2 karaktera za pretragu...")}
                {stanje.tip === "ucitava" && poruka("Pretraga u toku...")}
                {stanje.tip === "greska" && poruka("Pretraga trenutno nije dostupna. Pokušajte ponovo.")}
                {stanje.tip === "gotovo" && stanje.artikli.length === 0 && poruka(`Nema rezultata za "${stanje.pojam}". Pokušajte sa drugim pojmom.`)}
                {stanje.tip === "gotovo" && stanje.artikli.length > 0 && (
                  <>
                    <ul className="space-y-2">
                      {stanje.artikli.map((a) => (
                        <li key={a.id}>
                          <Link href={a.link} onClick={zatvori} className="group flex w-full items-center gap-4 rounded-2xl border border-transparent bg-white/50 px-4 py-4 text-left transition-all duration-200 hover:border-gray-200 hover:bg-white/80 hover:shadow-md">
                            <span className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200/40 bg-white">
                              {a.slika && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={a.slika} alt="" className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-contain" />
                              )}
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col">
                              <span className="text-sm font-medium text-gray-900 group-hover:text-narandza">{a.naziv}</span>
                              <span className="text-xs text-gray-500">Šifra: {a.sifra}{a.kategorija && ` • ${a.kategorija}`}</span>
                              <span className="mt-1 text-sm font-semibold text-narandza">{cena(a.cena)}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4">
                      <Link href={`/pretraga/?q=${encodeURIComponent(stanje.pojam)}`} onClick={zatvori} className="block w-full rounded-2xl bg-narandza px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-narandza-tamna">
                        Prikaži sve rezultate →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
