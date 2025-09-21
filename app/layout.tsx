import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext"],
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
    <html lang="fr">
      <body
        className={`${inter.variable} ${notoSans.variable} font-inter flex min-h-screen flex-col bg-zinc-50 text-zinc-900 antialiased`}
      >
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
