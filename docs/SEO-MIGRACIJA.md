# SEO migracija farbara.org: WordPress → Next.js, 1:1

**Pročitaj ceo dokument pre nego što povučeš bilo šta sa starog sajta ili promeniš adrese.**

Cilj: Google ne sme da vidi novi sajt kao nov. Isti domen, iste adrese i isti sadržaj na njima, pa nema ponovnog indeksiranja od nule.

Pravilo za svaku adresu koju je stari sajt imao u sitemap-u (spisak u `docs/seo/stari-sitemap.tsv`):

| Šta je bilo | Šta mora biti na novom sajtu |
|---|---|
| strana koja postoji i na novom sajtu (proizvod, kategorija, O nama...) | **200 na istoj adresi**, kanonski link = ta adresa, bez `noindex` |
| strana koja ima ekvivalent na drugoj adresi (`/cart/` → `/korpa/`) | **301/308 u jednom skoku** na ekvivalent, koji vraća 200 |
| demo i smeće WordPress teme | **410 Gone** |

Nikad: 404, privremeno preusmerenje 302/307, lanac preusmerenja ni preusmerenje na početnu za nešto što ima ekvivalent.

Provera je automatska, vidi odeljak „Provera“ na kraju. **Sajt ne ide u produkciju dok provera ne prođe bez greške.**

---

## 1. Stanje 9.11.2026.

### Urađeno na frontendu

- `trailingSlash: true` u `next.config.ts`: sve adrese se završavaju kosom crtom, kao na WordPress-u (`/o-nama/`).
- `SAJT` u `src/data/sadrzaj.ts` (`https://www.farbara.org`, menja se preko `NEXT_PUBLIC_SAJT`) i `metadataBase` u `app/layout.tsx`.
- Verifikacija za Search Console (`verification.google` u `app/layout.tsx`) je ista kao na starom sajtu. **Ne brisati**, inače se gubi pristup Search Console nalogu.
- `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.jpg`.
- Schema: `HardwareStore` u layout-u, a `Product` + `BreadcrumbList` na strani proizvoda.
- Kanonski linkovi na svim javnim stranama, `noindex` na korpi, porudžbini, sačuvanim i nalozima.
- Iste adrese i 200 već imaju: `/`, `/o-nama/`, `/kontakt/`, `/dostava/`, `/nacin-placanja/`, `/pitanja-i-odgovori/`, `/moj-nalog/`.
- Preusmerenja ostalih WordPress strana (`/cart/`, `/checkout/`, `/shop/`, `/lista-omiljenih/`, `/privacy-policy-2/`...) su u `src/data/stare-adrese.json`, koji pravi `scripts/stare-adrese.mjs`, a čita `next.config.ts`.
- Stara pretraga `/?s=...` vodi na `/pretraga/?q=...`.
- **Naslovi kao na starom sajtu:** početna `Lisa Comerc - promet boja i lakova na veliko i malo`, ostale strane `Naziv - Farbara` (šablon `title.template` u `app/layout.tsx`; strane daju samo naziv).
- Za pojačanje SEO je takođe nešto već urađeno, vidi odeljak 11.

### PRIVREMENO (zamenjuje backend, vidi odeljke 3 i 4)

- Proizvodi su sada na `/proizvod/<naziv>-<id>/` i dolaze iz uzorka `src/data/katalog.json` (oko 510 artikala) ili uživo iz Store API-ja.
- `/artikli/<slug>/` trenutno **preusmerava** na tu novu adresu (`app/artikli/[slug]/route.ts`). To nije 1:1 i mora da se zameni.
- Stare kategorije `/kategorija/a/b/` trenutno **preusmeravaju** na 7 novih grupa (`/kategorija/<grupa>/?pod=...`). I to mora da se zameni.

---

## 2. Šta stari sajt ima

Snimak sitemap-a (Yoast, `https://www.farbara.org/sitemap_index.xml`) od 9.11.2026: `docs/seo/stari-sitemap.tsv`, sa putanjom, tipom, lastmod-om i prvom slikom. **Ovaj fajl se ne menja.** Stari sajt će jednom nestati, a ovo je jedini spisak onoga što Google zna.

