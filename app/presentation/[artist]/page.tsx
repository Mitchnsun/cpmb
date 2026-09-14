import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Artists from "@/assets/contents/artists.json";
import ArtistArticle from "@/components/ArtistArticle";
import ScrollToTop from "@/components/ScrollToTop";

export async function generateStaticParams() {
  return Object.keys(Artists).map((artist) => ({
    artist,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ artist: string }> }): Promise<Metadata> {
  const { artist = "" } = await params;
  const data = Artists[artist as keyof typeof Artists];

  if (!data || !data.name) {
    return {
      title: "Artiste non trouvé",
    };
  }

  return {
    title: data.name,
  };
}

export default async function Artist({ params }: { params: Promise<{ artist: string }> }) {
  const { artist = "" } = await params;

  const data = Artists[artist as keyof typeof Artists];

  // Return a 404 when data is null, undefined, or empty
  if (!data || !data.name) {
    notFound();
  }

  return (
    <section className="my-4 px-4 lg:my-8">
      <ScrollToTop />
      <ArtistArticle name={data.name} media={data.media} alt={data.alt} text={data.text} hLevel={1} />
    </section>
  );
}
