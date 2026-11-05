import Anthropic from "@anthropic-ai/sdk";
import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { SISTEM } from "@/lib/asistent";
import { pretraziProdavnicu, type ArtikalProdavnice } from "@/lib/prodavnica";

// Claude Opus 5.5 je podrazumevan; za jeftiniji rad dovoljno je promeniti ovaj red
const MODEL = "claude-opus-5-5";

const Zahtev = z.object({
  poruke: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(40),
});

// Javna ruta troši novac po pozivu. Ova granica važi po procesu; na produkciji ide i ograničenje na hostingu.
const LIMIT = 15;
const pozivi = new Map<string, number[]>();
function prekoLimita(ip: string) {
  const sada = Date.now();
  const skorasnji = (pozivi.get(ip) ?? []).filter((t) => sada - t < 60_000);
  if (pozivi.size > 5000) pozivi.clear();
  pozivi.set(ip, [...skorasnji, sada]);
  return skorasnji.length >= LIMIT;
}

export type Dogadjaj =
  | { t: "tekst"; v: string }
  | { t: "ponisti" }
  | { t: "trazi"; v: string }
  | { t: "proizvodi"; v: Omit<ArtikalProdavnice, "opis">[] }
  | { t: "predlozi"; v: string[] }
  | { t: "greska" }
  | { t: "kraj" };