| Tip | Broj | Primer | Pravilo |
|---|---|---|---|
| proizvod | 2.560 | `/artikli/auto-korektor/` | 200, ista adresa (odeljak 3) |
| kategorija-proizvoda | 171 | `/kategorija/autoprogram/kitevi/` | 200, ista adresa (odeljak 4) |
| strana | 16 | `/o-nama/`, `/cart/` | urađeno (odeljak 1) |
| atribut-boja / -dimenzije / -velicina / -marka-vozila | 27 / 26 / 43 / 40 | `/boje/bela/`, `/marka-vozila/audi/` | 301 (odeljak 5) |
| demo-teme, autor, objava, kategorija-bloga | 23 + 1 + 1 + 1 | `/portfolio/...`, `/woodmart_slider/...`, `/author/siteadmin/` | 410 (odeljak 6) |

Ostale činjenice o starom sajtu:

- **Glavni domen je `https://www.farbara.org`.** `https://farbara.org/` vraća 301 na www, a `http://` vraća **302** na https.
- Naslovi su oblika `AUTO KOREKTOR - Farbara`, `Kitevi - Farbara` i `O nama - Farbara`. Početna: `Lisa Comerc - promet boja i lakova na veliko i malo`. Meta opisa nema.
- Na starom sajtu je i Google Analytics `G-E7901RP87R`, a na nekim stranama i Tag Manager `GTM-NT3XG6B3`. Novi sajt ih **nema**. Da li se prenose, odlučuje Luka. Ako se prenose, mora i pristanak za kolačiće, a `app/politika-privatnosti/page.tsx` tada treba dopuniti (sada piše da nema kolačića za praćenje).
- Paginacija kategorija `/kategorija/.../page/2/` na starom sajtu vraća 500, pa nije indeksirana. Ipak je preusmeriti (odeljak 4).

---

## 3. Proizvodi: `/artikli/<slug>/`, ista adresa, 200

1. Povuci sve artikle u bazu, po pravilima iz odeljka 7.
2. Premesti stranu proizvoda iz `src/app/proizvod/[slug]/page.tsx` u **`src/app/artikli/[slug]/page.tsx`**. Obriši `src/app/artikli/[slug]/route.ts` i `adresaPoStarom` iz `src/lib/prodavnica.ts`.
3. `linkArtikla` u `src/data/v2.ts` postaje `` (slug) => `/artikli/${slug}/` ``.
   - **Slug je tačno WordPress `slug`**, nikad nov slug iz naziva. Stari slugovi imaju svoje oblike (`-2`, skraćenice, greške u kucanju), i baš njih je Google indeksirao.
   - Slug se uvek uzima iz baze, ne računa se.
4. Strana mora da radi za **svih 2.560** artikala iz `stari-sitemap.tsv`, uključujući:
   - **Artikle bez cene ili sa cenom 0.** Sada ih `nadjiArtikal` u `src/lib/artikal.ts` odbacuje (`cena >= 2`), pa bi vratili 404. Treba da prikažu „Cena na upit“ i telefon, sa statusom 200.
   - **Varijabilne artikle** (opcije, npr. Auto korektor sa markom vozila): jedna adresa, opcije na strani.
   - **Artikle kojih više nema u prodaji:** 301 na njihovu kategoriju. 410 samo ako kategorija nije poznata.
5. Privremene adrese `/proizvod/<naziv>-<id>/` nikad nisu bile javne, ali stoje u localStorage korpe i sačuvanih kod onih koji su testirali sajt. Ostavi jeftino preusmerenje `/proizvod/:x` → po id-ju (broj na kraju) → `/artikli/<slug>/`.
6. Kanonski link, `og:url` i `Product.offers.url` su `https://www.farbara.org/artikli/<slug>/`.
7. **Slike.** `og:image` i Google Slike pokazuju na `https://www.farbara.org/wp-content/uploads/...` (za 2.504 artikla u sitemap-u). Kad se WordPress ugasi, te adrese ne smeju da počnu da vraćaju 404:
   - najbolje: prenesi ceo `wp-content/uploads` i serviraj ga na **istim putanjama** (rewrite na storage)
   - ili: 301 sa svake stare putanje na novu adresu slike
   - posle toga ažuriraj `images.remotePatterns` u `next.config.ts`

## 4. Kategorije: stare adrese ostaju, 200

Novi sajt ima 7 grupa (`grupe` u `src/data/v2.ts`), a stari 171 kategoriju u stablu. Svaka stara adresa mora da ostane živa strana.

