import Link from "next/link";

import { buttonLinkVariants } from "@/components/ButtonLink";
import { type Concert } from "@/utils/concerts";
import { formatFrenchDateList, formatFrenchTime } from "@/utils/formatDate";
import { concertIcsPath, concertPath } from "@/utils/site";

interface ConcertCardProps {
  concert: Concert;
}

/**
 * Card of an upcoming concert (CPMB-12), in three blocks that fold into one
 * column on their own below 240px each: when it takes place, where and what
 * is on the programme, and the calendar export.
 *
 * The calendar file is a prerendered `.ics`, not a page: it stays a plain
 * `<a download>` so the browser hands it to the calendar application instead
 * of trying a client-side navigation.
 */
const ConcertCard = ({ concert }: ConcertCardProps) => {
  const times = concert.date.map((date) => formatFrenchTime(date)).filter(Boolean);

  return (
    <article className="bg-surface grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] items-start gap-6 p-7">
      <div>
        <p className="font-display text-teal text-3xl">{formatFrenchDateList(concert.date)}</p>
        {times.length > 0 ? <p className="text-muted mt-1.5 text-lg">{times.join(" et ")}</p> : null}
      </div>

      <div>
        <h3 className="text-lg font-semibold">
          <Link
            href={concertPath(concert.slug)}
            aria-label={`${concert.location} — ${concert.title}`}
            className="text-stage-black hover:text-copper no-underline"
          >
            {concert.location}
          </Link>
        </h3>
        {concert.programme && concert.programme.length > 0 ? (
          <p className="text-muted mt-1.5 text-lg">{concert.programme.join(", ")}</p>
        ) : null}
      </div>

      <div className="flex items-center">
        <a
          href={concertIcsPath(concert.slug)}
          download
          aria-label={`Ajouter à mon agenda : ${concert.title}`}
          className={buttonLinkVariants({ tone: "outline" })}
        >
          Ajouter à mon agenda
        </a>
      </div>
    </article>
  );
};

export default ConcertCard;
