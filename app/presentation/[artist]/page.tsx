import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Artists from "@/assets/contents/artists.json";
import ArtistArticle from "@/components/ArtistArticle";
import PageBanner from "@/components/PageBanner";
import ScrollToTop from "@/components/ScrollToTop";
import { META_DESCRIPTION_LENGTH, pageMetadata } from "@/utils/metadata";
import { truncateAtWord } from "@/utils/truncate";

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

  return pageMetadata({
    title: data.name,
    description: truncateAtWord(data.text[0] ?? data.name, META_DESCRIPTION_LENGTH),
    path: `/presentation/${artist}`,
    image: { src: data.media, alt: data.alt, width: data.width, height: data.height },
    type: "article",
  });
}

export default async function Artist({ params }: { params: Promise<{ artist: string }> }) {
  const { artist = "" } = await params;

  const data = Artists[artist as keyof typeof Artists];

  // Return a 404 when data is null, undefined, or empty
  if (!data || !data.name) {
    notFound();
  }

  return (
    <>
      <ScrollToTop />
      <PageBanner
        backLink={{ href: "/presentation", label: "Retour à la présentation" }}
        overline="Interprète"
        title={data.name}
      />

      <section className="max-w-site mx-auto px-6 pt-14 pb-20">
        {/* The banner is the page's h1: the portrait renders no heading of
            its own, so the name is announced once and not twice. */}
        <ArtistArticle media={data.media} width={data.width} height={data.height} alt={data.alt} text={data.text} />
      </section>
    </>
  );
}
