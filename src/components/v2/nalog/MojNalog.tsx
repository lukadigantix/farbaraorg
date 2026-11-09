"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Heart, LayoutGrid, LogOut, Package, Phone, ShoppingBag, UserRound, KeyRound } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import { cena, tel } from "@/data/v2";
import { odjaviSe, promeniLozinku, sacuvajPodatke, type Nalog, type PorudzbinaNaloga, type StatusPorudzbine } from "@/lib/nalog";
import { brojArtikala } from "../korpa/Korpa";
import { DugmeSlanja, Polje, PoljeLozinke, PorukaForme, proveri, useForma } from "./Forma";

type Deo = "pregled" | "porudzbine" | "podaci" | "lozinka";

const DELOVI: { id: Deo; naziv: string; ikona: typeof Package }[] = [
  { id: "pregled", naziv: "Pregled", ikona: LayoutGrid },
  { id: "porudzbine", naziv: "Porudžbine", ikona: Package },
  { id: "podaci", naziv: "Podaci i adresa", ikona: UserRound },
  { id: "lozinka", naziv: "Lozinka", ikona: KeyRound },
];

const STATUS: Record<StatusPorudzbine, { t: string; k: string }> = {
  primljena: { t: "Primljena", k: "bg-nebo text-tinta" },
  "u-pripremi": { t: "U pripremi", k: "bg-breskva text-narandza-tamna" },
  spremna: { t: "Spremna za preuzimanje", k: "bg-[#e1f3ea] text-[#127a52]" },
  poslata: { t: "Poslata", k: "bg-nebo text-tinta" },
  zavrsena: { t: "Završena", k: "bg-sivka text-ugalj" },
  otkazana: { t: "Otkazana", k: "bg-crvena/10 text-crvena" },
};

