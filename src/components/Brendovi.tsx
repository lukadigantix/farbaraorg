import { brendovi } from "@/data/sadrzaj";

export default function Brendovi() {
  // Dve iste polovine od po 4 kruga logoa: traka ide do -50% i nastavlja se bez prekida na svakoj širini
  const krug = brendovi.length;
  const red = Array.from({ length: 8 }, () => brendovi).flat();
  return (
    <section className="pt-(--razmak)" aria-label="Brendovi">
      <div className="omot flex justify-center">
        <p className="nadnaslov text-center">Zastupamo domaće i strane proizvođače</p>
      </div>
      <div className="traka-omot mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <ul className="traka flex w-max items-center py-6">
          {red.map((b, i) => (
            <li key={i} aria-hidden={i >= krug} className="pr-16 lg:pr-24">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.slika} alt={i >= krug ? "" : b.naziv} className={`w-auto max-w-none transition-transform duration-300 hover:scale-110 ${b.h}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
