import type { Metadata } from "next";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import Zaglavlje from "@/components/v2/Zaglavlje";
import Podnozje from "@/components/v2/Podnozje";
import Asistent from "@/components/v2/Asistent";
import { KorpaProvider } from "@/components/v2/korpa/Korpa";
import { SacuvanoProvider } from "@/components/v2/sacuvano/Sacuvano";
import { firma, SAJT } from "@/data/sadrzaj";
import { JsonLd } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  // Isto kao na starom sajtu: početna ima svoj naslov, ostale strane „Naziv - Farbara“
  title: { default: "Lisa Comerc - promet boja i lakova na veliko i malo", template: "%s - Farbara" },
  description:
    "Boje, lakovi, izolacije, alati, auto boje i program. Farbara Lisa Comerc, XI krajiške divizije 62, Beograd.",
  metadataBase: new URL(SAJT),
  applicationName: "Farbara Lisa Comerc",
  openGraph: { siteName: "Farbara Lisa Comerc", locale: "sr_RS", type: "website" },
  // Ista oznaka kao na starom sajtu: bez nje se gubi pristup Search Console nalogu za farbara.org
  verification: { google: "2HjHkman3PdBKmld9Agt9FgXbkoO9epf6Eu-KBxfYGk" },
};

// Podaci o radnji za Google (adresa, telefoni, PIB); sve iz data/sadrzaj.ts
const radnja = {
  "@context": "https://schema.org",
  "@type": "HardwareStore",
  "@id": `${SAJT}/#radnja`,
  name: "Farbara Lisa Comerc",
  legalName: firma.naziv,
  url: SAJT,
  logo: `${SAJT}/img/logo.svg`,
  image: `${SAJT}/opengraph-image.jpg`,
  telephone: [firma.fiksni, firma.mobilni],
  vatID: firma.pib,
  foundingDate: "1991",
  address: { "@type": "PostalAddress", streetAddress: "XI krajiške divizije 62", addressLocality: "Beograd", addressCountry: "RS" },
  hasMap: "https://www.google.com/maps/search/?api=1&query=Farbara%20LISA%20COMERC%20d.o.o.%2C%2011.%20kraji%C5%A1ke%20divizije%2062%2C%20Beograd",
  currenciesAccepted: "RSD",
};

// Ime sajta u Google rezultatima (pod nazivom se prikazuje „Farbara“, kao do sada)
const sajt = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SAJT}/#sajt`,
  name: "Farbara",
  alternateName: ["Farbara Lisa Comerc", "Lisa Comerc"],
  url: `${SAJT}/`,
  inLanguage: "sr",
  publisher: { "@id": `${SAJT}/#radnja` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className={`${inter.variable} ${jakarta.variable} ${outfit.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd podaci={[sajt, radnja]} />
        <KorpaProvider>
          <SacuvanoProvider>
            <div className="v2 flex min-h-dvh flex-col">
              <Zaglavlje />
              <main className="flex-1">{children}</main>
              <Podnozje />
              <Asistent />
            </div>
          </SacuvanoProvider>
        </KorpaProvider>
      </body>
    </html>
  );
}
