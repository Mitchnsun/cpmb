/**
 * Navigation du site (CPMB-02 / CPMB-03).
 * Une seule liste alimente l'en-tête, le menu mobile et le plan du site
 * du pied de page.
 */

export interface NavLink {
  href: string;
  label: string;
}

/** Navigation principale, dans l'ordre d'affichage. */
export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/nos-concerts", label: "Nos concerts" },
  { href: "/contact", label: "Contact" },
] as const satisfies readonly NavLink[];

/** Lien légal, présent au plan du site mais pas dans la navigation. */
export const LEGAL_LINK = { href: "/mentions-legales", label: "Mentions légales" } as const satisfies NavLink;

/** Plan du site du pied de page : navigation principale + mentions légales. */
export const SITEMAP_LINKS: readonly NavLink[] = [...NAV_LINKS, LEGAL_LINK];

/**
 * État actif d'un lien de navigation.
 * Une fiche concert (`/nos-concerts/<slug>`) compte comme « Nos concerts ».
 */
export const isNavLinkActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
