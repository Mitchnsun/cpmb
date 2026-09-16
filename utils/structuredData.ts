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
  addressLocality: string;
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
 * The data was written for humans, so the reading stays defensive: a
 * location naming only its town ("Vongy et Boëge, France") keeps that town
 * as the place's name, and one naming no country at all ("Genève (CH) et
 * Samoëns (F)") simply carries none.
 */
export const parsePlace = (location: string): Place => {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const last = parts.at(-1) ?? "";
  const country = COUNTRY_CODES[last];
  const rest = country ? parts.slice(0, -1) : parts;

  const locality = rest.at(-1) ?? location;
  const name = rest.length > 1 ? rest.slice(0, -1).join(", ") : locality;

  return {
    "@type": "Place",
    name,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      ...(country ? { addressCountry: country } : {}),
    },
  };
};

/** The choir, as both the group on stage and the organiser of the evening. */
const CHOIR = { "@type": "MusicGroup", name: SITE_NAME, url: SITE_URL } as const;

/**
 * One `MusicEvent` per performance of a concert. Dates that cannot be read
 * are skipped rather than published broken.
 */
export const concertEvents = (concert: Concert): MusicEvent[] => {
  const url = concertUrl(concert.slug);
  const location = parsePlace(concert.location);

  return concert.date
    .filter((date) => Number.isFinite(new Date(date).getTime()))
    .map((date) => ({
      "@context": "https://schema.org" as const,
      "@type": "MusicEvent" as const,
      name: concert.title,
      startDate: date,
      eventStatus: "https://schema.org/EventScheduled" as const,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode" as const,
      location,
      performer: CHOIR,
      organizer: CHOIR,
      url,
      ...(concert.description ? { description: concert.description } : {}),
      ...(concert.media ? { image: absoluteUrl(concert.media) } : {}),
    }));
};
