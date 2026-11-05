import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  href: string;
  children: ReactNode;
  boja?: "crvena" | "plava" | "tekst";
  velika?: boolean;
  className?: string;
};

export default function Dugme({ href, children, boja = "crvena", velika, className = "" }: Props) {
  return (
    <Link href={href} className={`dugme dugme-${boja} ${velika ? "dugme-velika" : ""} ${className}`}>
      <span>{children}</span>
      <span className="dugme-krug" aria-hidden>
        <ArrowRight strokeWidth={2.5} />
      </span>
    </Link>
  );
}