1. Napravi catch-all `src/app/kategorija/[...putanja]/page.tsx` i obriši `src/app/kategorija/[slug]/`.
2. **Grupe dobijaju adrese starih glavnih kategorija** (`putanjaGrupe` u `src/data/v2.ts` se menja):

   | Grupa | Adresa |
   |---|---|
   | Auto program | `/kategorija/autoprogram/` |
   | Molerski materijal | `/kategorija/molerski-material/` (greška u kucanju je original, ostaje) |
   | Alati | `/kategorija/alati/` |
   | Hidro i termo izolacija | `/kategorija/hidroiolacije/` (isto) |
   | Fasade | `/kategorija/fasade/` |
   | Silikoni, lepkovi, pur pene, trake | `/kategorija/silikoni-purpene/` |
   | Ostali program | `/kategorija/ostali-program/` (nova, nema starog para) |

3. **Svaka podkategorija** (`/kategorija/autoprogram/kitevi/`) prikazuje:
   - izgled svoje grupe (`Katalog.tsx`) sa unapred izabranim filterom
   - H1 = naziv stare kategorije
   - naslov `<Naziv> - Farbara`
   - kanonski link = njena adresa
   - **artikle koji su na starom sajtu bili u toj kategoriji** (i u podkategorijama, kao na WordPress-u), iz baze

   Koja stara kategorija ide u koju grupu i stavku već je rešeno u `scripts/mapa-kategorija.mjs` i u funkciji `cilj()` u `scripts/stare-adrese.mjs`. Iskoristi istu logiku, nemoj praviti novu.

   Ako kategorija nema nijedan artikal: i dalje 200, sa porukom i linkovima na grupu, ili 301 na nadređenu kategoriju. Nikad 404.
4. Iz `scripts/stare-adrese.mjs` izbaci preusmerenja kategorija (ostaju samo strane iz niza `strane`) i ponovo pokreni skriptu.
5. Paginaciju `/kategorija/:putanja*/page/:n/` preusmeri trajno na `/kategorija/:putanja*/`.
6. Filteri u adresi (`?pod=`, `?brend=`, `?od=`...) ne menjaju kanonski link. To već radi.

## 5. Atributi: 301

`/boje/<x>/`, `/dimenzije/<x>/`, `/velicina/<x>/` i `/marka-vozila/<x>/` (136 adresa) na novom sajtu nemaju svoje strane.

- `/marka-vozila/<x>/` → 301 na artikal koji koristi taj atribut. Proveri u podacima; očekivano je `/artikli/auto-korektor/`.
- `/boje/`, `/dimenzije/` i `/velicina/` → 301 na kategoriju u kojoj je većina artikala sa tim atributom. Izračunaj iz povučenih podataka i dodaj u `scripts/stare-adrese.mjs`.
- Ako nijedan artikal nema taj atribut: 410.

## 6. Demo i smeće WordPress teme: 410

Vraćaju 410 (route handler ili `proxy.ts`; pogledaj `node_modules/next/dist/docs/`, Next 16 je drugačiji):

- `/portfolio/*`, `/woodmart_slider/*`, `/project-cat/*`, `/author/*`, `/category/*`
- `/novi-sajt-poceo-sa-radom/`
- `/feed/` i `/*/feed/`

Ovo se ne preusmerava na početnu (Google to računa kao „soft 404“).

Izuzetak: `/portfolio/` i `/home-base/` su strane, i one su već preusmerene na `/` u `stare-adrese.json`. Ostaje tako.

## 7. Povlačenje proizvoda sa starog sajta: PAZI

- **Stari sajt je živa prodavnica klijenta.** Zahtevi idu redom, jedan po jedan, sa pauzom (oko 300 ms), `per_page=100`, i sa `User-Agent` zaglavljem. Ništa paralelno.
- **Povlači se jednom, u bazu.** Nikad pri svakom buildu ili zahtevu, i nikad iz frontenda. Za ponovno povlačenje pitaj Luku.
- Izvori (javni, bez ključa):
  - `/wp-json/wc/store/v1/products?per_page=100&page=N`: naziv, slug, permalink, sku, cene, slike, kategorije, atributi, varijacije, opis. `X-WP-Total` = 2.560.
  - `/wp-json/wp/v2/product?per_page=100&page=N&_fields=id,slug,modified,link,status`: datum izmene za `lastModified` u sitemap-u.
  - `/wp-json/wc/store/v1/products/categories?per_page=100&page=N`: 171 kategorija sa `parent` i `permalink`.
