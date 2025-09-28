"use client";

import Link from "next/link";
import { useState } from "react";

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

const HeaderMenu = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="flex items-center justify-center rounded-md p-1 hover:bg-gray-100 focus:ring-2 focus:ring-sky-700 focus:outline-none"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon className="h-6 w-6 stroke-gray-700" />
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-80 sm:w-96">
        <DrawerHeader className="flex flex-row items-center justify-between border-b border-gray-200 p-4">
          <div>
            <DrawerTitle>Menu</DrawerTitle>
            <DrawerDescription>Navigation du site</DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 focus:ring-2 focus:ring-sky-700 focus:outline-none"
              aria-label="Fermer le menu"
            >
              <CloseIcon className="h-5 w-5 stroke-gray-700" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <nav className="flex flex-col p-4">
          <Link
            href="/presentation"
            className="rounded-md px-4 py-3 text-left font-medium hover:bg-gray-100 focus:ring-2 focus:ring-sky-700 focus:outline-none"
            onClick={() => setIsDrawerOpen(false)}
          >
            Présentation
          </Link>
          <Link
            href="/nos-concerts"
            className="rounded-md px-4 py-3 text-left font-medium hover:bg-gray-100 focus:ring-2 focus:ring-sky-700 focus:outline-none"
            onClick={() => setIsDrawerOpen(false)}
          >
            Nos concerts
          </Link>
          <Link
            href="/presse"
            className="rounded-md px-4 py-3 text-left font-medium hover:bg-gray-100 focus:ring-2 focus:ring-sky-700 focus:outline-none"
            onClick={() => setIsDrawerOpen(false)}
          >
            Presse
          </Link>
          <Link
            href="/mentions-legales"
            className="rounded-md px-4 py-3 text-left font-medium hover:bg-gray-100 focus:ring-2 focus:ring-sky-700 focus:outline-none"
            onClick={() => setIsDrawerOpen(false)}
          >
            Mentions légales
          </Link>
        </nav>
      </DrawerContent>
    </Drawer>
  );
};

export default HeaderMenu;
