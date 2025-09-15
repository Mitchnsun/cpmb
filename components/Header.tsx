import Link from "next/link";

import MusicNote from "@/public/music-note.svg";

const Header = () => (
  <header className="sticky top-0 border-b border-solid border-b-gray-200 bg-white px-10 py-4 shadow-sm">
    <Link href="/" className="text-inherit no-underline">
      <h1 className="font-noto flex items-center gap-2 text-xl leading-tight font-bold tracking-tighter">
        <MusicNote className="h-6 w-6 fill-sky-700" aria-hidden />
        Choeur des pays du Mont-Blanc
      </h1>
    </Link>
  </header>
);
export default Header;
