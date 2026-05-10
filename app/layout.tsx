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
  metadataBase: new URL("https://electro-flux.com"),
  title: "atlasibo | IPTV premium",
  description:
    "atlasibo propose une expérience IPTV premium, rapide et compatible avec tous vos écrans.",
  icons: {
    icon: "/images/Atlasibo logo.png",
    shortcut: "/images/Atlasibo logo.png",
    apple: "/images/Atlasibo logo.png"
  },
  openGraph: {
    title: "atlasibo | IPTV premium",
    description:
      "Une interface premium pour regarder vos contenus TV et VOD sur tous vos appareils.",
    images: ["/images/electro-flux-hero.png"]
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
