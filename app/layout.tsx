import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Source_Sans_3 } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

/**
 * Polices de la charte (CPMB-01).
 * `next/font` auto-héberge les fichiers woff2 et applique `font-display: swap`
 * par défaut : le texte reste lisible pendant le chargement (pas de FOIT).
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
 * CPMB-04 — le zoom mobile doit rester possible : aucun verrouillage d'échelle
 * ici, ni blocage du zoom, ni échelle maximale. Rendu attendu :
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
     * Les variables de `next/font` sont portées par `<html>`, pas par `<body>` :
     * les tokens `--font-display` / `--font-body` / `--font-mono` de la charte
     * sont déclarés sur `:root` et y référencent ces variables. Déclarées plus
     * bas, elles seraient introuvables au moment du calcul et toute la
     * typographie retomberait sur la police par défaut.
     *
     * scroll-pt-20 : compense l'en-tête collant (74px) à l'arrivée sur une ancre.
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
