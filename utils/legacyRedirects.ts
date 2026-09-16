/**
 * Addresses of the previous site, kept alive (CPMB-18).
 *
 * The site it replaces was a Joomla install whose articles lived under the
 * menu they were reached from, prefixed by their numeric id:
 * `/nos-concerts/concerts-passes/110-concert-vivaldi-jenkins-…`. Those are
 * the addresses search engines indexed and the ones printed on old
 * programmes, so each one still has to lead somewhere — its own page when
 * the content was carried over, its section otherwise.
 *
 * The list was taken from the live site itself: every article linked from
 * the five pages of the concert archive and the two pages of the press
 * section. Anything it misses is caught by the trailing wildcards, which is
 * why they come last — the first matching rule wins.
 */

/**
 * Condition on the query string, in the shape Next expects. `value` is read
 * as a regular expression, so a Joomla id such as `5:mentions-legales` can
 * be written as it appears in the address.
 */
export interface LegacyQueryMatch {
  type: "query";
  key: string;
  value: string;
}

export interface LegacyRedirect {
  /** Path as the old site published it. */
  source: string;
  /** Where it lands here. */
  destination: string;
  /** Only for the addresses the old site served from `/` with a query. */
  has?: LegacyQueryMatch[];
}

/**
 * The old site reached the same article through either concert menu, so
 * both prefixes have to be answered.
 */
const CONCERT_PREFIXES = ["/nos-concerts/concerts-passes", "/nos-concerts/prochains-concerts"] as const;

/** Press articles hung under the "Présentation" menu. */
const PRESS_PREFIX = "/presentation/presse";

/**
 * Legacy article segment → slug of the concert page that replaces it.
 * A concert absent from this table never made it into `concerts.json`; its
 * address falls back to the agenda through the wildcards below.
 */
const LEGACY_CONCERTS: Readonly<Record<string, string>> = {
  "112-concert-autour-de-la-misa-criolla-les-7-et-28-juin-2026-a-vongy-et-a-boege":
    "concert-autour-de-la-misa-criolla-7-et-28-juin-2026-vongy-et-boege",
  "114-concert-de-noel-a-vetraz-monthoux-le-12-decembre-2025": "concert-de-noel-12-decembre-2025-vetraz-monthoux",
  "113-concert-gloria-16-novembre-2025-gaillard": "concert-gloria-16-novembre-2025-gaillard",
  "110-concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais-les-bains":
    "concert-vivaldi-jenkins-14-et-15-juin-2025-boege-et-saint-gervais",
  "107-concert-de-noel-22-decembre-2024-gaillard": "concert-de-noel-22-decembre-2024-gaillard",
  "106-concert-de-noel-13-decembre-2024-vetraz-monthoux": "concert-de-noel-13-decembre-2024-vetraz-monthoux",
  "104-concert-dvorak-rheinberger-15-et-16-juin-2024-samoens-et-beaumont":
    "concert-dvorak-rheinberger-15-et-16-juin-2024-samoens-et-vongy",
  "103-concert-dvorak-rheinberger-28-avril-2024-eglise-de-beaumont":
    "concert-dvorak-rheinberger-28-avril-2024-eglise-de-beaumont",
  "98-concert-de-noel-8-decembre-2023-vetraz-monthoux": "concert-de-noel-8-decembre-2023-vetraz-monthoux",
  "96-afficher-10-requiem-michael-haydn-et-vepres-solennelles-pour-un-confesseur-de-mozart-novembre-2023":
    "requiem-michael-haydn-et-vepres-solennelles-pour-un-confesseur-de-mozart-novembre-2023",
  "94-requiem-michael-haydn-et-vepres-solennelles-pour-un-confesseur-de-mozart-juin-2023":
    "requiem-michael-haydn-et-vepres-solennelles-pour-un-confesseur-de-mozart-juin-2023",
  "85-musique-francaise-27-novembre-2022-eglise-de-gaillard": "musique-francaise-27-novembre-2022-eglise-de-gaillard",
  "83-musique-francaise-5-novembre-2022-espace-louis-simon-a-gaillard":
    "musique-francaise-5-novembre-2022-espace-louis-simon-a-gaillard",
  "81-musique-francaise-16-octobre-2022-grange-bateliere-abbaye-hautecombe":
    "musique-francaise-16-octobre-2022-grange-bateliere-abbaye-hautecombe",
  "68-magnifique-requiem-de-mozart-a-cluses": "magnifique-requiem-de-mozart-a-cluses",
  "67-requiem-de-mozart-18-novembre-2018-eglise-de-gaillard": "requiem-de-mozart-18-novembre-2018-eglise-de-gaillard",
  "65-magnifique-concert-au-victoria-hall": "magnifique-concert-au-victoria-hall-de-geneve-le-14-juin-2018",
  "57-deux-choeurs-un-concert-de-noel": "deux-choeurs-un-concert-de-noel",
  "55-21-22-mai-2016-franz-liszt-felix-mendelssohn": "21-22-mai-2016-franz-liszt-felix-mendelssohn",
  "53-30-31-janvier-2016-faure-puccini-et-purcell": "30-31-janvier-2016-faure-puccini-et-purcell",
  "45-concert-en-novembre-2015": "15-novembre-2015-faure-puccini-et-purcell",
  "41-25-avril-2015-mass-of-the-children-j-rutter": "25-avril-2015-mass-of-the-children-j-rutter",
  "26-les-4-saisons-misa-tango-10-nov-13": "les-4-saisons-misa-tango-10-nov-13",
  "25-les-4-saisons-misa-tango-08-nov-13": "les-4-saisons-misa-tango-08-nov-13",
  "24-les-4-saisons-misa-tango": "les-4-saisons-misa-tango-16-nov-13",
  "9-2010-festival-du-baroque": "festival-du-baroque-2010",
};

