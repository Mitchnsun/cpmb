import type { Metadata } from "next";

import Heading from "@/components/Heading";

export const metadata: Metadata = {
  title: "Mentions légales – Chœur des Pays du Mont-Blanc",
  description: "Informations légales, données personnelles (RGPD) et contacts du Chœur des Pays du Mont-Blanc.",
};

export default function Mentions() {
  return (
    <section className="p-4 text-zinc-900 xl:p-8">
      <article className="container mx-auto text-justify">
        <Heading className="mb-4">Mentions légales</Heading>
        <Heading hLevel={2} variant={2} className="mb-2">
          Droits d&apos;auteurs et copyright :
        </Heading>
        <p>
          Le site de l&apos;association &quot;Chœur des Pays du Mont-Blanc&quot; est protégé par la législation
          française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Les droits de
          l&apos;auteur de ce site sont réservés pour toute forme d&apos;utilisation. En particulier, la reproduction
          des éléments graphiques du site, le téléchargement complet du site pour son enregistrement sur un support de
          diffusion, ainsi que toute utilisation des visuels et textes qu&apos;il contient autre que la consultation
          individuelle et privée sont interdites sauf autorisation expresse du directeur de la publication.
        </p>
        <Heading hLevel={2} variant={2} className="my-2">
          Données personnelles :
        </Heading>
        <Heading hLevel={3} variant={0}>
          1. Traitement des données personnelles :
        </Heading>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), l&apos;association &quot;Chœur des
          Pays du Mont-Blanc&quot; traite vos données personnelles de manière licite, loyale et transparente. Nous
          tenons un registre des activités de traitement et mettons en œuvre les mesures techniques et
          organisationnelles appropriées pour assurer la sécurité de vos données.
        </p>

        <Heading hLevel={3} variant={0} className="mt-1">
          2. Vos droits :
        </Heading>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité, de limitation
          du traitement et d&apos;opposition concernant vos données personnelles. Pour exercer ces droits,
          contactez-nous à l&apos;adresse :{" "}
          <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-600 hover:underline">
            bureau@choeurdespaysdumontblanc.fr
          </a>
        </p>

        <Heading hLevel={3} variant={0} className="mt-1">
          3. Contact délégué à la protection des données :
        </Heading>
        <p>
          Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à :{" "}
          <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-600 hover:underline">
            bureau@choeurdespaysdumontblanc.fr
          </a>
        </p>

        <Heading hLevel={3} variant={0} className="mt-1">
          4. Publicité électronique :
        </Heading>
        <p>
          L&apos;envoi de courrier électronique à des fins de publicité suppose que vous ayez exprimé votre accord
          préalable. Vous pouvez vous opposer à l&apos;utilisation de ces coordonnées par courrier envoyé à
          l&apos;adresse de l&apos;association ou par désinscription lors de la réception d&apos;un courriel de type
          &quot;Lettre d&apos;information&quot;.
        </p>
      </article>
      <p className="container mx-auto mt-4">
        Licences entrepreneur du spectacle : <span className="font-light">PLATESV-D-2022-005692</span> et{" "}
        <span className="font-light">PLATESV-D-2022-005721</span>.
      </p>
    </section>
  );
}
