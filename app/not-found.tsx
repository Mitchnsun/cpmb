import { NOT_FOUND_BANNER } from "@/assets/contents/medias";
import ButtonLink from "@/components/ButtonLink";
import PageBanner from "@/components/PageBanner";

export default function NotFound() {
  return (
    <main>
      <PageBanner overline="Erreur 404" title="Page non trouvée" image={NOT_FOUND_BANNER} />

      <section className="max-w-site mx-auto px-6 pt-16 pb-20">
        <p className="mb-8 max-w-prose text-lg">
          Désolé, la page que vous recherchez n&apos;existe pas ou n&apos;existe plus.
        </p>
        <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
      </section>
    </main>
  );
}
