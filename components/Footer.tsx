import Image from "next/image";
import Link from "next/link";

import artists from "@/assets/contents/artists.json";
import { LOGO, PARTNER_LOGOS } from "@/assets/contents/medias";
import { SITEMAP_LINKS } from "@/assets/contents/navigation";
import Overline from "@/components/Overline";

const CONTACT_EMAIL = "bureau@choeurdespaysdumontblanc.fr";

/** Column title: the charter overline, light copper, tracking tightened to 0.14em. */
const columnTitleClassName = "text-copper-light mb-3.5 tracking-[0.14em]";

/** Column link: text on dark background, light teal on hover. */
const columnLinkClassName = "text-text-on-dark hover:text-teal-light no-underline";

/**
 * Footer on stage black.
 * Columns lay themselves out via `auto-fit` and stack cleanly below
 * 700px, no media query needed.
 */
const Footer = () => {
  const artistKeys = Object.keys(artists) as (keyof typeof artists)[];

  return (
    <footer className="bg-stage-black">
      <div className="max-w-site mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-10 px-6 pt-14 pb-8">
        <div>
          <Image
            src={LOGO.src}
            alt={LOGO.alt}
            width={LOGO.width}
            height={LOGO.height}
            className="mb-4 h-[58px] w-auto"
          />
          <p className="text-text-on-dark text-lg">Partager la passion de la musique chorale au cœur des Alpes.</p>
        </div>

        <nav aria-labelledby="footer-sitemap">
          <Overline id="footer-sitemap" className={columnTitleClassName}>
            Plan du site
          </Overline>
          <div className="grid gap-2.5 text-lg">
            {SITEMAP_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={columnLinkClassName}>
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <div>
          <Overline className={columnTitleClassName}>Contact</Overline>
          <p className="mb-2.5 text-lg">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-teal-light hover:text-teal-light wrap-anywhere no-underline"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-text-on-dark text-lg">Espace Louis-Simon, Gaillard (74240)</p>
        </div>

        <div>
          <Overline className={columnTitleClassName}>Partenaires</Overline>
          <div className="text-text-on-dark grid gap-2.5 text-lg">
            {PARTNER_LOGOS.map(({ name }) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>

        <nav aria-labelledby="footer-artists">
          <Overline id="footer-artists" className={columnTitleClassName}>
            Artistes
          </Overline>
          <div className="grid gap-2.5 text-lg">
            {artistKeys.map((artistKey) => (
              <Link key={artistKey} href={`/presentation/${artistKey}`} className={columnLinkClassName}>
                {artists[artistKey].name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-stage-border max-w-site mx-auto border-t px-6 pt-5 pb-10">
        <p className="text-text-on-dark-muted text-sm">
          Chœur des Pays du Mont-Blanc — association créée en 2005 à Gaillard, Haute-Savoie.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
