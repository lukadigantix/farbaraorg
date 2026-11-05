"use client";

import { posaljiLinkZaLozinku } from "@/lib/nalog";
import { DugmeSlanja, Polje, PorukaForme, proveri, useForma } from "./Forma";

export default function FormaLozinke() {
  const f = useForma({ email: "" }, (v) => ({ email: proveri.email(v.email) }), (v) => posaljiLinkZaLozinku(v.email.trim()));
  return (
    <form ref={f.forma} onSubmit={f.posalji} noValidate className="space-y-3">
      <Polje oznaka="E-mail" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" {...f.polje("email")} />
      <PorukaForme tekst={f.poruka} />
      <DugmeSlanja salje={f.salje}>Pošalji link</DugmeSlanja>
    </form>
  );
}
