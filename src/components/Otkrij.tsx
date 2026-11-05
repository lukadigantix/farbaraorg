"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Deca se pojavljuju kad uđu u ekran; sa `stavke` svaki unuk (li) sa svojim --i kasni za prethodnim
export default function Otkrij({ children, stavke, className = "" }: { children: ReactNode; stavke?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("vidljivo");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`otkrij ${stavke ? "otkrij-stavke" : ""} ${className}`}>
      {children}
    </div>
  );
}
