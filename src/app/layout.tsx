import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import VerzijeSwitch from "@/components/VerzijeSwitch";
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
  title: "Lisa Comerc - promet boja i lakova na veliko i malo",
  description:
    "Boje, lakovi, izolacije, alati, auto boje i program. Farbara Lisa Comerc, XI krajiške divizije 62, Beograd.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className={`${inter.variable} ${jakarta.variable} ${outfit.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        {children}
        <Suspense>
          <VerzijeSwitch />
        </Suspense>
      </body>
    </html>
  );
}
