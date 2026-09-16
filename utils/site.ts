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

/** Page of a concert, as a path — what every link inside the site uses. */
export const concertPath = (slug: string): string => `/nos-concerts/${slug}`;

/** Same page, absolute, for an `.ics` file or a metadata tag. */
export const concertUrl = (slug: string): string => `${SITE_URL}${concertPath(slug)}`;

/** Calendar file of a concert, prerendered next to its page. */
export const concertIcsPath = (slug: string): string => `${concertPath(slug)}/concert.ics`;
