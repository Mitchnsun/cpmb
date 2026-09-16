import Image from "next/image";
import Link from "next/link";

import { posterAlt } from "@/assets/contents/medias";
import { TOUCH_TARGET } from "@/components/TextLink";
import { cn } from "@/utils/classnames";
import { type Concert } from "@/utils/concerts";
import { formatFrenchDateList } from "@/utils/formatDate";
import { concertPath } from "@/utils/site";

interface PastConcertRowProps {
  concert: Concert;
}

/**
 * One line of the past-concerts timeline (CPMB-13): poster, date, venue and
 * programme, marked on the left by the copper rule of the section.
 *
 * A concert with no poster drops the column instead of leaving a 5.5rem hole,
 * and below the 700px breakpoint the whole row stacks, poster first.
 */
const PastConcertRow = ({ concert }: PastConcertRowProps) => (
  <article
    className={cn(
      "border-l-copper-light menu:gap-5 grid items-start gap-2 border-l-2 py-4.5 pl-5.5",
      concert.media
        ? "menu:grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
        : "menu:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
    )}
  >
    {concert.media ? (
      <Image
        src={concert.media}
        alt={posterAlt(concert.title)}
        width={90}
        height={120}
        sizes="88px"
        loading="lazy"
        /* Capped so the stacked mobile layout keeps a thumbnail, not a poster. */
        className="border-border aspect-3/4 w-full max-w-22 rounded-sm border object-cover"
      />
    ) : null}

    <p className="font-display text-copper text-2xl">{formatFrenchDateList(concert.date)}</p>
    <p className="text-lg">{concert.location}</p>

    <div>
      {concert.programme && concert.programme.length > 0 ? (
        <p className="text-muted text-lg">{concert.programme.join(", ")}</p>
      ) : null}
      <Link
        href={concertPath(concert.slug)}
        aria-label={`Voir le concert : ${concert.title}`}
        className={cn(
          "text-copper hover:text-teal mt-2 inline-block border-b border-current text-lg no-underline",
          TOUCH_TARGET
        )}
      >
        Voir le concert
      </Link>
    </div>
  </article>
);

export default PastConcertRow;