/** Legacy press segment → slug of the article page that replaces it. */
const LEGACY_ARTICLES: Readonly<Record<string, string>> = {
  "93-concert-mozart-haydn-choeur-et-orchestre-a-lespace-louis-simon-en-novembre-2023":
    "concert-mozart-haydn-choeur-et-orchestre-a-lespace-louis-simon-en-novembre-2023",
  "90-le-dauphine-libere-decembre-2022": "un-marche-de-noel-entre-musique-francaise-et-guggenmusic",
  "89-le-dauphine-libere-novembre-2022": "le-choeur-des-pays-du-mont-blanc-a-conquis-le-public",
  "78-le-dauphine-libere-novembre-2021": "guillaume-rault-dirige-le-choeur-des-pays-du-mont-blanc",
  "54-le-dauphine-libere-fevrier-2016": "affluence-au-concert-du-choeur-des-pays-du-mont-blanc",
  "49-le-dauphine-libere-avril-2015": "un-choeur-transfrontalier-de-jeunes-chanteurs",
  "48-le-chenois-juin-2015": "dans-les-cours-de-musicenanglais",
};

/**
 * Menu pages of the old site. "Direction artistique" was a page of its own
 * about Benoît Dubu, and the site has kept one; "Instrumentistes" described
 * two performers who now share the presentation page.
 */
const LEGACY_PAGES: Readonly<Record<string, string>> = {
  "/nos-concerts/prochains-concerts": "/nos-concerts",
  "/nos-concerts/concerts-passes": "/nos-concerts",
  "/presentation/le-choeur": "/presentation",
  "/presentation/direction-artistique": "/presentation/benoit-dubu",
  "/presentation/instrumentistes": "/presentation",
  "/presentation/presse": "/presse",
  /* The members' area was never rebuilt. */
  "/membres/connexion-deconnesion": "/",
  "/membres": "/",
};

/** The legal notice, reachable from every menu of the old site. */
const LEGACY_LEGAL_SEGMENT = "5-mentions-legales";

/**
 * Articles the old site also served from its home page, as a query rather
 * than a path — the form Joomla falls back to, and the one its own home page
 * still links to today.
 */
const LEGACY_QUERIES: readonly LegacyRedirect[] = [
  {
    source: "/",
    has: [{ type: "query", key: "id", value: "5:mentions-legales" }],
    destination: "/mentions-legales",
  },
  {
    source: "/",
    has: [{ type: "query", key: "id", value: "29:recrutement-de-choristes" }],
    destination: "/contact?objet=rejoindre",
  },
];

/**
 * Sections that swallow whatever the tables above do not name: an article
 * deleted from the archive, a paginated listing, a menu page renamed since
 * the crawl. They must stay last — the first matching rule wins.
 */
const SECTION_FALLBACKS: readonly LegacyRedirect[] = [
  { source: "/nos-concerts/concerts-passes/:path*", destination: "/nos-concerts" },
  { source: "/nos-concerts/prochains-concerts/:path*", destination: "/nos-concerts" },
  { source: "/presentation/presse/:path*", destination: "/presse" },
  { source: "/presentation/le-choeur/:path*", destination: "/presentation" },
  { source: "/presentation/instrumentistes/:path*", destination: "/presentation" },
  { source: "/presentation/direction-artistique/:path*", destination: "/presentation/benoit-dubu" },
  { source: "/membres/:path*", destination: "/" },
  /* Joomla's own entry point, indexed alongside the readable addresses. */
  { source: "/index.php", destination: "/" },
  { source: "/index.php/:path*", destination: "/" },
];

/**
 * Every address of the old site that still has to answer, in matching order:
 * the pages that have an exact equivalent first, the sections that catch the
 * rest last.
 */
export const legacyRedirects = (): LegacyRedirect[] => {
  const legal = [...CONCERT_PREFIXES, PRESS_PREFIX].map((prefix) => ({
    source: `${prefix}/${LEGACY_LEGAL_SEGMENT}`,
    destination: "/mentions-legales",
  }));

  const concerts = Object.entries(LEGACY_CONCERTS).flatMap(([segment, slug]) =>
    CONCERT_PREFIXES.map((prefix) => ({ source: `${prefix}/${segment}`, destination: `/nos-concerts/${slug}` }))
  );

  const articles = Object.entries(LEGACY_ARTICLES).map(([segment, slug]) => ({
    source: `${PRESS_PREFIX}/${segment}`,
    destination: `/presse/${slug}`,
  }));

  const pages = Object.entries(LEGACY_PAGES).map(([source, destination]) => ({ source, destination }));

  return [...legal, ...concerts, ...articles, ...pages, ...LEGACY_QUERIES, ...SECTION_FALLBACKS];
};
