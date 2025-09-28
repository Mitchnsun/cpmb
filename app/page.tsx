import Image from "next/image";

import MailIcon from "@/assets/icons/mail.svg";
import Carrousel from "@/components/Carrousel";
import Heading from "@/components/Heading";

/**
 * Home page (App Router, server component).
 * Renders: top carousel, About section, and a recruitment card with accessible labeling.
 */
export default function Home() {
  return (
    <div className="p-4">
      <div className="container mx-auto">
        <Carrousel />
      </div>
      <section className="py-4 text-zinc-900 lg:p-4">
        <article className="container mx-auto">
          <Heading className="mb-4">Le CPMB a le plaisir de vous présenter son nouveau Chef de Chœur !</Heading>
          <div className="flex flex-col items-start gap-8 text-justify sm:flex-row lg:items-center">
            <Image
              src="/media/benoit_dubu.jpg"
              alt="Portrait de Benoît Dubu"
              width={180}
              height={325}
              priority
              sizes="(min-width: 640px) 180px, 100vw"
              className="mx-auto h-80 w-full max-w-3xs grow-0 rounded-md object-cover lg:m-0 lg:h-auto"
            />
            <div>
              <p>Le CPMB est dirigé par Benoît Dubu, Chef de Chœur professionnel depuis le mois de janvier 2024.</p>
              <p className="pt-1">
                Le programme de la saison 2024/2025 est un programme &ldquo; autour des <i>Gloria</i> de Vivaldi et de
                Jenkins &rdquo;.
              </p>
              <p className="pt-1">De nombreux concerts sont déjà programmés :</p>
              <ul className="list-disc pt-1 pl-5">
                <li>14 juin 2025 : à l&apos;église de Boëge à 20h30.</li>
                <li>15 juin 2025 : à l&apos;église de Saint Gervais à 18h.</li>
              </ul>
              <p className="pt-1">Pour l&apos;occasion, nous serons accompagnés par deux talentueuses solistes :</p>
              <ul className="list-disc pt-1 pl-5">
                <li>Helena Duckert : soprano.</li>
                <li>Chloé Roussel : mezzo-soprano.</li>
              </ul>
              <p className="pt-1">Le 12 décembre 2025 : concert de Noël à l&apos;église de Vétraz-Monthoux à 18h.</p>
              <p className="pt-1">De la très belle musique pour cette nouvelle saison 2024/2025 !</p>
            </div>
          </div>
        </article>
      </section>
      <section className="bg-sky-50 py-4" aria-labelledby="recrutement-heading">
        <div className="container mx-auto py-10">
          <Heading hLevel={2} variant={1} id="recrutement-heading" className="mb-4">
            Le CPMB recrute !
          </Heading>
          <div className="max-w-xl rounded-md bg-white p-4 shadow-md">
            <Heading hLevel={3} variant={2} className="uppercase">
              Nous avons besoin de vos voix !
            </Heading>
            <p className="pt-3">
              Nous recrutons des choristes ayant une expérience chorale et /ou une capacité en déchiffrage.
            </p>
            <p>Celles et ceux qui souhaitent venir nous rejoindre peuvent demander des informations par courriel à</p>
            <p className="flex items-center gap-2 pt-2 md:pl-4">
              <MailIcon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="break-words text-sky-700 hover:underline">
                bureau@choeurdespaysdumontblanc.fr
              </a>
            </p>
            <p className="pt-3">N&apos;hésitez pas !</p>
          </div>
        </div>
      </section>
    </div>
  );
}
