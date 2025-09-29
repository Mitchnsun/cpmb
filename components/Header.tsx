import Image from "next/image";
import Link from "next/link";

import HeaderMenu from "@/components/HeaderMenu";

const Header = () => (
  <header className="sticky top-0 z-50 bg-sky-700 px-4 py-1 shadow-sm lg:px-10">
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="font-noto flex items-center gap-2 text-xl leading-tight font-bold tracking-tighter text-inherit no-underline"
      >
        <Image
          src="/CPMB-logo-blanc.png"
          alt="Logo Chœur des Pays du Mont-Blanc"
          className="h-auto shrink-0"
          sizes="135px"
          width={135}
          height={45}
        />
      </Link>
      {/* Navigation desktop - visible uniquement sur lg et plus */}
      <nav aria-label="Navigation principale" className="mr-8 hidden lg:block">
        <ul className="flex gap-12">
          <li>
            <Link href="/presentation" className="font-medium text-sky-100 transition-colors hover:text-white">
              Présentation
            </Link>
          </li>
          <li>
            <Link href="/nos-concerts" className="font-medium text-sky-100 transition-colors hover:text-white">
              Nos concerts
            </Link>
          </li>
          <li>
            <Link href="/presse" className="font-medium text-sky-100 transition-colors hover:text-white">
              Presse
            </Link>
          </li>
          <li>
            <Link href="/contact" className="font-medium text-sky-100 transition-colors hover:text-white">
              Contact
            </Link>
          </li>
        </ul>
      </nav>

      {/* Menu drawer mobile - visible uniquement en dessous de lg */}
      <div className="lg:hidden">
        <HeaderMenu />
      </div>
    </div>
  </header>
);

export default Header;
