"use client";

import { useState } from "react";
import Link from "next/link";
import { prijaviSe } from "@/lib/nalog";
import { DugmeSlanja, Polje, PoljeLozinke, PorukaForme, proveri, useForma } from "./Forma";

export default function FormaPrijave() {
  const [zapamti, setZapamti] = useState(true);
  const f = useForma({ email: "", lozinka: "" }, (v) => ({ email: proveri.email(v.email), lozinka: proveri.lozinka(v.lozinka) }), (v) => prijaviSe({ email: v.email.trim(), lozinka: v.lozinka }));
  return (
    <form ref={f.forma} onSubmit={f.posalji} noValidate className="space-y-3">
      <Polje oznaka="E-mail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" {...f.polje("email")} />
      <PoljeLozinke oznaka="Lozinka" autoComplete="current-password" {...f.polje("lozinka")} />
      <div className="pt-1">
        <Link href="/v2/zaboravljena-lozinka" className="text-[15px] font-medium text-narandza underline-offset-2 hover:underline">Zaboravili ste lozinku?</Link>
      </div>
      <div className="flex items-center justify-between pb-2">
        <span id="zapamti-me" className="text-[15px] font-light text-[#4d5361]">Zapamti me na ovom uređaju</span>
        <button type="button" role="switch" aria-checked={zapamti} aria-labelledby="zapamti-me" onClick={() => setZapamti((z) => !z)} className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${zapamti ? "bg-narandza" : "bg-[#d5d8dc]"}`}>
          <span aria-hidden className={`absolute top-1 left-1 size-6 rounded-full bg-white shadow-sm transition-transform ${zapamti ? "translate-x-6" : ""}`} />
        </button>
      </div>
      <PorukaForme tekst={f.poruka} />
      <DugmeSlanja salje={f.salje}>Prijavi se</DugmeSlanja>
    </form>
  );
}
