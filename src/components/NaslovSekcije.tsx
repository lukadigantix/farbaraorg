import Dugme from "./Dugme";

export default function NaslovSekcije({ nadnaslov, naslov, link }: { nadnaslov: string; naslov: string; link: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <p className="nadnaslov">{nadnaslov}</p>
        <h2 className="naslov mt-3 text-[clamp(2rem,3.6vw,3.25rem)]">{naslov}</h2>
      </div>
      <Dugme href="#" boja="tekst" className="-mr-1">{link}</Dugme>
    </div>
  );
}
