import type { Metadata } from "next";

import { NOT_FOUND_BANNER } from "@/assets/contents/medias";
import ButtonLink from "@/components/ButtonLink";
import PageBanner from "@/components/PageBanner";

/**
 * Its own title, distinct from the home page's, which it used to inherit
 * from the layout (CPMB-16). Next already serves this page `noindex`, so
 * nothing has to be said about robots here.
 */
export const metadata: Metadata = {
  title: "Page non trouvée",
  description: "Cette page n'existe pas ou n'existe plus sur le site du Chœur des Pays du Mont-Blanc.",
};

/**
 * The layout already wraps every page in `<main id="main-content">`: a
 * second `main` here gave the document two main landmarks, so a screen
 * reader jumping by landmark landed on an ambiguous one (CPMB-16).
 */
export default function NotFound() {
  return (
    <>
      <PageBanner overline="Erreur 404" title="Page non trouvée" image={NOT_FOUND_BANNER} />

      <section className="max-w-site mx-auto px-6 pt-16 pb-20">
        <p className="mb-8 max-w-prose text-lg">
          Désolé, la page que vous recherchez n&apos;existe pas ou n&apos;existe plus.
        </p>
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
      </section>
    </>
  );
}
