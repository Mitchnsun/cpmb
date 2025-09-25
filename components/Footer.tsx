import Image from "next/image";
import Link from "next/link";

import artists from "@/assets/contents/artists.json";
import Heading from "@/components/Heading";

const Footer = () => {
  const artistNames = Object.keys(artists);

  return (
    <footer className="font-noto">
      <section className="container mx-auto flex items-center justify-around gap-6 py-4 text-center">
        <a
          href="https://www.veran-piano.com/"
          aria-label="Visitez le site de Veran Piano - nouvelle fenêtre"
          target="_blank"
          rel="noopener noreferrer"
          className="basis-1/3"
        >
          <Image
            src="/logo-veran-pianos.png"
            alt="Logo Veran Piano"
            width={200}
            height={120}
            sizes="200px"
            className="m-auto h-auto"
          />
        </a>
        <a
          href="https://www.gaillard.fr/"
          aria-label="Visitez le site de la Ville de Gaillard - nouvelle fenêtre"
          target="_blank"
          rel="noopener noreferrer"
          className="basis-1/3"
        >
          <Image
            src="/logo-gaillard.png"
            alt="Logo Ville de Gaillard"
            width={200}
            height={120}
            sizes="200px"
            className="m-auto h-auto"
          />
        </a>
        <a
          href="https://www.hautesavoie.fr/"
          aria-label="Visitez le site du Département de la Haute-Savoie - nouvelle fenêtre"
          target="_blank"
          rel="noopener noreferrer"
          className="basis-1/3"
        >
          <Image
            src="/haute-savoie.svg"
            alt="Logo Haute-Savoie"
            width={90}
            height={55}
            sizes="90px"
            className="m-auto h-auto"
          />
        </a>
      </section>
      <div className="bg-gray-800 px-4">
        <div className="container mx-auto flex flex-col items-start gap-4 py-4 lg:flex-row lg:gap-24">
          <div>
            <Image
              src="/CPMB-logo-blanc.png"
              alt="Logo Chœur des Pays du Mont-Blanc"
              className="h-auto shrink-0"
              sizes="160px"
              width={160}
              height={55}
            />
            <p className="mt-4 text-sm text-gray-300">Partager la passion de la musique chorale au cœur des Alpes.</p>
          </div>
          <section>
            <Heading hLevel={4} variant={3} className="mb-2 text-white">
              Nos Partenaires
            </Heading>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                <a
                  href="https://www.veran-piano.com/"
                  aria-label="Visitez le site de Veran Piano - nouvelle fenêtre"
                  className="underline-offset-2 hover:text-white focus-visible:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Veran Piano
                </a>
              </li>
              <li>
                <a
                  href="https://www.gaillard.fr/"
                  aria-label="Visitez le site de la Ville de Gaillard - nouvelle fenêtre"
                  className="underline-offset-2 hover:text-white focus-visible:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ville de Gaillard
                </a>
              </li>
              <li>
                <a
                  href="https://www.hautesavoie.fr/"
                  aria-label="Visitez le site du Département de la Haute-Savoie - nouvelle fenêtre"
                  className="underline-offset-2 hover:text-white focus-visible:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Département de la Haute-Savoie
                </a>
              </li>
            </ul>
          </section>
          <section>
            <Heading hLevel={4} variant={3} className="mb-2 text-white">
              Plan du site
            </Heading>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>
                <Link href="/" className="underline-offset-2 hover:text-white focus-visible:underline">
                  Page d&apos;accueil
                </Link>
              </li>
              <li>
                <Link href="/presentation" className="underline-offset-2 hover:text-white focus-visible:underline">
                  Présentation
                </Link>
              </li>
              <li>
                <Link href="/nos-concerts" className="underline-offset-2 hover:text-white focus-visible:underline">
                  Nos concerts
                </Link>
              </li>
              <li>
                <Link href="/presse" className="underline-offset-2 hover:text-white focus-visible:underline">
                  Presse
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="underline-offset-2 hover:text-white focus-visible:underline">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </section>
          <section>
            <Heading hLevel={4} variant={3} className="mb-2 text-white">
              Artistes
            </Heading>
            <ul className="space-y-1 text-sm text-gray-300">
              {artistNames.map((artistKey) => (
                <li key={artistKey}>
                  <Link
                    href={`/presentation/${artistKey}`}
                    className="underline-offset-2 hover:text-white focus-visible:underline"
                  >
                    {artists[artistKey as keyof typeof artists].name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <p className="container mx-auto border-t border-gray-700 py-4 text-center text-sm text-gray-300">
          &copy; {new Date().getFullYear()} Chœur des Pays du Mont-Blanc. Tous droits réservés - Conçu et développé
          par&nbsp;
          <a
            href="https://www.gocosmic.dev/fr"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visitez le site de Go Cosmic - nouvelle fenêtre"
            className="text-sky-400 underline decoration-sky-400 underline-offset-2 hover:text-sky-300 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 focus-visible:outline-none"
          >
            Go Cosmic
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
