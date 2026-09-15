import type concerts from "@/assets/contents/concerts.json";
import { PARIS } from "@/utils/formatDate";

/** Derived from the JSON: widening the data widens the type. */
export type Concert = (typeof concerts)[number];

export interface SplitConcerts {
  upcoming: Concert[];
  past: Concert[];
}

/** A season and the concerts it holds, as the past-concerts accordion shows them. */
export interface Season {
  /** Displayed label, "2024 – 2025". */
  label: string;
  /** Anchor and `id` prefix, "saison-2024-2025". */
  id: string;
  concerts: Concert[];
}

/** A season runs from 1 September to 31 August. */
const SEASON_START_MONTH = 9;

/** Calendar day in Paris, as "YYYY-MM-DD" — two of them compare as strings. */
const parisDay = (time: number): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: PARIS, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(time)
  );

/** Year and month (1-12) of an instant, read in Paris. */
const parisYearMonth = (time: number): { year: number; month: number } => {
  const [year, month] = parisDay(time).split("-").map(Number);
  return { year: year ?? 0, month: month ?? 0 };
};

/** Timestamps of a concert's dates, unparsable ones dropped. */
const concertTimes = (concert: Concert): number[] =>
  concert.date.map((date) => new Date(date).getTime()).filter((time) => Number.isFinite(time));

/**
 * `true` while the day of `time` hasn't passed in Paris — the switch from
 * "upcoming" to "past" happens at local midnight, not at the exact hour of
 * the concert: a date is still to come all day long.
 */
const isAhead = (time: number, now: number): boolean => parisDay(time) >= parisDay(now);

/**
 * Splits concerts into "upcoming" and "past" relative to `now`, and orders
 * them: soonest first for upcoming, most recent first for past. A concert
 * with several dates stays "upcoming" as long as one of its dates hasn't
 * passed yet.
 *
 * `now` is a parameter rather than an internal `Date.now()` so the function
 * stays pure and testable, and the caller controls the reference date.
 */
export const splitConcertsByDate = (list: readonly Concert[], now: number): SplitConcerts => {
  const parsed = list.map((concert) => {
    const times = concertTimes(concert);
    return {
      concert,
      times,
      nextUpcoming: times.filter((time) => isAhead(time, now)).sort((a, b) => a - b)[0],
      maxTime: Math.max(...times),
    };
  });

  return {
    upcoming: parsed
      .filter((item) => item.times.some((time) => isAhead(time, now)))
      .sort((a, b) => (a.nextUpcoming ?? Infinity) - (b.nextUpcoming ?? Infinity))
      .map((item) => item.concert),
    past: parsed
      .filter((item) => item.times.every((time) => !isAhead(time, now)))
      .sort((a, b) => b.maxTime - a.maxTime)
      .map((item) => item.concert),
  };
};

/**
 * Earliest date of a concert that hasn't passed yet, as its original ISO
 * string, or `undefined` if every date is behind us. The home hero uses it
 * so a past date can never surface in the "next concert" card.
 */
export const nextConcertDate = (concert: Concert, now: number): string | undefined =>
  concert.date
    .filter((date) => {
      const time = new Date(date).getTime();
      return Number.isFinite(time) && isAhead(time, now);
    })
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0];

/**
 * Season a concert belongs to, derived from its first date — no hand-typed
 * field to keep in sync: a concert filed in September opens the season that
 * carries the following year's name.
 * Returns "" when no date can be read.
 */
export const concertSeason = (concert: Concert): string => {
  const first = concertTimes(concert).sort((a, b) => a - b)[0];
  if (first === undefined) return "";

  const { year, month } = parisYearMonth(first);
  const start = month >= SEASON_START_MONTH ? year : year - 1;

  /* En dash surrounded by spaces, the epic's format. */
  return `${start} – ${start + 1}`;
};

/** Anchor of a season on the concerts page: "2024 – 2025" → "saison-2024-2025". */
export const seasonId = (label: string): string => `saison-${label.replaceAll(" ", "").replaceAll("–", "-")}`;

/**
 * Groups concerts by season, keeping the order they arrive in: given the
 * past concerts (most recent first), the most recent season comes first and
 * its concerts stay in order. Seasons are read from the data, never listed
 * by hand.
 */
export const groupConcertsBySeason = (list: readonly Concert[]): Season[] => {
  const seasons: Season[] = [];

  list.forEach((concert) => {
    const label = concertSeason(concert);
    if (!label) return;

    const current = seasons.find((season) => season.label === label);
    if (current) current.concerts.push(concert);
    else seasons.push({ label, id: seasonId(label), concerts: [concert] });
  });

  return seasons;
};
