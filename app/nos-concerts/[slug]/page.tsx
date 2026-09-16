import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import concerts from "@/assets/contents/concerts.json";
import { CONCERTS_BANNER, posterAlt } from "@/assets/contents/medias";
import { HOME_LINK, NAV_LINKS } from "@/assets/contents/navigation";
import ButtonLink, { buttonLinkVariants } from "@/components/ButtonLink";
import InfoPanel from "@/components/InfoPanel";
import JsonLd from "@/components/JsonLd";
import PageBanner from "@/components/PageBanner";
import { cn } from "@/utils/classnames";
import { type Concert, concertSeason, nextConcertDate, seasonId } from "@/utils/concerts";
import { formatFrenchDateTime } from "@/utils/formatDate";
import { META_DESCRIPTION_LENGTH, pageMetadata } from "@/utils/metadata";
import { concertIcsPath, concertPath } from "@/utils/site";
import { breadcrumb, concertEvents } from "@/utils/structuredData";
import { truncateAtWord } from "@/utils/truncate";

/** "Nos concerts" as `navigation.ts` names it, reused rather than retyped. */
const CONCERTS_LINK = NAV_LINKS.find((link) => link.href === "/nos-concerts")!;

interface ConcertPageProps {
  params: Promise<{ slug: string }>;
}

/** Same hourly rebuild as the agenda: the page says whether the concert is ahead. */
export const revalidate = 3600;

/** Blank lines separate paragraphs; a single newline is a line break. */
const paragraphs = (description: string): string[] => description.split(/\n\s*\n/).filter((block) => block.trim());

/**
 * Concert page (CPMB-14) — the template every concert uses, whatever it
 * carries: one performance or several, a poster or none, a programme and
 * performers or neither.
 *
 * The back link carries the anchor of the concert's season, so the agenda
 * reopens on the season the visitor left.
 */
export default async function ConcertPage({ params }: ConcertPageProps) {
  const { slug } = await params;

  const concert = concerts.find((c: Concert) => c.slug === slug);

  if (!concert) {
    notFound();
  }

  /* Rebuilt hourly (see `revalidate`), so the reference date stays fresh. */
  // eslint-disable-next-line react-hooks/purity
  const upcoming = Boolean(nextConcertDate(concert, Date.now()));
  const season = concertSeason(concert);

  return (
    <>
      {/* One schema.org MusicEvent per performance (CPMB-18): a search
          engine lists the concert as an event, with its date and its place,
          rather than as one more page. Read by crawlers only — nothing of it
          reaches the screen or a screen reader. */}
      <JsonLd data={concertEvents(concert)} />
      <JsonLd
        data={breadcrumb([
          { name: HOME_LINK.label, path: HOME_LINK.href },
          { name: CONCERTS_LINK.label, path: CONCERTS_LINK.href },
          { name: concert.title, path: concertPath(concert.slug) },
        ])}
      />

      <PageBanner
        backLink={{ href: `/nos-concerts#${seasonId(season)}`, label: "Retour aux concerts" }}
        overline={`${upcoming ? "Concert à venir" : "Concert passé"} — saison ${season}`}
        title={concert.title}
      />

      <section className="max-w-site mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-start gap-14 px-6 pt-14 pb-20">
        {concert.media ? (
          <Image
            src={concert.media}
            alt={posterAlt(concert.title)}
            width={1080}
            height={1500}
            sizes="(min-width: 700px) 50vw, 100vw"
            className="border-border h-auto w-full rounded-sm border"
          />
        ) : null}

        <div>
          <InfoPanel accent={upcoming ? "teal" : "copper"} className="mb-8">
            <p className={cn("font-display text-3xl", upcoming ? "text-teal" : "text-copper")}>
              {concert.date.map((date) => (
                <span key={date} className="block">
                  {formatFrenchDateTime(date)}
                </span>
              ))}
            </p>
            <p className="mt-3.5 text-lg">{concert.location}</p>
          </InfoPanel>

          {concert.description
            ? paragraphs(concert.description).map((block) => (
                <p key={block} className="mb-4.5 max-w-prose text-lg">
                  {block.split("\n").map((line, index) => (
                    <span key={line} className={cn(index > 0 && "block")}>
                      {line}
                    </span>
                  ))}
                </p>
              ))
            : null}

          {concert.programme && concert.programme.length > 0 ? (
            <>
              <h2 className="font-display mt-9 mb-4 text-3xl font-semibold">Au programme</h2>
              <ul className="bg-border grid gap-px">
                {concert.programme.map((piece) => (
                  <li key={piece} className="bg-bg py-3.5 text-lg">
                    {piece}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {concert.performers && concert.performers.length > 0 ? (
            <>
              <h2 className="font-display mt-9 mb-4 text-3xl font-semibold">Avec</h2>
              <ul className="text-muted text-lg">
                {concert.performers.map((performer) => (
                  <li key={performer}>{performer}</li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-4">
            <ButtonLink href="/contact">Nous contacter</ButtonLink>
            {upcoming ? (
              <a
                href={concertIcsPath(concert.slug)}
                download
                aria-label={`Ajouter à mon agenda : ${concert.title}`}
                className={buttonLinkVariants({ tone: "outline" })}
              >
                Ajouter à mon agenda
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

export function generateStaticParams() {
  return concerts.map((c: Concert) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: ConcertPageProps): Promise<Metadata> {
  const { slug } = await params;
  const concert = concerts.find((c: Concert) => c.slug === slug);

  if (!concert) {
    return { title: "Concert non trouvé" };
  }

  return pageMetadata({
    title: concert.title,
    /* A description is a summary: the full text of a concert runs long. */
    description: concert.description ? truncateAtWord(concert.description, META_DESCRIPTION_LENGTH) : concert.title,
    path: concertPath(concert.slug),
    /* The poster is the concert's own image; without one, the agenda's. No
       dimensions: a poster is whatever file was dropped in `public/concerts/`
       and the shapes differ from one to the next. */
    image: concert.media ? { src: concert.media, alt: posterAlt(concert.title) } : CONCERTS_BANNER,
    type: "article",
  });
}
