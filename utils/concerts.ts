import type concerts from "@/assets/contents/concerts.json";

type Concert = (typeof concerts)[number];

export interface SplitConcerts {
  upcoming: Concert[];
  past: Concert[];
}

/**
 * Répartit les concerts entre « à venir » et « passés » par rapport à `now`,
 * et les ordonne : les prochains d'abord pour les premiers, les plus récents
 * d'abord pour les seconds. Un concert sur plusieurs dates reste « à venir »
 * tant qu'une de ses dates n'est pas passée.
 *
 * `now` est un paramètre plutôt qu'un `Date.now()` interne : la fonction reste
 * pure et testable, et l'appelant garde la main sur la date de référence.
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
