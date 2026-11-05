import { Navigation } from "lucide-react";
import { firma } from "@/data/sadrzaj";
import mapa from "@/data/mapa.json";

const PUT = "https://www.google.com/maps/dir/?api=1&destination=Farbara%20LISA%20COMERC%20d.o.o.%2C%2011.%20kraji%C5%A1ke%20divizije%2062%2C%20Beograd";
const ISTAKNUTA = "Jedanaeste krajiške divizije";

// Mapa je nacrtana iz OpenStreetMap podataka (scripts/napravi-mapu.py), bez ugrađene Google mape
export default function Mapa() {
  const [px, py] = mapa.pin;
  return (
    <section aria-label={`Mapa: ${firma.naziv}, ${firma.adresa}`} className="mt-8 lg:mt-10">
      <div className="relative h-[clamp(380px,38vw,640px)] overflow-hidden bg-[#f5f3ed]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/v2/mapa-lokacija.svg" alt="" className="absolute inset-0 size-full object-cover" />
        <svg aria-hidden viewBox={`0 0 ${mapa.sir} ${mapa.vis}`} preserveAspectRatio="xMidYMid slice" className="v2-mapa absolute inset-0 size-full">
          <defs>
            {mapa.natpisi.map((n, i) => (
              <path key={n.naziv} id={`mapa-ulica-${i}`} d={n.d} />
            ))}
          </defs>
          {mapa.natpisi.map((n, i) => (
            <text key={n.naziv} className={n.naziv === ISTAKNUTA ? "v2-mapa-glavna" : n.rang <= "b" ? "v2-mapa-velika" : undefined} dy="0.35em">
              <textPath href={`#mapa-ulica-${i}`} startOffset={n.naziv === "Ibarski put" ? "14%" : "50%"} textAnchor="middle">{n.naziv}</textPath>
            </text>
          ))}
          <path d={mapa.zgrada ?? ""} fill="#ea5530" stroke="#fff" strokeWidth="5" />
          <g transform={`translate(${px} ${py}) scale(1.35)`}>
            <ellipse cx="0" cy="3" rx="22" ry="8" fill="#232832" opacity=".28" />
            <path className="v2-mapa-igla" d="M0 0C-9-22-44-44-44-82a44 44 0 0 1 88 0C44-44 9-22 0 0Z" fill="#ea5530" stroke="#fff" strokeWidth="6" />
            <circle cy="-82" r="16" fill="#fff" />
          </g>
        </svg>
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="absolute right-3 bottom-2 z-10 text-[11px] text-[#6d7176] hover:underline">© OpenStreetMap</a>

        <div className="pointer-events-none absolute inset-0 hidden items-center lg:flex">
          <div className="v2-omot">
            <Kartica className="pointer-events-auto w-[360px] shadow-[0_24px_50px_-24px_rgb(35_40_50/.45)]" />
          </div>
        </div>
      </div>
      <div className="v2-omot lg:hidden">
        <Kartica className="-mt-14 relative z-10 shadow-[0_18px_40px_-20px_rgb(35_40_50/.45)]" />
      </div>
    </section>
  );
}

function Kartica({ className }: { className: string }) {
  return (
    <div className={`rounded-[24px] rounded-br-[48px] bg-white p-6 sm:p-7 ${className}`}>
      <p className="text-[22px] leading-tight font-[550] tracking-[-0.02em]">Farbara Lisa Comerc</p>
      <p className="mt-2 text-[16px] leading-snug font-light text-[#4d5361]">{firma.adresa}</p>
      <a href={PUT} target="_blank" rel="noreferrer" className="mt-5 inline-flex h-12 items-center gap-2.5 rounded-full bg-narandza px-6 text-[15px] font-medium text-white transition-colors hover:bg-narandza-tamna">
        <Navigation aria-hidden className="size-4" strokeWidth={2} />
        Kako do nas
      </a>
    </div>
  );
}
