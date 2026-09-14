/**
 * Site navigation. A single list feeds the header, the mobile menu, and
 * the footer sitemap.
 */

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Main navigation, in display order.
 * Home isn't listed here: the header logo already links to it.
 */
export const NAV_LINKS = [
  { href: "/presentation", label: "Présentation" },
  { href: "/nos-concerts", label: "Nos concerts" },
  { href: "/presse", label: "Presse" },
  { href: "/contact", label: "Contact" },
] as const satisfies readonly NavLink[];

/** Home: absent from the navigation, present in the sitemap. */
export const HOME_LINK = { href: "/", label: "Accueil" } as const satisfies NavLink;

/** Legal link, present in the sitemap but not in the navigation. */
export const LEGAL_LINK = { href: "/mentions-legales", label: "Mentions légales" } as const satisfies NavLink;

/** Footer sitemap: every page on the site. */
export const SITEMAP_LINKS: readonly NavLink[] = [HOME_LINK, ...NAV_LINKS, LEGAL_LINK];

/**
 * Active state of a navigation link.
 * A concert page (`/nos-concerts/<slug>`) counts as "Nos concerts", and
 * likewise for artist pages and press articles.
 */
export const isNavLinkActive = (href: string, pathname: string): boolean =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
