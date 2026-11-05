"use client";

import { useState } from "react";
import Image from "next/image";

export default function Galerija({ slike, naziv, puna }: { slike: string[]; naziv: string; puna?: boolean }) {
  const [aktivna, setAktivna] = useState(0);
  const prikaz = (i: number) => (puna && i === 0 ? "object-cover" : "object-contain p-[8%] mix-blend-multiply");
  return (
    <div className="lg:sticky lg:top-[88px] lg:self-start">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-sivka lg:aspect-square">
        <Image key={slike[aktivna]} src={slike[aktivna]} alt={naziv} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className={`v2-pretraga-pozadina ${prikaz(aktivna)}`} />
      </div>
      {slike.length > 1 && (
        <ul className="v2-karusel mt-3 flex gap-2 overflow-x-auto">
          {slike.map((s, i) => (
            <li key={s} className="shrink-0">
              <button type="button" aria-label={`Slika ${i + 1}`} aria-pressed={i === aktivna} onClick={() => setAktivna(i)} className={`relative block size-20 overflow-hidden rounded-xl bg-sivka ring-offset-2 ${i === aktivna ? "ring-2 ring-ugalj" : "hover:opacity-80"}`}>
                <Image src={s} alt="" fill sizes="80px" className={prikaz(i)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
