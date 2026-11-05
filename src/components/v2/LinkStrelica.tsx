import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function LinkStrelica({ tekst, href = "#", className = "" }: { tekst: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={`v2-link ${className}`}>
      {tekst}
      <span className="v2-krug" aria-hidden>
        <ArrowRight className="size-4" strokeWidth={2.25} />
      </span>
    </Link>
  );
}
