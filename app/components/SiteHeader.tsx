"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Accueil", href: "/#accueil" },
  { label: "Offre", href: "/#offre" },
  { label: "Téléchargement", href: "/telechargement" },
  { label: "Démo", href: "/#demo" },
  { label: "FAQ", href: "/#faq" }
];

export default function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      // Only hide on mobile (≤ 640px)
      if (window.innerWidth > 640) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      if (y <= 10) {
        // At the very top — always show
        setHidden(false);
      } else if (y > lastY.current + 4) {
        // Scrolling down — hide
        setHidden(true);
      }
      lastY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topbar${hidden ? " topbar--hidden" : ""}`}>
      <Link className="brand" href="/#accueil" aria-label="atlasibo accueil">
        <Image
          src="/images/Atlasibo logo.png"
          alt="atlasibo"
          width={180}
          height={52}
          className="brand-logo"
          priority
        />
      </Link>
      <nav aria-label="Navigation principale">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mobile-nav" aria-label="Navigation rapide">
        {navItems.slice(1).map((item) => (
          <Link key={item.label} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
