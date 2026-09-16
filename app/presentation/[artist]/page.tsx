import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Artists from "@/assets/contents/artists.json";
import { HOME_LINK, NAV_LINKS } from "@/assets/contents/navigation";
import ArtistArticle from "@/components/ArtistArticle";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import ScrollToTop from "@/components/ScrollToTop";
import { META_DESCRIPTION_LENGTH, pageMetadata } from "@/utils/metadata";
import { artistPath } from "@/utils/site";
import { breadcrumb, personSchema } from "@/utils/structuredData";
import { truncateAtWord } from "@/utils/truncate";

/** "Présentation" as `navigation.ts` names it, reused rather than retyped. */
const PRESENTATION_LINK = NAV_LINKS.find((link) => link.href === "/presentation")!;

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
      {/* An interpreter, as a person a search engine can name (CPMB-18). */}
      <JsonLd data={personSchema(artist, data)} />
      <JsonLd
        data={breadcrumb([
          { name: HOME_LINK.label, path: HOME_LINK.href },
          { name: PRESENTATION_LINK.label, path: PRESENTATION_LINK.href },
          { name: data.name, path: artistPath(artist) },
        ])}
      />

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
