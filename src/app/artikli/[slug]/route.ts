// Stara adresa artikla sa farbara.org (/artikli/<slug>/) trajno vodi na novu stranu proizvoda.
// Kad dođe backend, adresaPoStarom u lib/prodavnica.ts treba da traži slug u novoj bazi.
import { adresaPoStarom } from "@/lib/prodavnica";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const nova = await adresaPoStarom(slug);
  // Artikla više nema: pretraga po rečima iz stare adrese
  const cilj = nova ?? `/pretraga/?q=${encodeURIComponent(slug.replace(/-/g, " ").slice(0, 60))}`;
  return new Response(null, { status: nova ? 308 : 307, headers: { Location: cilj } });
}
