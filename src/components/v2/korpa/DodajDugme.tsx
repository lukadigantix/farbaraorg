"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useKorpa, type StavkaKorpe } from "./Korpa";

export default function DodajDugme({ stavka, klasa }: { stavka: Omit<StavkaKorpe, "kolicina">; klasa: string }) {
  const { dodaj } = useKorpa();
  const [dodato, setDodato] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (t.current) clearTimeout(t.current);
    },
    [],
  );
  return (
    <button
      type="button"
      aria-label={`Dodaj u korpu: ${stavka.naziv}`}
      onClick={() => {
        dodaj(stavka);
        setDodato(true);
        if (t.current) clearTimeout(t.current);
        t.current = setTimeout(() => setDodato(false), 1400);
      }}
      className={klasa}
    >
      {dodato ? <Check aria-hidden className="size-[18px]" strokeWidth={2.75} /> : <ShoppingBag aria-hidden className="size-[18px]" strokeWidth={2} />}
    </button>
  );
}
