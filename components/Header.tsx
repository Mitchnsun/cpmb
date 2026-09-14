import Image from "next/image";
import Link from "next/link";

import { LOGO } from "@/assets/contents/medias";
import Equalizer from "@/components/Equalizer";
import HeaderMenu from "@/components/HeaderMenu";
import HeaderNav from "@/components/HeaderNav";

/**
 * En-tête collant (CPMB-02), identique sur toutes les pages.
 * Le logo fourni est blanc : `brightness-0` le rend noir sur le fond clair.
 */
const Header = () => (
  <header className="border-border bg-bg/[0.94] sticky top-0 z-20 border-b backdrop-blur-sm">
    <div className="max-w-site mx-auto flex flex-wrap items-center justify-between gap-4 px-6 py-3">
      <Link href="/" className="text-stage-black hover:text-stage-black flex items-center gap-3">
        <Image
          src={LOGO.src}
          alt={LOGO.alt}
          width={LOGO.width}
          height={LOGO.height}
          priority
          className="h-[46px] w-auto shrink-0 brightness-0"
        />
        <Equalizer />
      </Link>
      <HeaderNav />
      <HeaderMenu />
    </div>
  </header>
);

export default Header;
