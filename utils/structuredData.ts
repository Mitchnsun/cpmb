import { LOGO, SOCIAL_IMAGE } from "@/assets/contents/medias";
import { isDateAhead } from "@/utils/concerts";
import { META_DESCRIPTION_LENGTH } from "@/utils/metadata";
import {
  absoluteUrl,
  articleUrl,
  artistUrl,
  concertUrl,
  CONTACT_EMAIL,
  REHEARSAL_PLACE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/utils/site";
import { truncateAtWord } from "@/utils/truncate";

/**
 * schema.org descriptions of a concert (CPMB-18).
 *
 * Search engines read these to show a concert as an event rather than as a
 * page: a title, a date, a place. Everything comes from `concerts.json`,
 * nothing is written twice — a concert given on two evenings produces two
 * `MusicEvent` entries, which is what a calendar expects: one event, one
 * date.
 */

/**
 * What describing a concert as an event takes — a subset of `Concert`, which
 * every concert of the data satisfies. Stated structurally rather than as
 * the JSON-derived union, so this stays readable and a test can hand it a
 * concert that does not exist yet.
 */
export interface ConcertLike {
  title: string;
  slug: string;
  date: readonly string[];
  location: string;
  description?: string;
  media?: string;
  /** One place per date, in their order, when they differ. */
  venues?: readonly string[];
}

/** Countries the choir sings in, and their code. */
const COUNTRY_CODES: Readonly<Record<string, string>> = { France: "FR", Suisse: "CH" };

/**
 * The other way the data names a country: a marker in brackets, used when a
 * single line spans the border — "Genève (CH) et Église de Gaillard (F)".
 */
const COUNTRY_MARKERS: Readonly<Record<string, string>> = { CH: "CH", F: "FR", FR: "FR", CHE: "CH", FRA: "FR" };

const MARKER = /\s*\((CH|CHE|F|FR|FRA)\)\s*$/i;

/** Country marked in brackets at the end of a fragment, and that fragment without it. */
const readMarker = (part: string): { text: string; country?: string } => {
  const found = MARKER.exec(part);

  return found
    ? { text: part.slice(0, found.index).trim(), country: COUNTRY_MARKERS[found[1].toUpperCase()] }
    : { text: part };
};

interface PostalAddress {
  "@type": "PostalAddress";
  addressLocality?: string;
  postalCode?: string;
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
 * The country is read either as a word of its own at the end of the line, or
 * as the bracketed marker that a cross-border line carries on each side;
 * `fallbackCountry` lets a venue inherit the country written once at the end
 * of a two-venue line.
 */
export const parsePlace = (location: string, fallbackCountry?: string): Place => {
  const parts = location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  const last = parts.at(-1) ?? "";
  const spelled = COUNTRY_CODES[last];

  /* A spelled-out country is a part of its own and drops out; a bracketed
     marker sits on the town or the venue and is only stripped from it. */
  const marked = spelled ? { text: last, country: undefined } : readMarker(last);
  const own = spelled ?? marked.country;
  const country = own ?? fallbackCountry;

  const rest = spelled ? parts.slice(0, -1) : [...parts.slice(0, -1), marked.text].filter(Boolean);

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
 * The venues of a concert, one per performance, or `[]` when the data names
 * none — the concert was then given in a single place.
 *
 * A concert given in two towns reads, for a human, as one line: "Boëge et
 * Saint-Gervais-les-Bains, France". Publishing that whole line as the place
 * of both events invents a venue that exists nowhere, and cutting it back
 * apart cannot be done safely — "Église Saint-Pierre et Saint-Paul" splits
 * just as willingly as "Boëge et Saint-Gervais-les-Bains", and nothing in
 * the sentence says which of the two was meant. So the data states it
 * instead: `venues`, one entry per date, in their order.
 */
const concertVenues = (concert: ConcertLike, performances: number): Place[] => {
  const venues = concert.venues ?? [];

  /* A count that does not match the dates is not a mapping: rather than pair
     them wrongly, the whole line stands for every performance. */
  if (venues.length !== performances) return [];

  return venues.map((venue) => parsePlace(venue));
};

/**
 * The choir, as the group on stage — and only that.
 *
 * It is not always the host: eight of these concerts were given at someone
 * else's invitation, the Municipality of Vétraz-Monthoux or the association
 * Chœur et Orgues among them, and one inside another festival's programme.
 * Who organised an evening is nowhere in the data, so no `organizer` is
 * published rather than one that credits the guest for the invitation.
 */
const CHOIR = { "@type": "MusicGroup", name: SITE_NAME, url: SITE_URL } as const;

/**
 * One `MusicEvent` per performance of a concert. Dates that cannot be read
 * are skipped rather than published broken.
 */
export const concertEvents = (concert: ConcertLike): MusicEvent[] => {
  const url = concertUrl(concert.slug);
  const dates = concert.date.filter((date) => Number.isFinite(new Date(date).getTime()));

  const venues = concertVenues(concert, dates.length);
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
    url,
    ...(concert.description ? { description: concert.description } : {}),
    ...(concert.media ? { image: absoluteUrl(concert.media) } : {}),
  }));
};

/**
 * The choir itself, as an entity rather than a page (CPMB-18) — what feeds
 * a knowledge panel on a brand search. Everything comes from the site's own
 * constants, so it can only drift alongside the page it mirrors: the
 * description is the layout's own Open Graph line, the rehearsal address is
 * `ContactInfo`'s.
 *
 * No `sameAs`: the choir has no social account referenced anywhere in this
 * repository, and an empty list is honest where a guessed link would not be.
 */
