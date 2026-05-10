import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ScrollReveal from "./components/ScrollReveal";
import VisitorTracker from "./components/VisitorTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atlasibo.com"),
  title: {
    default: "atlasibo | IPTV Premium — Atlas Pro IBO, Live TV 4K & VOD",
    template: "%s | atlasibo IPTV"
  },
  description:
    "atlasibo — Abonnement IPTV premium avec Atlas Pro IBO. +13 000 chaînes en direct, +22 000 films, +5 000 séries en Full HD et 4K. Compatible Smart TV, Android, iOS, Fire TV et PC. Activation rapide, support 24/7.",
  keywords: [
    "IPTV",
    "IPTV premium",
    "abonnement IPTV",
    "Atlas Pro IBO",
    "atlasibo",
    "Atlas IBO",
    "IPTV France",
    "IPTV 4K",
    "live TV",
    "chaînes IPTV",
    "VOD IPTV",
    "IPTV Smart TV",
    "IPTV Android",
    "IPTV Fire TV",
    "meilleur IPTV",
    "IPTV pas cher",
    "IPTV légal",
    "streaming TV",
    "IPTV Full HD",
    "IPTV Smarters",
    "Atlas Pro",
    "abonnement Atlas Pro IBO",
    "IPTV Maroc",
    "IPTV Algérie",
    "IPTV Tunisie",
    "IPTV Belgique",
    "IPTV Canada"
  ],
  authors: [{ name: "atlasibo", url: "https://atlasibo.com" }],
  creator: "atlasibo",
  publisher: "atlasibo",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  icons: {
    icon: "/images/Atlasibo logo.png",
    shortcut: "/images/Atlasibo logo.png",
    apple: "/images/Atlasibo logo.png"
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://atlasibo.com",
    siteName: "atlasibo IPTV",
    title: "atlasibo | IPTV Premium — Atlas Pro IBO, Live TV 4K & VOD",
    description:
      "Profitez de +13 000 chaînes en direct, +22 000 films et +5 000 séries en Full HD / 4K. IPTV premium avec Atlas Pro IBO, compatible tous appareils. Activation rapide, support 24/7.",
    images: [
      {
        url: "/images/electro-flux-hero.png",
        width: 1200,
        height: 630,
        alt: "atlasibo IPTV Premium — Atlas Pro IBO"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "atlasibo | IPTV Premium — Atlas Pro IBO, Live TV 4K & VOD",
    description:
      "+13 000 chaînes, +22 000 films, +5 000 séries. IPTV premium Full HD / 4K avec Atlas Pro IBO.",
    images: ["/images/electro-flux-hero.png"]
  },
  alternates: {
    canonical: "https://atlasibo.com"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ScrollReveal />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
