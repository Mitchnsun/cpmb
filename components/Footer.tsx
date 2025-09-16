import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer className="font-noto">
    <div className="container mx-auto flex items-center justify-around gap-6 py-4 text-center">
      <a
        href="https://www.veran-piano.com/"
        aria-label="Visitez le site de Veran Piano - nouvelle fenêtre"
        target="_blank"
        rel="noopener noreferrer"
        className="basis-1/3"
      >
        <Image src="/logo-veran-pianos.png" alt="Logo Veran Piano" width={200} height={120} className="m-auto" />
      </a>
      <a
        href="https://www.gaillard.fr/"
        aria-label="Visitez le site de la Ville de Gaillard - nouvelle fenêtre"
        target="_blank"
        rel="noopener noreferrer"
        className="basis-1/3"
      >
        <Image src="/logo-gaillard.png" alt="Logo Ville de Gaillard" width={200} height={120} className="m-auto" />
      </a>
      <a
        href="https://www.hautesavoie.fr/"
        aria-label="Visitez le site du Département de la Haute-Savoie - nouvelle fenêtre"
        target="_blank"
        rel="noopener noreferrer"
        className="basis-1/3"
      >
        <Image src="/haute-savoie.svg" alt="Logo Haute-Savoie" width={90} height={55} className="m-auto" />
      </a>
    </div>
    <div className="bg-gray-800 px-4">
      <div className="container mx-auto flex flex-col items-start gap-4 py-4 lg:flex-row lg:gap-24">
        <div>
          <Image
            src="/CPMB-logo-blanc.png"
            alt="Logo Chœur des Pays du Mont-Blanc"
            className="shrink-0"
            width={160}
            height={55}
          />
          <p className="mt-4 text-sm text-gray-400">Partager la passion de la musique chorale au cœur des Alpes.</p>
        </div>
        <div>
          <h4 className="mb-2 text-lg font-bold text-white">Nos Partenaires</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="https://www.veran-piano.com/"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Veran Piano
              </a>
            </li>
            <li>
              <a
                href="https://www.gaillard.fr/"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ville de Gaillard
              </a>
            </li>
            <li>
              <a
                href="https://www.hautesavoie.fr/"
                className="text-gray-400 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Département de la Haute-Savoie
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-2 text-lg font-bold text-white">Plan du site</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="text-gray-400 hover:text-white">
                Page d&apos;accueil
              </Link>
            </li>
            <li>
              <Link href="/mentions-legales" className="text-gray-400 hover:text-white">
                Mentions légales
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="container mx-auto border-t border-gray-700 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Chœur des Pays du Mont-Blanc. Tous droits réservés.
      </p>
    </div>
  </footer>
);

export default Footer;