- Za svaki artikal sačuvaj:
  - WordPress `id`
  - **`slug` tačno kakav jeste**
  - `permalink`
  - naziv (sirov i sređen preko `lepNaziv` iz `src/lib/obrada.mjs`)
  - sku, cenu u dinarima
  - originalne URL-ove slika
  - id-jeve kategorija, atribute i varijacije
  - opis i kratak opis
  - `modified`
- Cene su u Store API-ju u najmanjoj jedinici: `price / 10 ** currency_minor_unit` (vidi `mapiraj` u `src/lib/obrada.mjs`).
- **Posle povlačenja uporedi sa `docs/seo/stari-sitemap.tsv`:**
  - svaka `/artikli/...` i svaka `/kategorija/...` putanja mora imati zapis u bazi
  - ako ne poklapa, stani i proveri. Ne izmišljaj slug.
- Posle toga `katalog.json` više nije izvor. `src/lib/artikal.ts`, `src/lib/prodavnica.ts`, strana kategorije i `app/sitemap.ts` čitaju bazu.

## 8. Sitemap, robots, meta

- `app/sitemap.ts` sadrži:
  - sve proizvode (`/artikli/<slug>/`, `lastModified` iz `modified`)
  - sve kategorije (stare adrese)
  - javne strane

  Sve adrese moraju imati kosu crtu na kraju.
- Stare adrese sitemap-a preusmeri na `/sitemap.xml`: `/sitemap_index.xml`, `/wp-sitemap.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`, `/product-sitemap.xml`, `/product-sitemap2.xml`, `/product-sitemap3.xml`, `/product_cat-sitemap.xml` i ostale `*-sitemap.xml` iz `stari-sitemap.tsv`.
- `robots.ts` je gotov. Ne zatvaraj `/artikli/` ni `/kategorija/`.
- Naslovi: strana daje samo naziv (`title: p.naziv`), a sufiks ` - Farbara` dodaje šablon. To je isto kao na starom sajtu, ne menjati.
- Opis (`description`) praviti iz opisa artikla, do 155 znakova. To već radi za artikle iz uzorka.
- Schema `Product`: kad baza zna stanje, dodaj `offers.availability`.

## 9. Dan prelaska

1. Domen ostaje **isti**: `https://www.farbara.org`, sa www. `farbara.org` vraća 301/308 na www, a `http://` vraća **301/308** na https (stari sajt je imao 302).
2. Pre prebacivanja DNS-a pokreni proveru na novom sajtu (preview adresa) **bez `--uzorak`**. Mora biti 0 grešaka.
3. Posle prebacivanja ponovo pokreni proveru na `https://www.farbara.org`.
4. U Search Console (isti nalog, verifikacija je preneta):
   - pošalji `https://www.farbara.org/sitemap.xml`
   - proveri nekoliko proizvoda kroz „URL Inspection“
   - 2 do 4 nedelje prati „Pages“ i „Crawl stats“
5. WordPress ne gasiti dok slike nisu prenete (odeljak 3, tačka 7).
6. Preusmerenja ostaju **trajno**, nikad ih ne brisati.

## 10. Otvorene odluke (Luka i klijent)

### Google Analytics i Tag Manager

Na starom sajtu su GA4 `G-E7901RP87R` (na svim stranama) i Tag Manager `GTM-NT3XG6B3` (na nekim stranama). Novi sajt ih zasad **nema**.

| Opcija | Šta dobijamo | Šta mora uz to |
|---|---|---|
| **A. Preneti samo GA4 `G-E7901RP87R`** (preporuka) | Poseta se meri bez prekida, na istom nalogu. Odmah se vidi da li je prelazak oborio posete i sa kojih strana. | Pristanak za kolačiće pre učitavanja GA (Google Consent Mode v2) i dopuna `app/politika-privatnosti/page.tsx` |
| B. GA4 i Tag Manager | Isto kao A, plus sve što je klijent podesio u Tag Manageru | Isto kao A. Pre toga treba videti šta je u kontejneru, jer ako GTM već šalje GA4, posete se broje duplo |
| C. Bez analitike | Nema kolačića ni pristanka | Gubi se poređenje „pre i posle“. Ostaje samo Search Console (klikovi i pozicije iz Google pretrage), što radi bez kolačića |

