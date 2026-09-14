"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { isNavLinkActive, NAV_LINKS } from "@/assets/contents/navigation";
import CloseIcon from "@/assets/icons/close.svg";
import MenuIcon from "@/assets/icons/menu.svg";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/utils/classnames";

/**
 * Mobile menu, shown below 700px.
 * The panel fills the screen on the page background. The Drawer primitive
 * (Radix Dialog) provides `aria-expanded` on the trigger, closing on
 * `Escape`, and a focus trap while the panel is open.
 */
const HeaderMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  return (
    /* `autoFocus`: without it vaul cancels the opening auto-focus, focus
       stays on the trigger, and the focus trap never arms. */
    <Drawer autoFocus direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="menu:hidden text-stage-black hover:text-copper flex size-11 items-center justify-center"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="size-6 stroke-current" aria-hidden />
        </button>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          "bg-bg h-full border-none",
          "data-[vaul-drawer-direction=right]:w-full data-[vaul-drawer-direction=right]:sm:max-w-none"
        )}
      >
        <DrawerHeader className="border-border max-w-site mx-auto flex w-full flex-row items-center justify-between border-b px-6 py-3.5">
          <div>
            <DrawerTitle className="font-display text-stage-black text-2xl font-semibold">Menu</DrawerTitle>
            <DrawerDescription className="text-muted text-lg">Navigation du site</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              className="text-stage-black hover:text-copper flex size-11 items-center justify-center"
              aria-label="Fermer le menu"
            >
              <CloseIcon className="size-6 stroke-current" aria-hidden />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* No `aria-label` here: the containing panel is already titled "Menu". */}
        <nav className="max-w-site mx-auto flex w-full flex-col px-6 py-4">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = isNavLinkActive(href, pathname);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsDrawerOpen(false)}
                className={cn(
                  "hover:text-copper flex min-h-11 items-center border-b-2 py-2.5 text-lg",
                  isActive ? "border-teal text-stage-black" : "text-muted border-transparent"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderMenu;
