import { isValidElement, type ReactNode } from "react";
import { SAJT } from "@/data/sadrzaj";

// Strukturirani podaci za Google (schema.org); „<“ se menja da tekst ne može da zatvori <script>
export function JsonLd({ podaci }: { podaci: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(podaci).replace(/</g, "\\u003c") }} />;
}

export const apsolutna = (putanja: string) => (/^https?:\/\//.test(putanja) ? putanja : `${SAJT}${putanja}`);

export function putanjaSchema(koraci: { naziv: string; putanja: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: koraci.map((k, i) => ({ "@type": "ListItem", position: i + 1, name: k.naziv, item: apsolutna(k.putanja) })),
  };
}

// Čist tekst iz JSX-a (npr. odgovor sa linkom), za schema gde HTML ne sme
export function tekstIzCvora(cvor: ReactNode): string {
  if (cvor == null || typeof cvor === "boolean") return "";
  if (typeof cvor === "string" || typeof cvor === "number") return String(cvor);
  if (Array.isArray(cvor)) return cvor.map(tekstIzCvora).join("");
  if (isValidElement<{ children?: ReactNode }>(cvor)) return tekstIzCvora(cvor.props.children);
  return "";
}
