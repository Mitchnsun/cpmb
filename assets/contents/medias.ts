/**
 * Media library.
 *
 * Single entry point for the site's editorial visuals: each entry carries a
 * written `alt`, its native dimensions (no layout shift on load), and its
 * intended crop. Pages consume these objects instead of hardcoded paths.
 * Not all entries below are consumed by a page yet — `HOME_HERO` and
 * friends are the contract for upcoming milestones.
 *
 * `objectPosition` values are deliberate: they keep faces in frame when the
 * photo is cropped into a banner.
 *
 * Formats and widths: `next/image` automatically serves AVIF/WebP with a
 * JPEG fallback, and generates the `srcset` at the widths declared in
 * `next.config.ts` (640, 1024, 1440, 1920). Nothing to write by hand.
 */

export interface SiteImage {
  /** Public path of the source file. */
  src: string;
  /** Written alt text, or "" if the visual is purely decorative. */
  alt: string;
  /** Native dimensions, to reserve space and avoid any CLS. */
  width: number;
  height: number;
  /** Crop to apply when the image is cropped (`object-fit: cover`). */
  objectPosition?: string;
  /** Only one image on the site is priority: the home hero. */
  priority?: boolean;
  /** Rendered-width hint for `srcset` selection. */
  sizes?: string;
}

export interface PartnerLogo extends SiteImage {
  /** Displayed partner name. */
  name: string;
  /** Partner's official site. */
  href: string;
  /** Max rendered height in the partners banner, in pixels. */
  maxHeight: number;
}

/** White logo on transparent background. Header: 46px. Footer: 58px. */
export const LOGO: SiteImage = {
  src: "/CPMB-logo-blanc.png",
  alt: "Chœur des Pays du Mont-Blanc",
  width: 160,
  height: 55,
};

/** Home page hero — the only priority-loaded image on the site. */
export const HOME_HERO: SiteImage = {
  src: "/carrousel/CPMB-2023.jpg",
  alt: "Le Chœur des Pays du Mont-Blanc et son orchestre en concert",
  width: 1920,
  height: 457,
  objectPosition: "center",
  priority: true,
  sizes: "100vw",
};

/** Home page "Le chœur" banner, cropped 4/3. */
export const CHOIR_PORTRAIT: SiteImage = {
  src: "/carrousel/CPMB2.jpg",
  alt: "Le chœur en concert, écharpes turquoise, dirigé par Benoît Dubu",
  width: 2512,
  height: 1669,
  objectPosition: "center 42%",
  sizes: "(min-width: 700px) 50vw, 100vw",
};

/** "Nos concerts" page banner. */
export const CONCERTS_BANNER: SiteImage = {
  src: "/carrousel/CPMB-novembre-2023.jpg",
  alt: "Choristes lisant leurs partitions en concert",
  width: 1920,
  height: 457,
  objectPosition: "center 40%",
  sizes: "100vw",
};

/** "Présentation" page banner — same photo as "Le chœur", cropped full width. */
export const PRESENTATION_BANNER: SiteImage = {
  src: "/carrousel/CPMB2.jpg",
  alt: "Le Chœur des Pays du Mont-Blanc en représentation",
  width: 2512,
  height: 1669,
  objectPosition: "center 35%",
  sizes: "100vw",
};

/** "Contact" page banner. */
export const CONTACT_BANNER: SiteImage = {
  src: "/carrousel/Hautecombe-16.10.22.jpg",
  alt: "Les choristes du Chœur des Pays du Mont-Blanc, écharpes turquoise",
  width: 1924,
  height: 457,
  objectPosition: "center 35%",
  sizes: "100vw",
};

/**
 * Image a link to the site shows when it is shared — Open Graph card,
 * messaging preview, search result (CPMB-18). The same photo as the
 * presentation banner, but uncropped: a social card is nearly 2/1, and the
 * banner strips of `public/carrousel/` are 4.2/1, too flat to survive it.
 */
export const SOCIAL_IMAGE: SiteImage = {
  src: "/carrousel/CPMB2.jpg",
  alt: "Le Chœur des Pays du Mont-Blanc en concert, dirigé par Benoît Dubu",
  width: 2512,
  height: 1669,
};

/** "Page non trouvée" banner. */
export const NOT_FOUND_BANNER: SiteImage = {
  src: "/media/illustration_404.jpeg",
  alt: "Un sommet enneigé du massif du Mont-Blanc émergeant des nuages",
  width: 4608,
  height: 3072,
  objectPosition: "center",
  sizes: "100vw",
};

/** Partner logos — home page banner. */
export const PARTNER_LOGOS: readonly PartnerLogo[] = [
  {
    name: "Ville de Gaillard",
    href: "https://www.gaillard.fr/",
    src: "/logo-gaillard.png",
    alt: "Ville de Gaillard",
    width: 3570,
    height: 1111,
    maxHeight: 56,
    sizes: "200px",
  },
  {
    name: "Département de la Haute-Savoie",
    href: "https://www.hautesavoie.fr/",
    src: "/haute-savoie.svg",
    alt: "Département de la Haute-Savoie",
    width: 169,
    height: 124,
    maxHeight: 64,
    sizes: "90px",
  },
  {
    name: "Véran Pianos",
    href: "https://www.veran-piano.com/",
    src: "/logo-veran-pianos.png",
    alt: "Véran Pianos",
    width: 300,
    height: 106,
    maxHeight: 48,
    sizes: "200px",
  },
] as const;

/**
 * Concert posters live in `concerts.json` (`media` field), one per concert.
 * As a thumbnail they're cropped to portrait 3/4.
 */
export const POSTER_ASPECT_RATIO = "3 / 4";

/** Default alt text for a poster, built from the concert title. */
export const posterAlt = (concertTitle: string): string => `Affiche du concert : ${concertTitle}`;
