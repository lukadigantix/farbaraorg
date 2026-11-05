import Zaglavlje from "@/components/Zaglavlje";
import Hero from "@/components/Hero";
import Prednosti from "@/components/Prednosti";
import Kategorije from "@/components/Kategorije";
import Izdvojeno from "@/components/Izdvojeno";
import Baner from "@/components/Baner";
import Brendovi from "@/components/Brendovi";
import Podnozje from "@/components/Podnozje";

export default function Home() {
  return (
    <>
      <Zaglavlje />
      <main className="flex-1">
        <Hero />
        <Prednosti />
        <Kategorije />
        <Izdvojeno />
        <Baner />
        <Brendovi />
      </main>
      <Podnozje />
    </>
  );
}
