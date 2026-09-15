import Link from "next/link";

import { cn } from "@/utils/classnames";
import { type Concert } from "@/utils/concerts";
import { formatFrenchDateList } from "@/utils/formatDate";

interface HomeDatesProps {
  /** The three concerts to list, already selected and ordered by the page. */
  items: readonly Concert[];
  /** `true` when the list shows dates still to come, `false` for past ones. */
  upcoming: boolean;
}

/**
 * Home dates list (CPMB-08). The section title and the colour of the dates
 * both follow the state of the data: teal for a season already published,
 * copper for a look back at past ones.
 *
 * The rules between rows are the 1px gaps of the grid, not borders. Below
 * the 700px breakpoint the three columns collapse into one.
 */
const HomeDates = ({ items, upcoming }: HomeDatesProps) => {
  if (items.length === 0) return null;

  return (
    <section className="max-w-site mx-auto px-6 py-18" aria-labelledby="home-dates">
      <div className="border-border flex flex-wrap items-baseline justify-between gap-4 border-b pb-4">
        <h2 id="home-dates" className="font-display text-3xl font-semibold">
          {upcoming ? "Trois prochaines dates" : "Retour sur les dernières saisons"}
        </h2>
        <Link href="/nos-concerts" className="border-b border-current text-lg">
          Tous les concerts
        </Link>
      </div>

      <div className="bg-border mt-7 grid gap-px">
        {items.map((concert) => (
          /* Every concert has its own page, so the whole row is the link. */
          <Link
            key={concert.slug}
            href={`/nos-concerts/${concert.slug}`}
            className="bg-bg hover:bg-surface text-stage-black hover:text-stage-black menu:grid-cols-[minmax(0,200px)_minmax(0,1fr)_minmax(0,1.2fr)] menu:items-baseline menu:gap-6 grid items-start gap-2 px-1 py-6 no-underline"
          >
            <span className={cn("font-display text-2xl", upcoming ? "text-teal" : "text-copper")}>
              {formatFrenchDateList(concert.date)}
            </span>
            <span className="text-lg">{concert.location}</span>
            <span className="text-muted text-lg">{concert.programme?.join(", ")}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomeDates;
