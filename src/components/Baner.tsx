import Image from "next/image";
import Dugme from "./Dugme";
import Otkrij from "./Otkrij";
import Potez from "./Potez";

export default function Baner() {
  return (
    <section className="omot pt-(--razmak)">
      <Otkrij>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br lg:rounded-[36px] from-maglica to-[#e6ebf6]">
          <div className="relative z-10 p-7 sm:p-10 lg:min-h-[280px] lg:w-[48%] lg:p-14">
            <h2 className="naslov text-[clamp(2rem,3.4vw,3.25rem)]">
              Sve za krečenje
              <br />
              <span className="relative">
                na jednom
                <Potez className="-bottom-[0.1em] left-[-4%] h-[0.16em] w-[78%]" />
              </span>{" "}
              mestu.
            </h2>
            <p className="mt-4 max-w-[30ch] text-base leading-snug text-sivi lg:text-[17px]">
              Kvalitetne boje, provereni brendovi i sav pribor za savršen rezultat.
            </p>
            <div className="mt-7">
              <Dugme href="#">Pogledajte ponudu</Dugme>
            </div>
          </div>

          <div className="relative aspect-[556/148] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[55%] lg:[mask-image:linear-gradient(to_right,transparent,black_14%)]">
            <Image
              src="/img/baner-lepeza-ostra.webp"
              alt="Lepeza nijansi boja u rukama"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </Otkrij>
    </section>
  );
}
