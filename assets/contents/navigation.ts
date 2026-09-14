/**
 * Navigation du site (CPMB-02 / CPMB-03).
 * Une seule liste alimente l'en-tête, le menu mobile et le plan du site
 * du pied de page.
 */

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Navigation principale, dans l'ordre d'affichage.
 * L'accueil n'y figure pas : le logo de l'en-tête y renvoie déjà.
 */
export const NAV_LINKS = [
  { href: "/presentation", label: "Présentation" },
  { href: "/nos-concerts", label: "Nos concerts" },
  { href: "/presse", label: "Presse" },
  { href: "/contact", label: "Contact" },
] as const satisfies readonly NavLink[];

/** Accueil : absent de la navigation, présent au plan du site. */
export const HOME_LINK = { href: "/", label: "Accueil" } as const satisfies NavLink;

/** Lien légal, présent au plan du site mais pas dans la navigation. */
export const LEGAL_LINK = { href: "/mentions-legales", label: "Mentions légales" } as const satisfies NavLink;

/** Plan du site du pied de page : toutes les pages du site. */
export const SITEMAP_LINKS: readonly NavLink[] = [HOME_LINK, ...NAV_LINKS, LEGAL_LINK];

/**
 * État actif d'un lien de navigation.
 * Une fiche concert (`/nos-concerts/<slug>`) compte comme « Nos concerts », et
 * de même pour les fiches artiste et les articles de presse.
 */
export const isNavLinkActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