export async function POST(req: NextRequest) {
  const izvor = req.headers.get("origin");
  if (izvor && new URL(izvor).host !== req.headers.get("host")) return new Response(null, { status: 403 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "lokalno";
  if (prekoLimita(ip)) return Response.json({ greska: "limit" }, { status: 429 });

  const telo = Zahtev.safeParse(await req.json().catch(() => null));
  if (!telo.success || telo.data.poruke.at(-1)?.role !== "user") return Response.json({ greska: "zahtev" }, { status: 400 });
  if (telo.data.poruke.at(-1)!.content.length > 1000) return Response.json({ greska: "zahtev" }, { status: 400 });
  if (!process.env.ANTHROPIC_API_KEY) return Response.json({ greska: "kljuc" }, { status: 503 });

  const client = new Anthropic();
  const poslednjih = telo.data.poruke.slice(-20);
  const pocetak = poslednjih.findIndex((p) => p.role === "user");

  const koder = new TextEncoder();
  // Kupac zatvori chat ili klikne „zaustavi": prekida se i poziv modelu, da se ne plaća uzalud
  const prekid = new AbortController();
  const telom = new ReadableStream<Uint8Array>({
    cancel() {
      prekid.abort();
    },
    async start(kontroler) {
      const posalji = (d: Dogadjaj) => {
        if (!prekid.signal.aborted) kontroler.enqueue(koder.encode(JSON.stringify(d) + "\n"));
      };
      const nadjeni = new Map<number, ArtikalProdavnice>();

      const prikaziArtikle = (id: number[]) => {
        const artikli = id.flatMap((i) => nadjeni.get(i) ?? []);
        if (artikli.length) posalji({ t: "proizvodi", v: artikli.map(({ opis: _opis, ...a }) => a) });
        return artikli.length;
      };

      const pretrazi = betaZodTool({
        name: "pretrazi_proizvode",
        description: "Traži artikle u prodavnici po pojmu iz naziva. Vraća do 8 artikala sa id, nazivom, šifrom, kategorijom, cenom u RSD i opisom.",
        inputSchema: z.object({ pojam: z.string().min(2).max(60).describe("Kratak pojam, bez kvačica, npr. jupol ili hs lak") }),
        eager_input_streaming: true,
        run: async ({ pojam }) => {
          posalji({ t: "trazi", v: pojam });
          const artikli = await pretraziProdavnicu(pojam);
          artikli.forEach((a) => nadjeni.set(a.id, a));
          if (artikli.length === 0) return `Nema artikala za pojam "${pojam}".`;
          return JSON.stringify(artikli.map((a) => ({ id: a.id, naziv: a.naziv, sifra: a.sifra, kategorija: a.kategorija, cena_rsd: a.cena, opis: a.opis })));
        },
      });

      const UlazPrikaza = z.object({ id: z.array(z.number().int()).min(1).max(4) });
      const prikazi = betaZodTool({
        name: "prikazi_proizvode",
        description: "Prikazuje kupcu kartice sa slikom i cenom za artikle pronađene pretragom u ovom odgovoru.",
        inputSchema: UlazPrikaza,
        eager_input_streaming: true,
        run: async ({ id }) => {
          const n = prikaziArtikle(id);
          return n ? `Prikazano artikala: ${n}.` : "Ti id-jevi nisu iz pretrage. Prvo pretraži.";
        },
      });

      const UlazPredloga = z.object({ odgovori: z.array(z.string().min(2).max(42)).min(2).max(3) });
      const predlozi = betaZodTool({
        name: "predlozi_odgovore",
        description: "Prikazuje kupcu 2 do 3 dugmeta sa kratkim sledećim porukama, napisanim iz ugla kupca. Pozovi na kraju odgovora.",
        inputSchema: UlazPredloga,
        eager_input_streaming: true,
        run: async ({ odgovori }) => {
          posalji({ t: "predlozi", v: odgovori });
          return "Prikazano.";
        },
      });

      let runner = client.beta.messages.toolRunner(
        {
          model: MODEL,
          max_tokens: 2000,
          max_iterations: 6,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          output_config: { effort: "low" },
          system: [{ type: "text", text: SISTEM, cache_control: { type: "ephemeral" } }],
          tools: [pretrazi, prikazi, predlozi],
          messages: poslednjih.slice(pocetak),
          stream: true,
        },
        { signal: prekid.signal },
      );

      try {
        // JSON alata koji SDK ne može da pročita ponavlja se najviše dva puta; greške API-ja ne.
        for (let pokusaj = 0; ; pokusaj++) {
          try {
            petlja: for await (const tok of runner) {
              for await (const d of tok) {
                if (d.type === "content_block_delta" && d.delta.type === "text_delta") posalji({ t: "tekst", v: d.delta.text });
                // Rezervni model nastavlja od početka, pa kupac ne treba da vidi odbijeni deo
                if (d.type === "content_block_start" && d.content_block.type === "fallback") posalji({ t: "ponisti" });
              }
              const poruka = await tok.finalMessage();
              pokusaj = 0;
              if (poruka.stop_reason === "refusal") {
                posalji({ t: "greska" });
                break petlja;
              }
              const alati = poruka.content.filter((b) => b.type === "tool_use");
              if (poruka.stop_reason === "max_tokens" && alati.length) break petlja;

              // Kad su ostali samo prikazni alati, odgovor je gotov: bez još jednog plaćenog poziva modelu
              if (alati.length && alati.every((b) => b.name === "prikazi_proizvode" || b.name === "predlozi_odgovore")) {
                for (const b of alati) {
                  if (b.name === "prikazi_proizvode") {
                    const ulaz = UlazPrikaza.safeParse(b.input);
                    if (ulaz.success) prikaziArtikle(ulaz.data.id);
                  } else {
                    const ulaz = UlazPredloga.safeParse(b.input);
                    if (ulaz.success) posalji({ t: "predlozi", v: ulaz.data.odgovori });
                  }
                }
                break petlja;
              }
            }
            break;
          } catch (e) {
            if (e instanceof Anthropic.APIError || pokusaj >= 2) throw e;
            runner = client.beta.messages.toolRunner({ ...runner.params }, { signal: prekid.signal });
          }
        }
        posalji({ t: "kraj" });
      } catch (e) {
        if (prekid.signal.aborted) return;
        if (e instanceof Anthropic.RateLimitError) console.error("Asistent: limit API-ja");
        else if (e instanceof Anthropic.AuthenticationError) console.error("Asistent: neispravan API ključ");
        else if (e instanceof Anthropic.APIError) console.error("Asistent: API greška", e.status, e.message);
        else console.error("Asistent:", e);
        posalji({ t: "greska" });
      } finally {
        if (!prekid.signal.aborted) kontroler.close();
      }
    },
  });

  return new Response(telom, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" } });
}
