import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Dugme({ tekst, href = "#", className = "" }: { tekst: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={`v2-dugme ${className}`}>
      {tekst}
      <ArrowRight aria-hidden className="size-5" strokeWidth={2} />
    </Link>
  );
}
