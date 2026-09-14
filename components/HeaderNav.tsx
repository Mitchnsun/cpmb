"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavLinkActive, NAV_LINKS } from "@/assets/contents/navigation";
import { cn } from "@/utils/classnames";

/**
 * Navigation principale de l'en-tête (CPMB-02), masquée sous 700px au profit
 * du menu mobile. Le lien actif est souligné d'un filet turquoise ; les autres
 * portent un filet transparent pour éviter tout décalage de hauteur.
 */
const HeaderNav = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="max-menu:hidden flex flex-wrap gap-1">
      {NAV_LINKS.map(({ href, label }) => {
        const isActive = isNavLinkActive(href, pathname);

        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-label hover:text-copper flex min-h-11 items-center border-b-2 px-3.5 py-2.5",
              isActive ? "border-teal text-stage-black" : "text-text-muted border-transparent"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default HeaderNav;
