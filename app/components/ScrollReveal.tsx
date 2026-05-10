"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const raf = requestAnimationFrame(() => {
      const elements = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger > *"
      );
      elements.forEach((el) => observer.observe(el));
    });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
