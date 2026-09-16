import PageBanner from "@/components/PageBanner";
import TextLink from "@/components/TextLink";
import { pageMetadata } from "@/utils/metadata";
import { CONTACT_EMAIL } from "@/utils/site";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Informations légales, données personnelles (RGPD) et contacts du Chœur des Pays du Mont-Blanc.",
  path: "/mentions-legales",
});

export default function Mentions() {
  return (
    <>
      <PageBanner overline="Informations légales" title="Mentions légales" />

      <section className="max-w-site mx-auto px-6 pt-16 pb-20">
        <article className="max-w-prose">
          <h2 className="font-display mb-4 text-3xl font-semibold">Droits d&apos;auteur et copyright</h2>
          <p className="text-lg">
            Le site de l&apos;association « Chœur des Pays du Mont-Blanc » est protégé par la législation française et
            internationale sur le droit d&apos;auteur et la propriété intellectuelle. Les droits de l&apos;auteur de ce
            site sont réservés pour toute forme d&apos;utilisation. En particulier, la reproduction des éléments
            graphiques du site, le téléchargement complet du site pour son enregistrement sur un support de diffusion,
            ainsi que toute utilisation des visuels et textes qu&apos;il contient autre que la consultation individuelle
            et privée sont interdites sauf autorisation expresse du directeur de la publication.
          </p>

          <h2 className="font-display mt-9 mb-4 text-3xl font-semibold">Données personnelles</h2>

          <h3 className="font-display mb-2 text-xl font-semibold">1. Traitement des données personnelles</h3>
          <p className="text-lg">
            Conformément au Règlement Général sur la Protection des Données (RGPD), l&apos;association « Chœur des Pays
            du Mont-Blanc » traite vos données personnelles de manière licite, loyale et transparente. Nous tenons un
            registre des activités de traitement et mettons en œuvre les mesures techniques et organisationnelles
            appropriées pour assurer la sécurité de vos données.
          </p>

          <h3 className="font-display mt-6 mb-2 text-xl font-semibold">2. Vos droits</h3>
          <p className="text-lg">
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité, de
            limitation du traitement et d&apos;opposition concernant vos données personnelles. Pour exercer ces droits,
            contactez-nous à l&apos;adresse :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`} className="wrap-anywhere">
              {CONTACT_EMAIL}
            </TextLink>
          </p>

          <h3 className="font-display mt-6 mb-2 text-xl font-semibold">
            3. Contact délégué à la protection des données
          </h3>
          <p className="text-lg">
            Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à :{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`} className="wrap-anywhere">
              {CONTACT_EMAIL}
            </TextLink>
          </p>

          <h3 className="font-display mt-6 mb-2 text-xl font-semibold">4. Publicité électronique</h3>
          <p className="text-lg">
            L&apos;envoi de courrier électronique à des fins de publicité suppose que vous ayez exprimé votre accord
            préalable. Vous pouvez vous opposer à l&apos;utilisation de ces coordonnées par courrier envoyé à
            l&apos;adresse de l&apos;association ou par désinscription lors de la réception d&apos;un courriel de type «
            Lettre d&apos;information ».
          </p>

          <p className="text-muted mt-9 text-lg">
            Licences entrepreneur du spectacle : PLATESV-D-2022-005692 et PLATESV-D-2022-005721.
          </p>
        </article>
      </section>
    </>
  );
}
