import Link from "next/link";

export default function NijePronadjeno() {
  return (
    <div className="v2-omot pt-10">
      <div className="rounded-[28px] bg-sivka px-6 py-16 text-center">
        <h1 className="text-[clamp(1.875rem,3vw,2.5rem)] font-[550] tracking-[-0.03em]">Ova strana ne postoji</h1>
        <p className="mt-2 text-[16px] font-light text-sivi-2">Artikal je možda uklonjen. Pogledajte ponudu na početnoj strani.</p>
        <Link href="/v2" className="mt-6 inline-flex h-12 items-center rounded-full bg-narandza px-6 font-medium text-white transition-colors hover:bg-narandza-tamna">Na početnu</Link>
      </div>
    </div>
  );
}
