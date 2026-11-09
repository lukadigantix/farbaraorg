// Javna adresa sajta (sitemap, OG slike, kanonski linkovi). Na drugom domenu se menja kroz NEXT_PUBLIC_SAJT.
export const SAJT = (process.env.NEXT_PUBLIC_SAJT ?? "https://www.farbara.org").replace(/\/$/, "");

export const firma = {
  naziv: "Lisa Comerc d.o.o.",
  adresa: "XI krajiške divizije 62, Beograd",
  mobilni: "+381 62 11-31-773",
  fiksni: "+381 11 2322 856",
  pib: "100226301",
  maticni: "07562594",
  registracija: "BD 52323",
  delatnost: "52460",
  racun: "205-18334-85",
};


export const brendovi = [
  { naziv: "Maxima", slika: "/img/brendovi/maxima.svg", h: "h-6 lg:h-7" },
  { naziv: "JUB", slika: "/img/brendovi/jub.svg", h: "h-8 lg:h-9" },
  { naziv: "Zvezda", slika: "/img/brendovi/zvezda.svg", h: "h-7 lg:h-8" },
  { naziv: "Tolsen", slika: "/img/brendovi/tolsen.svg", h: "h-6 lg:h-7" },
  { naziv: "Beorol", slika: "/img/brendovi/beorol.svg", h: "h-9 lg:h-10" },
  { naziv: "Einhell", slika: "/img/brendovi/einhell.svg", h: "h-8 lg:h-9" },
];
