export default function Mentions() {
  return (
    <main className="p-4 text-zinc-900 lg:py-8">
      <article className="container mx-auto text-justify">
        <h3 className="mb-4 text-xl font-bold text-sky-700">Mentions légales</h3>
        <h4 className="font-noto mb-2 text-lg font-bold text-gray-800">Droits d&apos;auteurs et copyright :</h4>
        <p>
          Le site de l&apos;association &quot;Chœur des Pays du Mont-Blanc&quot; est protégé par la législation
          française et internationale sur le droit d&apos;auteur et la propriété intellectuelle. Les droits de
          l&apos;auteur de ce site sont réservés pour toute forme d&apos;utilisation. En particulier, la reproduction
          des éléments graphiques du site, le téléchargement complet du site pour son enregistrement sur un support de
          diffusion, ainsi que toute utilisation des visuels et textes qu&apos;il contient autre que la consultation
          individuelle et privée sont interdits sauf autorisation expresse du directeur de la publication.
        </p>
        <h4 className="font-noto my-2 text-lg font-bold text-gray-800">Données personnelles :</h4>
        <h5 className="font-bold">1. Déclaration à la CNIL :</h5>
        <p>
          Conformément à l&apos;article n° 2010-229 du 10 juin 2010 dispensant de déclaration les traitements
          automatisés de données à caractère personnel mis en œuvre par des organismes à but non lucratif abrogeant et
          remplaçant la délibération n° 2006-130 du 9 mai 2006, il n&apos;y a pas de déclaration de fichier à la CNIL.
        </p>
        <h5 className="mt-1 font-bold">2. Collecte de données personnelles :</h5>
        <p>
          Les données personnelles sont des informations qui, par un moyen direct ou indirect, permettent de désigner
          momentanément un utilisateur et de le rattacher éventuellement aux données collectées.
        </p>
        <p>
          Le site de l&apos;association ne collecte pas d&apos;informations personnelles permettant de vous identifier.
          A l&apos;exception des membres de l&apos;association, les données collectées sont uniquement l&apos;adresse de
          votre courriel. Cette dernière n&apos;est pas cédée ou revendue.
        </p>
        <p>
          Conformément à la loi &quot;Informatique et Libertés&quot; du 6 janvier 1978 modifiée en 2004, vous disposez
          d&apos;un droit d&apos;accès, de rectification et de suppression des données vous concernant. Pour exercer ce
          droit, vous pouvez nous contacter à l&apos;adresse suivante :&nbsp;
          <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-700 hover:underline">
            bureau@choeurdespaysdumontblanc.fr
          </a>
          .
        </p>
        <h5 className="mt-1 font-bold">3. Publicité électronique :</h5>
        <p>
          L&apos;envoi de courrier électronique à des fins de publicité suppose que vous ayez exprimé votre accord
          préalable. Vous pouvez vous opposer à l&apos;utilisation de ces coordonnées par courrier envoyé à
          l&apos;adresse de l&apos;association ou par désincription lors de la réception d&apos;un courriel de type
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
