"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavLinkActive, NAV_LINKS } from "@/assets/contents/navigation";
import { cn } from "@/utils/classnames";

/**
 * Header's main navigation, hidden below 700px in favor of the mobile menu.
 * The active link is underlined with a teal rule; others carry a transparent
 * rule to avoid any height shift.
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
              "hover:text-copper flex min-h-11 items-center border-b-2 px-3.5 py-2.5 text-lg",
              isActive ? "border-teal text-stage-black" : "text-muted border-transparent"
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
