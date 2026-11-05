import type { NextRequest } from "next/server";
import { pretraziProdavnicu } from "@/lib/prodavnica";

export async function GET(req: NextRequest) {
  const pojam = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (pojam.length < 2) return Response.json([]);
  try {
    return Response.json(await pretraziProdavnicu(pojam));
  } catch {
    return Response.json({ greska: true }, { status: 502 });
  }
}
