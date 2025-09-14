import "./globals.css";

import type { Metadata } from "next";
import { Inter, Noto_Sans } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Choeur des Pays du Mont-Blanc",
  description:
    "L'objectif est de proposer à un public le plus large possible des interprétations de grande qualité. Notre vocation est de faire connaître et promouvoir la musique classique, permettant de rapprocher les musiciens et un large public, parfois non initié, en expliquant les œuvres musicales partant du principe qu'\"Apprendre à écouter, c'est découvrir l'émotion\".",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${notoSans.variable} font-inter bg-zinc-50 text-zinc-900 antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
