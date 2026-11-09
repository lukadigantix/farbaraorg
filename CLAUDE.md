@AGENTS.md

# Farbara Lisa Comerc (farbara.org)

Redizajn WordPress/WooCommerce prodavnice u Next.js. Frontend je gotov, sledi backend.

## Pre bilo kakvog posla sa podacima ili adresama

**Pročitaj `docs/SEO-MIGRACIJA.md`** pre nego što:
- povučeš proizvode ili bilo šta drugo sa starog sajta (www.farbara.org je živa prodavnica klijenta),
- promeniš adresu bilo koje strane, rutu ili `linkArtikla` / `putanjaGrupe`,
- diraš `next.config.ts` (preusmerenja, `trailingSlash`), `app/sitemap.ts`, `app/robots.ts` ili metadata.

Sajt se seli 1:1: svaka stara adresa iz `docs/seo/stari-sitemap.tsv` mora da radi na novom sajtu. Provera: `node scripts/proveri-stare-adrese.mjs`.

## Tačke za povezivanje sa backendom

- `src/lib/nalog.ts`: prijava, registracija, lozinka, Moj nalog (`trenutniNalog`, `sacuvajPodatke`...). Sada vraćaju „nije povezano“.
- `src/lib/porudzbina.ts`: slanje porudžbine.
- `src/lib/prodavnica.ts`, `src/lib/artikal.ts`: pretraga i artikli. Sada čitaju stari Store API i uzorak `src/data/katalog.json`.
- `app/api/chat/route.ts`: chat. Traži `ANTHROPIC_API_KEY` u `.env.local`.
- Načini plaćanja i dostave još nisu odlučeni (strane `/dostava/` i `/nacin-placanja/` su prazne).

## Napomene

- Tekst sajta je na srpskom (latinica). Bez tipografskih crtica (– —), samo obična „-“.
- Ne pokreći `next build` dok radi `next dev`.
