/**
 * Absolute addresses of the site.
 *
 * Only exports that leave the page need them — an `.ics` file is opened by a
 * calendar application, outside any browsing context, so the link it carries
 * cannot be relative.
 */
export const SITE_URL = "https://choeurdespaysdumontblanc.fr";

/**
 * The choir's public address. It is one long unbreakable token, so wherever
 * it is displayed the element needs `wrap-anywhere`, or it overflows a
 * narrow screen.
 */
export const CONTACT_EMAIL = "bureau@choeurdespaysdumontblanc.fr";

/** Name of the choir, as metadata and structured data spell it. */
export const SITE_NAME = "Chœur des Pays du Mont-Blanc";

/**
 * One-sentence description of the choir, read by the layout's Open Graph
 * card and by the `MusicGroup` structured-data entity (CPMB-18) — written
 * once, so the two never drift apart.
 */
export const SITE_DESCRIPTION =
  "Chœur symphonique de 30 choristes amateurs dirigé par Benoît Dubu, en concert en Haute-Savoie et dans le Genevois.";

/**
 * Where the choir rehearses (`/contact`, and the `MusicGroup` structured
 * data). Read from `/presentation`: "l'Espace Louis-Simon […] à Gaillard
 * (salle Roger Duvanel)".
 */
export const REHEARSAL_PLACE = {
  name: "Espace Louis-Simon, salle Roger Duvanel",
  locality: "Gaillard",
  postalCode: "74240",
  country: "FR",
} as const;

/**
 * A path of the site, as an absolute address. What leaves the site needs
 * one: the sitemap, `robots.txt`, an Open Graph tag, a structured-data
 * block, an `.ics` file.
 */
export const absoluteUrl = (path: string): string => `${SITE_URL}${path}`;

/** Page of a concert, as a path — what every link inside the site uses. */
export const concertPath = (slug: string): string => `/nos-concerts/${slug}`;

/** Same page, absolute, for an `.ics` file or a metadata tag. */
export const concertUrl = (slug: string): string => `${SITE_URL}${concertPath(slug)}`;

/** Calendar file of a concert, prerendered next to its page. */
export const concertIcsPath = (slug: string): string => `${concertPath(slug)}/concert.ics`;

/** Page of a press article, as a path. */
export const articlePath = (slug: string): string => `/presse/${slug}`;

/** Same page, absolute, for a structured-data block. */
export const articleUrl = (slug: string): string => `${SITE_URL}${articlePath(slug)}`;

/** Page of an artist, as a path. */
export const artistPath = (slug: string): string => `/presentation/${slug}`;

/** Same page, absolute, for a structured-data block. */
export const artistUrl = (slug: string): string => `${SITE_URL}${artistPath(slug)}`;
