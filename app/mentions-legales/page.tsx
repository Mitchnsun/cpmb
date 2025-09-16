import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales – Chœur des Pays du Mont-Blanc",
  description: "Informations légales, données personnelles (RGPD) et contacts du Chœur des Pays du Mont-Blanc.",
};

export default function Mentions() {
  return (
    <main className="p-4 text-zinc-900 lg:py-8">
      <article className="container mx-auto text-justify">
        <h1 className="mb-4 text-xl font-bold text-sky-700">Mentions légales</h1>
        <h2 className="font-noto mb-2 text-lg font-bold text-gray-800">Droits d&apos;auteurs et copyright :</h2>
        <p>
          Le site de l&apos;association &quot;Chœur des Pays du Mont-Blanc&quot; est protégé par la législation
          française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Les droits de
          l&apos;auteur de ce site sont réservés pour toute forme d&apos;utilisation. En particulier, la reproduction
          des éléments graphiques du site, le téléchargement complet du site pour son enregistrement sur un support de
          diffusion, ainsi que toute utilisation des visuels et textes qu&apos;il contient autre que la consultation
          individuelle et privée sont interdits sauf autorisation expresse du directeur de la publication.
        </p>
        <h2 className="font-noto my-2 text-lg font-bold text-gray-800">Données personnelles :</h2>
        <h3 className="font-bold">1. Traitement des données personnelles :</h3>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), l&apos;association &quot;Chœur des
          Pays du Mont-Blanc&quot; traite vos données personnelles de manière licite, loyale et transparente. Nous
          tenons un registre des activités de traitement et mettons en œuvre les mesures techniques et
          organisationnelles appropriées pour assurer la sécurité de vos données.
        </p>

        <h3 className="font-bold">2. Vos droits :</h3>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité, de limitation
          du traitement et d&apos;opposition concernant vos données personnelles. Pour exercer ces droits,
          contactez-nous à l&apos;adresse :{" "}
          <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-600 hover:underline">
            bureau@choeurdespaysdumontblanc.fr
          </a>
        </p>

        <h3 className="font-bold">3. Contact délégué à la protection des données :</h3>
        <p>
          Pour toute question relative à la protection de vos données personnelles, vous pouvez nous contacter à :{" "}
          <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-600 hover:underline">
            bureau@choeurdespaysdumontblanc.fr
          </a>
        </p>

        <h3 className="mt-1 font-bold">4. Publicité électronique :</h3>
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
    </main>
  );
}
