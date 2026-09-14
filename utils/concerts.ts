import type concerts from "@/assets/contents/concerts.json";

type Concert = (typeof concerts)[number];

export interface SplitConcerts {
  upcoming: Concert[];
  past: Concert[];
}

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
    const times = concert.date.map((date) => new Date(date).getTime()).filter((time) => Number.isFinite(time));
    return {
      concert,
      times,
      nextUpcoming: times.filter((time) => time >= now).sort((a, b) => a - b)[0],
      maxTime: Math.max(...times),
    };
  });

  return {
    upcoming: parsed
      .filter((item) => item.times.some((time) => time >= now))
      .sort((a, b) => (a.nextUpcoming ?? Infinity) - (b.nextUpcoming ?? Infinity))
      .map((item) => item.concert),
    past: parsed
      .filter((item) => item.times.every((time) => time < now))
      .sort((a, b) => b.maxTime - a.maxTime)
      .map((item) => item.concert),
  };
};