export interface ChoirOrganization {
  "@context": "https://schema.org";
  "@type": "MusicGroup";
  name: string;
  url: string;
  description: string;
  foundingDate: string;
  email: string;
  logo: string;
  image: string;
  areaServed: string[];
  location: Place;
}

export const choirOrganization = (): ChoirOrganization => ({
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  foundingDate: "2005-03",
  email: CONTACT_EMAIL,
  logo: absoluteUrl(LOGO.src),
  image: absoluteUrl(SOCIAL_IMAGE.src),
  areaServed: ["Haute-Savoie", "Genevois"],
  location: {
    "@type": "Place",
    name: REHEARSAL_PLACE.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: REHEARSAL_PLACE.locality,
      postalCode: REHEARSAL_PLACE.postalCode,
      addressCountry: REHEARSAL_PLACE.country,
    },
  },
});

/**
 * A page's place in the site, read by a search engine as a breadcrumb trail
 * rather than a bare URL (CPMB-18). `items` runs from the home page to the
 * page itself; callers take their labels from `navigation.ts`, the single
 * navigation source, so a menu rename cannot leave the trail behind.
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface BreadcrumbList {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: { "@type": "ListItem"; position: number; name: string; item: string }[];
}

export const breadcrumb = (items: readonly BreadcrumbItem[]): BreadcrumbList => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/**
 * The agenda, as a list of events rather than a page of links (CPMB-18) —
 * `/nos-concerts` is where a search for "concert chœur Haute-Savoie" lands,
 * and until now only a concert's own page carried a `MusicEvent`. Built from
 * `concertEvents()` rather than duplicating it, so the two can never
 * disagree on how a concert reads as an event.
 */
export interface ConcertList {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: { "@type": "ListItem"; position: number; item: MusicEvent }[];
}

export const concertList = (concerts: readonly ConcertLike[], now: number): ConcertList => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: concerts
    .flatMap((concert) => concertEvents(concert))
    /* A concert given twice stays on the agenda between its two evenings —
       but the evening that has passed has no place in a list of what is
       still to come. Same Paris-midnight cutoff as the page itself. */
    .filter((event) => isDateAhead(event.startDate, now))
    .map((event, index) => ({ "@type": "ListItem" as const, position: index + 1, item: event })),
});

/**
 * What describing a press clipping as a `NewsArticle` takes — a subset of
 * the shape `articles.json` holds.
 */
export interface ArticleLike {
  title: string;
  slug: string;
  /** `YYYY-MM-DD`, or `YYYY-MM` when the paper gives only the month. */
  date: string;
  subtitle?: string;
  publication?: string;
  media: readonly { url: string; alt: string }[];
}

const FULL_DATE = /^\d{4}-\d{2}-\d{2}$/;

export interface NewsArticleSchema {
  "@context": "https://schema.org";
  "@type": "NewsArticle";
  headline: string;
  url: string;
  mainEntityOfPage: string;
  description?: string;
  image?: string;
  datePublished?: string;
  publisher?: { "@type": "Organization"; name: string };
}

/**
 * A clipping of the press review, as an article a search engine can date and
 * attribute (CPMB-18). `datePublished` is only published when the day is
 * known — a month-only date would either be rejected or, worse, read as the
 * first of the month, a day the paper never printed. The publication's name
 * is the part of `publication` before its comma ("Le Dauphiné Libéré,
 * Novembre 2023" → "Le Dauphiné Libéré"), read the same way `parsePlace`
 * reads a venue from a location line.
 */
export const pressArticle = (article: ArticleLike): NewsArticleSchema => {
  const url = articleUrl(article.slug);
  const [clipping] = article.media;
  const publisher = article.publication?.split(",")[0]?.trim();

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    url,
    mainEntityOfPage: url,
    ...(article.subtitle ? { description: article.subtitle } : {}),
    ...(clipping ? { image: absoluteUrl(clipping.url) } : {}),
    ...(FULL_DATE.test(article.date) ? { datePublished: article.date } : {}),
    /* The paper published the clipping; it did not sign it. No byline is
       recorded anywhere in the data, so nothing is published as `author`. */
    ...(publisher ? { publisher: { "@type": "Organization" as const, name: publisher } } : {}),
  };
};

/**
 * What describing an interpreter as a `Person` takes — a subset of the shape
 * `artists.json` holds.
 */
export interface ArtistLike {
  name: string;
  media: string;
  text: readonly string[];
}

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  name: string;
  image: string;
  url: string;
  description?: string;
}

/**
 * An interpreter's page as a `Person` (CPMB-18) — "Benoît Dubu chef de
 * chœur" is a plausible search, and the page already carries a name, a
 * portrait and a biography for it.
 *
 * No `memberOf`: of the three people profiled, one directs the choir and two
 * are instrumentalists who play with it, and `artists.json` says nothing
 * about the difference — the presentation page carries it, in its headings.
 * Declaring them all members would state an affiliation two of them never
 * claimed. The day the data names the relation, this is where it goes.
 */
export const personSchema = (slug: string, artist: ArtistLike): PersonSchema => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: artist.name,
  image: absoluteUrl(artist.media),
  url: artistUrl(slug),
  ...(artist.text[0] ? { description: truncateAtWord(artist.text[0], META_DESCRIPTION_LENGTH) } : {}),
});