// Ručno, da server i browser napišu isti datum
const MESECI = ["januar", "februar", "mart", "april", "maj", "jun", "jul", "avgust", "septembar", "oktobar", "novembar", "decembar"];
const datum = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}. ${MESECI[d.getMonth()]} ${d.getFullYear()}.`;
};
const brojKomada = (s: PorudzbinaNaloga) => s.stavke.reduce((z, x) => z + x.kolicina, 0);

export default function MojNalog({ nalog, primer }: { nalog: Nalog; primer?: boolean }) {
  const [deo, setDeo] = useState<Deo>("pregled");

  // Deo se pamti u adresi (#porudzbine), da radi nazad i slanje linka
  useEffect(() => {
    const procitaj = () => {
      const h = location.hash.slice(1) as Deo;
      setDeo(DELOVI.some((d) => d.id === h) ? h : "pregled");
    };
    procitaj();
    addEventListener("hashchange", procitaj);
    return () => removeEventListener("hashchange", procitaj);
  }, []);

  const idi = (d: Deo) => {
    setDeo(d);
    history.replaceState(history.state, "", d === "pregled" ? location.pathname : `#${d}`);
  };

  return (
    <>
      {primer && (
        <p className="mt-5 inline-flex rounded-full bg-zlatna/20 px-4 py-2 text-[14px] text-ugalj">
          Primer podataka: nalozi još nisu povezani. Ovo se vidi samo lokalno, na pravom sajtu kupac ide na prijavu.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 lg:mt-8">
        <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.03] font-[550] tracking-[-0.035em]">Moj nalog</h1>
        <Odjava />
      </div>

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <nav aria-label="Delovi naloga" className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-2 lg:sticky lg:top-[96px] lg:flex-col lg:gap-1 lg:rounded-[24px] lg:bg-sivka lg:p-2">
            {DELOVI.map(({ id, naziv, ikona: Ikona }) => (
              <li key={id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => idi(id)}
                  aria-current={deo === id ? "page" : undefined}
                  className={`flex h-11 w-full items-center gap-3 rounded-full px-4 text-[15px] whitespace-nowrap transition-colors lg:h-12 lg:rounded-2xl ${deo === id ? "bg-tinta text-white" : "bg-sivka hover:bg-dim/60 lg:bg-transparent lg:hover:bg-white"}`}
                >
                  <Ikona aria-hidden className="size-[18px]" strokeWidth={1.75} />
                  {naziv}
                  {id === "porudzbine" && nalog.porudzbine.length > 0 && (
                    <span className={`ml-auto rounded-full px-2 text-[12px] tabular-nums ${deo === id ? "bg-white/20" : "bg-white lg:bg-sivka"}`}>{nalog.porudzbine.length}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {deo === "pregled" && <Pregled nalog={nalog} idi={idi} />}
          {deo === "porudzbine" && <Porudzbine porudzbine={nalog.porudzbine} />}
          {deo === "podaci" && <Podaci nalog={nalog} />}
          {deo === "lozinka" && <Lozinka />}
        </div>
      </div>
    </>
  );
}

function Odjava() {
  const router = useRouter();
  const [poruka, setPoruka] = useState("");
  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={async () => {
          const r = await odjaviSe();
          if (r.ok) router.push("/");
          else setPoruka(r.poruka);
        }}
        className="flex h-11 items-center gap-2 rounded-full px-4 text-[15px] ring-1 ring-linija transition-colors hover:bg-sivka"
      >
        <LogOut aria-hidden className="size-[18px]" strokeWidth={1.75} />
        Odjavi se
      </button>
      {poruka && <p role="alert" className="max-w-[320px] text-right text-[13px] text-sivi-2">{poruka}</p>}
    </div>
  );
}

function Naslov({ children, opis }: { children: ReactNode; opis?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-[550] tracking-[-0.025em]">{children}</h2>
      {opis && <p className="mt-1.5 text-[16px] font-light text-sivi-2">{opis}</p>}
    </div>
  );
}

function Pregled({ nalog, idi }: { nalog: Nalog; idi: (d: Deo) => void }) {
  const poslednja = nalog.porudzbine[0];
  const ime = nalog.tip === "firma" && nalog.firma ? nalog.firma : nalog.ime.split(" ")[0];
  const precice = [
    { href: "/sacuvani-proizvodi", naslov: "Sačuvani proizvodi", tekst: "Artikli koje ste označili srcem", ikona: Heart },
    { href: "/korpa", naslov: "Korpa", tekst: "Nastavite gde ste stali", ikona: ShoppingBag },
  ];
  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6 rounded-[28px] rounded-br-[64px] bg-ugalj p-7 text-white sm:p-10">
        <div className="min-w-0">
          <p className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.1] font-[550] tracking-[-0.03em] break-words">Zdravo, {ime}</p>
          <p className="mt-2 text-[16px] font-light break-all text-white/65">{nalog.email}</p>
        </div>
        <button type="button" onClick={() => idi("porudzbine")} className="text-left">
          <span className="block text-[clamp(2.5rem,4vw,3.5rem)] leading-none font-[550] tabular-nums">{nalog.porudzbine.length}</span>
          <span className="mt-1 block text-[15px] text-white/65 underline-offset-2 hover:underline">{nalog.porudzbine.length === 1 ? "porudžbina" : "porudžbina ukupno"}</span>
        </button>
      </div>

      <section>
        <Naslov>Poslednja porudžbina</Naslov>
        {poslednja ? (
          <>
            <KarticaPorudzbine p={poslednja} />
            {nalog.porudzbine.length > 1 && (
              <button type="button" onClick={() => idi("porudzbine")} className="mt-4 text-[15px] font-medium text-narandza underline-offset-2 hover:underline">
                Sve porudžbine ({nalog.porudzbine.length})
              </button>
            )}
          </>
        ) : (
          <Prazno />
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {precice.map(({ href, naslov, tekst, ikona: Ikona }) => (
          <Link key={href} href={href} className="group flex flex-col rounded-[24px] bg-sivka p-6 transition-colors hover:bg-breskva">
            <Ikona aria-hidden className="size-6 text-narandza" strokeWidth={1.75} />
            <span className="mt-6 text-[18px] font-medium transition-colors group-hover:text-narandza">{naslov}</span>
            <span className="mt-1 text-[15px] font-light text-sivi-2">{tekst}</span>
          </Link>
        ))}
        <a href={tel(firma.fiksni)} className="group flex flex-col rounded-[24px] bg-sivka p-6 transition-colors hover:bg-breskva">
          <Phone aria-hidden className="size-6 text-narandza" strokeWidth={1.75} />
          <span className="mt-6 text-[18px] font-medium transition-colors group-hover:text-narandza">Pitanje o porudžbini?</span>
          <span className="mt-1 text-[15px] font-light text-sivi-2">{firma.fiksni}</span>
        </a>
      </section>
    </div>
  );
}

function Prazno() {
  return (
    <div className="rounded-[24px] bg-sivka px-6 py-12 text-center">
      <p className="text-[18px]">Još nemate porudžbina.</p>
      <Link href="/" className="mt-5 inline-flex h-12 items-center rounded-full bg-narandza px-6 font-medium text-white transition-colors hover:bg-narandza-tamna">Pogledajte ponudu</Link>
    </div>
  );
}

function Porudzbine({ porudzbine }: { porudzbine: PorudzbinaNaloga[] }) {
  return (
    <section>
      <Naslov opis="Za izmenu ili otkazivanje porudžbine pozovite nas.">Porudžbine</Naslov>
      {porudzbine.length ? (
        <ul className="space-y-3">
          {porudzbine.map((p) => (
            <li key={p.broj}>
              <KarticaPorudzbine p={p} />
            </li>
          ))}
        </ul>
      ) : (
        <Prazno />
      )}
    </section>
  );
}

function KarticaPorudzbine({ p }: { p: PorudzbinaNaloga }) {
  const [otvoreno, setOtvoreno] = useState(false);
  const s = STATUS[p.status];
  const vidljive = p.stavke.slice(0, 4);
  return (
    <article className="rounded-[24px] bg-white p-5 shadow-[0_0_0_1px_#e8ebed,0_8px_14px_-10px_rgba(35,40,50,.2)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div>
          <h3 className="text-[18px] font-medium">Porudžbina br. {p.broj}</h3>
          <p className="mt-0.5 text-[14px] font-light text-sivi-2">{datum(p.datum)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[13px] font-medium ${s.k}`}>{s.t}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-4">
        <ul className="flex gap-2" aria-label="Artikli">
          {vidljive.map((x) => (
            <li key={`${x.id}|${x.napomena ?? ""}`} className="relative size-14 overflow-hidden rounded-xl bg-sivka sm:size-16">
              <Image src={x.slika} alt={x.naziv} fill sizes="64px" className="object-contain p-1.5 mix-blend-multiply" />
            </li>
          ))}
          {p.stavke.length > vidljive.length && (
            <li className="grid size-14 place-items-center rounded-xl bg-sivka text-[14px] text-sivi-2 sm:size-16">+{p.stavke.length - vidljive.length}</li>
          )}
        </ul>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-right">
            <p className="text-[13px] font-light text-sivi-2">{brojArtikala(brojKomada(p))}</p>
            <p className="text-[20px] leading-tight font-semibold whitespace-nowrap text-narandza">{cena(p.ukupno)}</p>
          </div>
          <button
            type="button"
            onClick={() => setOtvoreno((o) => !o)}
            aria-expanded={otvoreno}
            className="flex h-11 items-center gap-1.5 rounded-full px-4 text-[15px] ring-1 ring-linija transition-colors hover:bg-sivka"
          >
            Detalji
            <ChevronDown aria-hidden className={`size-4 transition-transform ${otvoreno ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {otvoreno && (
        <div className="v2-chat-ulaz mt-5 border-t border-linija pt-5">
          <ul className="divide-y divide-linija">
            {p.stavke.map((x) => (
              <li key={`${x.id}|${x.napomena ?? ""}`} className="flex items-center gap-4 py-3">
                <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sivka">
                  <Image src={x.slika} alt="" fill sizes="56px" className="object-contain p-1.5 mix-blend-multiply" />
                </span>
                <span className="min-w-0 flex-1">
                  <Link href={x.link} className="line-clamp-2 text-[15px] leading-snug transition-colors hover:text-narandza">{x.naziv}</Link>
                  {x.napomena && <span className="mt-0.5 block text-[13px] text-sivi-2">{x.napomena}</span>}
                  <span className="mt-0.5 block text-[13px] font-light text-sivi-2 tabular-nums">{x.kolicina} × {cena(x.cena)}</span>
                </span>
                <span className="text-[15px] font-medium whitespace-nowrap tabular-nums">{cena(x.cena * x.kolicina)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 grid gap-x-8 gap-y-3 rounded-2xl bg-sivka p-4 text-[14px] sm:grid-cols-3">
            <div>
              <dt className="font-light text-sivi-2">Preuzimanje</dt>
              <dd className="mt-0.5">{p.preuzimanje}</dd>
            </div>
            <div>
              <dt className="font-light text-sivi-2">Plaćanje</dt>
              <dd className="mt-0.5">{p.placanje}</dd>
            </div>
            {p.adresa && (
              <div>
                <dt className="font-light text-sivi-2">Adresa</dt>
                <dd className="mt-0.5">{p.adresa}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </article>
  );
}

function Sacuvano({ tekst }: { tekst: string }) {
  if (!tekst) return null;
  return <p role="status" className="v2-chat-ulaz rounded-xl bg-[#e1f3ea] px-4 py-3 text-[14px] text-[#127a52]">{tekst}</p>;
}

function Podaci({ nalog }: { nalog: Nalog }) {
  const [uspeh, setUspeh] = useState("");
  const firmaJe = nalog.tip === "firma";
  const f = useForma(
    {
      firma: nalog.firma ?? "",
      pib: nalog.pib ?? "",
      ime: nalog.ime,
      email: nalog.email,
      telefon: nalog.telefon,
      adresa: nalog.adresa ?? "",
      mesto: nalog.mesto ?? "",
      postanskiBroj: nalog.postanskiBroj ?? "",
    },
    (v) => ({
      ...(firmaJe ? { firma: proveri.obavezno(v.firma, "Upišite naziv firme"), pib: proveri.pib(v.pib) } : {}),
      ime: proveri.obavezno(v.ime, "Upišite ime i prezime"),
      email: proveri.email(v.email),
      telefon: proveri.telefon(v.telefon),
      postanskiBroj: v.postanskiBroj.trim() && !/^\d{5}$/.test(v.postanskiBroj.trim()) ? "Poštanski broj ima 5 cifara" : undefined,
    }),
    async (v) => {
      setUspeh("");
      const r = await sacuvajPodatke({
        tip: nalog.tip,
        ime: v.ime.trim(),
        email: v.email.trim(),
        telefon: v.telefon.trim(),
        adresa: v.adresa.trim(),
        mesto: v.mesto.trim(),
        postanskiBroj: v.postanskiBroj.trim(),
        ...(firmaJe ? { firma: v.firma.trim(), pib: v.pib.trim() } : {}),
      });
      if (r.ok) setUspeh("Izmene su sačuvane.");
      return r;
    },
  );

  return (
    <section>
      <Naslov>Podaci i adresa</Naslov>
      <form ref={f.forma} onSubmit={f.posalji} noValidate className="max-w-[720px] space-y-8">
        <fieldset className="space-y-3">
          <legend className="mb-3 text-[15px] font-medium">{firmaJe ? "Firma i kontakt" : "Lični podaci"}</legend>
          {firmaJe && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Polje oznaka="Naziv firme" autoComplete="organization" {...f.polje("firma")} />
              <Polje oznaka="PIB" inputMode="numeric" maxLength={9} {...f.polje("pib")} />
            </div>
          )}
          <Polje oznaka="Ime i prezime" autoComplete="name" {...f.polje("ime")} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Polje oznaka="E-mail" type="email" autoComplete="email" {...f.polje("email")} />
            <Polje oznaka="Telefon" type="tel" autoComplete="tel" {...f.polje("telefon")} />
          </div>
        </fieldset>
        <fieldset className="space-y-3">
          <legend className="mb-3 text-[15px] font-medium">Adresa</legend>
          <Polje oznaka="Ulica i broj" autoComplete="street-address" {...f.polje("adresa")} />
          <div className="grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Polje oznaka="Mesto" autoComplete="address-level2" {...f.polje("mesto")} />
            <Polje oznaka="Poštanski broj" inputMode="numeric" maxLength={5} autoComplete="postal-code" {...f.polje("postanskiBroj")} />
          </div>
        </fieldset>
        <div className="space-y-3 sm:max-w-[320px]">
          <PorukaForme tekst={f.poruka} />
          <Sacuvano tekst={uspeh} />
          <DugmeSlanja salje={f.salje}>Sačuvaj izmene</DugmeSlanja>
        </div>
      </form>
    </section>
  );
}

function Lozinka() {
  const [uspeh, setUspeh] = useState("");
  const f = useForma(
    { trenutna: "", nova: "", ponovo: "" },
    (v) => ({
      trenutna: proveri.lozinka(v.trenutna),
      nova: proveri.novaLozinka(v.nova),
      ponovo: !v.ponovo ? "Ponovite novu lozinku" : v.ponovo !== v.nova ? "Lozinke se ne poklapaju" : undefined,
    }),
    async (v) => {
      setUspeh("");
      const r = await promeniLozinku({ trenutna: v.trenutna, nova: v.nova });
      if (r.ok) {
        setUspeh("Lozinka je promenjena.");
        f.setVrednosti({ trenutna: "", nova: "", ponovo: "" });
      }
      return r;
    },
  );

  return (
    <section>
      <Naslov opis="Nova lozinka mora imati najmanje 8 znakova.">Lozinka</Naslov>
      <form ref={f.forma} onSubmit={f.posalji} noValidate className="max-w-[460px] space-y-3">
        <PoljeLozinke oznaka="Trenutna lozinka" autoComplete="current-password" {...f.polje("trenutna")} />
        <PoljeLozinke oznaka="Nova lozinka" autoComplete="new-password" {...f.polje("nova")} />
        <PoljeLozinke oznaka="Ponovite novu lozinku" autoComplete="new-password" {...f.polje("ponovo")} />
        <div className="space-y-3 pt-3">
          <PorukaForme tekst={f.poruka} />
          <Sacuvano tekst={uspeh} />
          <DugmeSlanja salje={f.salje}>Promeni lozinku</DugmeSlanja>
        </div>
        <p className="pt-2 text-[14px] font-light text-sivi-2">
          Ne sećate se trenutne? <Link href="/zaboravljena-lozinka" className="font-medium text-narandza underline-offset-2 hover:underline">Pošaljite link za novu lozinku</Link>
        </p>
      </form>
    </section>
  );
}
