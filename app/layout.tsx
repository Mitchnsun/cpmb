import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

/**
 * `next/font` self-hosts the woff2 files and applies `font-display: swap`
 * by default, so text stays readable while loading (no FOIT).
 */
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chœur des Pays du Mont-Blanc",
  description:
    "Chœur des Pays du Mont-Blanc : interprétations de qualité pour tous — « Apprendre à écouter, c'est découvrir l'émotion ».",
  keywords: [
    "chœur",
    "mont-blanc",
    "haute-savoie",
    "musique classique",
    "ensemble vocal",
    "choristes",
    "concerts",
    "gaillard",
    "annecy",
    "benoît dubu",
    "orchestre symphonique",
    "chant choral",
    "répétitions",
    "auditions",
  ],
};

/**
 * Mobile zoom must stay possible: no scale lock, no max scale. Expected output:
 * `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    /*
     * `next/font` variables must stay on `<html>`, not `<body>`: the
     * `--font-display` / `--font-body` / `--font-mono` tokens are declared on
     * `:root` and reference these variables. Declared lower, they'd be
     * unresolved and typography would fall back to the default font.
     *
     * scroll-pt-20: offsets the sticky header (74px) when landing on an anchor.
     */
    <html
      lang="fr"
      className={`${cormorantGaramond.variable} ${sourceSans3.variable} ${ibmPlexMono.variable} scroll-pt-20`}
    >
      <body className="font-body bg-bg text-stage-black flex min-h-screen flex-col text-pretty antialiased">
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
