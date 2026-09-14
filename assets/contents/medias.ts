/**
 * CPMB-05 — Bibliothèque de médias.
 *
 * Point d'entrée unique des visuels éditoriaux du site : chaque entrée porte
 * son `alt` rédigé, ses dimensions natives (pas de décalage au chargement) et
 * son cadrage voulu. Les pages consomment ces objets plutôt que des chemins
 * en dur.
 *
 * Les `objectPosition` sont volontaires : ils gardent les visages dans le
 * cadre quand la photo est recadrée en bandeau.
 *
 * Formats et largeurs : `next/image` sert automatiquement de l'AVIF/WebP avec
 * un JPEG de secours et génère le `srcset` aux largeurs déclarées dans
 * `next.config.ts` (640, 1024, 1440, 1920). Rien à écrire à la main.
 */

export interface SiteImage {
  /** Chemin public du fichier source. */
  src: string;
  /** Texte alternatif rédigé, ou "" si le visuel est purement décoratif. */
  alt: string;
  /** Dimensions natives, pour réserver la place et éviter tout CLS. */
  width: number;
  height: number;
  /** Cadrage à appliquer quand l'image est recadrée (`object-fit: cover`). */
  objectPosition?: string;
  /** Une seule image du site est prioritaire : le héros de l'accueil. */
  priority?: boolean;
  /** Indice de largeur de rendu pour le choix du `srcset`. */
  sizes?: string;
}

export interface PartnerLogo extends SiteImage {
  /** Nom affiché du partenaire. */
  name: string;
  /** Site officiel du partenaire. */
  href: string;
  /** Hauteur maximale de rendu dans le bandeau partenaires, en pixels. */
  maxHeight: number;
}

/** Logo blanc sur fond transparent. En-tête : 46px. Pied de page : 58px. */
export const LOGO: SiteImage = {
  src: "/CPMB-logo-blanc.png",
  alt: "Chœur des Pays du Mont-Blanc",
  width: 160,
  height: 55,
};

/** Héros de la page d'accueil — seule image chargée en priorité du site. */
export const HOME_HERO: SiteImage = {
  src: "/carrousel/CPMB-2023.jpg",
  alt: "Le Chœur des Pays du Mont-Blanc et son orchestre en concert",
  width: 1920,
  height: 457,
  objectPosition: "center",
  priority: true,
  sizes: "100vw",
};

/** Bandeau « Le chœur » de l'accueil, cadré en 4/3. */
export const CHOIR_PORTRAIT: SiteImage = {
  src: "/carrousel/CPMB2.jpg",
  alt: "Le chœur en concert, écharpes turquoise, dirigé par Benoît Dubu",
  width: 2512,
  height: 1669,
  objectPosition: "center 42%",
  sizes: "(min-width: 700px) 50vw, 100vw",
};

/** Bandeau de la page « Nos concerts ». */
export const CONCERTS_BANNER: SiteImage = {
  src: "/carrousel/CPMB-novembre-2023.jpg",
  alt: "Choristes lisant leurs partitions en concert",
  width: 1920,
  height: 457,
  objectPosition: "center 40%",
  sizes: "100vw",
};

/** Bandeau de la page « Contact ». */
export const CONTACT_BANNER: SiteImage = {
  src: "/carrousel/Hautecombe-16.10.22.jpg",
  alt: "Les choristes du Chœur des Pays du Mont-Blanc, écharpes turquoise",
  width: 1924,
  height: 457,
  objectPosition: "center 35%",
  sizes: "100vw",
};

/** Logos des partenaires — bandeau de l'accueil. */
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
 * Affiches de concert : elles vivent dans `concerts.json` (champ `media`),
 * une par concert. En vignette elles se cadrent en portrait 3/4.
 */
export const POSTER_ASPECT_RATIO = "3 / 4";

/** Alt par défaut d'une affiche, à partir du titre du concert. */
export const posterAlt = (concertTitle: string): string => `Affiche du concert : ${concertTitle}`;