Ako se izabere A ili B:
- skripta se učitava preko `next/script` (`strategy="afterInteractive"`) tek posle pristanka
- ID ide u `.env` (`NEXT_PUBLIC_GA_ID`), ne u kod
- u politici privatnosti odeljci „Šta ostaje u vašem browseru“ i „Kome ih dajemo“ dobijaju Google Analytics

Search Console radi u svakom slučaju, jer je verifikacija već preneta.

### Ostalo za klijenta

- Radno vreme radnje, e-mail i uslovi dostave i plaćanja. Kad stignu, idu i u schema `HardwareStore` (`openingHoursSpecification`, `email`), pa Google može da ih prikaže uz radnju.
- Da li klijent ima Google Business Profile (Google mape). Naziv, adresa i telefon na sajtu treba da budu identični onima tamo.

## 11. Pojačanje SEO, ne samo 1:1

### Urađeno (9.11.2026)

- **Slike proizvoda imaju alt sa nazivom artikla** (`ProizvodKartica`, galerija, slika kategorije), da ih Google Slike povezuje sa nazivom.
- **Opis (`description`) na svakoj javnoj strani.** Za kategorije se slaže od stvarnih podkategorija i usluge grupe (`app/kategorija/[slug]/page.tsx`), a ne iz izmišljenog teksta.
- **Proizvodi van uzorka imaju svoj naslov i opis.** Ranije su dobijali naslov početne strane, pa bi preko 2.000 strana imalo isti naslov. `nadjiArtikal` je u `React.cache`, pa metadata i strana dele jedan poziv.
- **Schema:**
  - `WebSite`: ime sajta u Google rezultatima ostaje „Farbara“
  - `HardwareStore` sa `hasMap`
  - `Product` sa `itemCondition`
  - `BreadcrumbList` na proizvodu i kategoriji
  - `FAQPage` na Pitanjima i odgovorima

  Sve ide kroz `src/lib/seo.tsx` (`JsonLd`, `putanjaSchema`, `tekstIzCvora`).
- **Open Graph** za kategorije i proizvode: naslov, opis i slika kad se link deli.

### Za backend, posle povlačenja

- `Product.offers.availability` (`InStock` / `OutOfStock`), čim baza zna stanje. Bez toga Google ne prikazuje proizvod u besplatnim listinzima prodavnica.
- Besplatni listinzi u Google Shopping-u (Merchant Center): feed se pravi iz baze (naziv, cena, slika, stanje, adresa artikla). Odluka klijenta, ali je velika dobit za prodavnicu boja.
- `sitemap.ts` sa slikama artikala (`images` polje), da Google Slike nastave da ih vide i posle gašenja WordPress-a.
- Strane kategorija: kratak uvodni tekst ispod naslova, od klijenta. Ne izmišljati ga.
- Interni linkovi: na strani proizvoda „Slični proizvodi“ iz iste kategorije u bazi (sada iz uzorka).
- Brzina (Core Web Vitals) je deo rangiranja. Slike artikala preko `next/image` sa tačnim `sizes`. Ne vraćati velike originale direktno.

### Pravilo

Ništa od ovoga ne sme da promeni adresu postojeće strane, a provera iz odeljka „Provera“ mora da prolazi i posle svake izmene.

## Provera

```
node scripts/proveri-stare-adrese.mjs                          # http://localhost:3000, svih 2.910 adresa
node scripts/proveri-stare-adrese.mjs --uzorak=20              # brzo: samo 20 proizvoda
node scripts/proveri-stare-adrese.mjs https://www.farbara.org  # produkcija
```

Skripta prolazi kroz `docs/seo/stari-sitemap.tsv`, proverava pravila iz tabele na vrhu i greške upisuje u `docs/seo/provera-rezultat.tsv`.

Stanje 9.11.2026 (`--uzorak=10`): prolaze sve strane. Padaju proizvodi i kategorije (preusmeravaju, a treba 200), atributi i demo strane (404, a treba 301 ili 410). To su upravo odeljci 3 do 6.
