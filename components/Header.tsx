import Link from "next/link";

import MusicNote from "@/assets/icons/music-note.svg";
import HeaderMenu from "@/components/HeaderMenu";

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-solid border-b-gray-200 bg-white px-4 py-3 shadow-sm lg:px-10">
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="font-noto flex items-center gap-2 text-xl leading-tight font-bold tracking-tighter text-inherit no-underline"
      >
        <MusicNote className="h-6 w-6 fill-sky-700" aria-hidden />
        Chœur des Pays du Mont-Blanc
      </Link>
      {/* Navigation desktop - visible uniquement sur lg et plus */}
      <nav aria-label="Navigation principale" className="mr-8 hidden lg:block">
        <ul className="flex gap-12">
          <li>
            <Link href="/presentation" className="font-medium transition-colors hover:text-sky-700">
              Présentation
            </Link>
          </li>
          <li>
            <Link href="/nos-concerts" className="font-medium transition-colors hover:text-sky-700">
              Nos concerts
            </Link>
          </li>
          <li>
            <Link href="/presse" className="font-medium transition-colors hover:text-sky-700">
              Presse
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
