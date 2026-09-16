import { type Concert } from "@/utils/concerts";
import { absoluteUrl, concertUrl, SITE_NAME, SITE_URL } from "@/utils/site";

/**
 * schema.org descriptions of a concert (CPMB-18).
 *
 * Search engines read these to show a concert as an event rather than as a
 * page: a title, a date, a place. Everything comes from `concerts.json`,
 * nothing is written twice — a concert given on two evenings produces two
 * `MusicEvent` entries, which is what a calendar expects: one event, one
 * date.
 */

/** Countries the choir sings in, and their code. */
const COUNTRY_CODES: Readonly<Record<string, string>> = { France: "FR", Suisse: "CH" };

interface PostalAddress {
  "@type": "PostalAddress";
  addressLocality?: string;
  addressCountry?: string;
}

interface Place {
  "@type": "Place";
  name: string;
  address: PostalAddress;
}

export interface MusicEvent {
  "@context": "https://schema.org";
  "@type": "MusicEvent";
  name: string;
  startDate: string;
  eventStatus: "https://schema.org/EventScheduled";
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode";
  location: Place;
  performer: { "@type": "MusicGroup"; name: string; url: string };
  organizer: { "@type": "MusicGroup"; name: string; url: string };
  url: string;
  description?: string;
  image?: string;
}

/**
 * The free-text location of a concert, read as a place: "Église
 * Saint-Pierre, Gaillard, France" is a venue, a town and a country.
 *
 * The data was written for humans, so the reading stays defensive. The comma
 * is what separates a venue from its town, and nothing else can: "Église de
 * Vétraz-Monthoux, France" names one place, and whether that place is a town
 * or a building standing in one is not decidable — "Boëge" is a town,
 * "Auditorium de Seynod" is not, and no rule short of a gazetteer tells them
 * apart. So `addressLocality` is published only when the line states it on
 * its own; otherwise the place keeps its name and the address carries the
 * country alone, rather than a church published as a municipality.
 *
 * `fallbackCountry` lets a venue inherit the country written once at the end
 * of a two-venue line.
 */
export const parsePlace = (location: string, fallbackCountry?: string): Place => {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const last = parts.at(-1) ?? "";
  const own = COUNTRY_CODES[last];
  const country = own ?? fallbackCountry;
  const rest = own ? parts.slice(0, -1) : parts;

  /* Two parts or more: the last is the town, what precedes it the venue. */
  const locality = rest.length > 1 ? rest.at(-1) : undefined;
  const name = rest.length > 1 ? rest.slice(0, -1).join(", ") : (rest[0] ?? location);

  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      ...(locality ? { addressLocality: locality } : {}),
      ...(country ? { addressCountry: country } : {}),
    },
  };
};

/**
 * The venues of a concert, one per performance, or `[]` when the line
 * cannot be read as such.
 *
 * A concert given in two towns carries them on one line, in the order of
 * its dates: "Boëge et Saint-Gervais-les-Bains, France". Emitting that whole
 * line as the place of both events invents a venue that exists nowhere, so
 * it is split — but only when it yields exactly one venue per date, which is
 * what keeps a single venue whose own name contains "et" in one piece.
 */
const concertVenues = (location: string, performances: number): Place[] => {
  const parts = location
    .split(" et ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length !== performances || performances < 2) return [];

  /* The country is written once, at the end of the line: "Vongy et Boëge,
     France" is in France on both evenings. */
  const country = parsePlace(location).address.addressCountry;

  return parts.map((part) => parsePlace(part, country));
};

/** The choir, as both the group on stage and the organiser of the evening. */
const CHOIR = { "@type": "MusicGroup", name: SITE_NAME, url: SITE_URL } as const;

/**
 * One `MusicEvent` per performance of a concert. Dates that cannot be read
 * are skipped rather than published broken.
 */
export const concertEvents = (concert: Concert): MusicEvent[] => {
  const url = concertUrl(concert.slug);
  const dates = concert.date.filter((date) => Number.isFinite(new Date(date).getTime()));

  const venues = concertVenues(concert.location, dates.length);
  const whole = parsePlace(concert.location);

  return dates.map((date, index) => ({
    "@context": "https://schema.org" as const,
    "@type": "MusicEvent" as const,
    name: concert.title,
    startDate: date,
    eventStatus: "https://schema.org/EventScheduled" as const,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode" as const,
    location: venues[index] ?? whole,
    performer: CHOIR,
    organizer: CHOIR,
    url,
    ...(concert.description ? { description: concert.description } : {}),
    ...(concert.media ? { image: absoluteUrl(concert.media) } : {}),
  }));
};
