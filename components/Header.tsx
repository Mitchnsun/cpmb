import Link from "next/link";

import MusicNote from "@/assets/icons/music-note.svg";

const Header = () => (
  <header className="sticky top-0 z-50 border-b border-solid border-b-gray-200 bg-white px-4 py-4 shadow-sm lg:px-10">
    <Link
      href="/"
      className="font-noto flex items-center gap-2 text-xl leading-tight font-bold tracking-tighter text-inherit no-underline"
    >
      <MusicNote className="h-6 w-6 fill-sky-700" aria-hidden />
      Chœur des pays du Mont-Blanc
    </Link>
  </header>
);
export default Header;
