import Image from "next/image";

import MailIcon from "@/assets/icons/mail.svg";
import Carrousel from "@/components/Carrousel";

/**
 * Home page (App Router, server component).
 * Renders: top carousel, About section, and a recruitment card with accessible labeling.
 */
export default function Home() {
  return (
    <>
      <div className="container mx-auto p-4 lg:px-0 lg:pt-8">
        <Carrousel />
      </div>
      <section className="p-4 text-zinc-900 lg:p-8">
        <article className="container mx-auto">
          <h1 className="mb-4 text-xl font-bold text-sky-700">
            Le CPMB a le plaisir de vous présenter son nouveau Chef de Chœur !
          </h1>
          <div className="flex flex-col items-start gap-8 text-justify sm:flex-row lg:items-center">
            <Image
              src="/media/benoit_dubu.jpg"
              alt="Portrait de Benoît Dubu"
              width={180}
              height={325}
              priority
              sizes="(min-width: 1024px) 15rem, 100vw"
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
      <section className="bg-sky-50 p-4" aria-labelledby="recrutement-heading">
        <div className="container mx-auto py-10">
          <h2 id="recrutement-heading" className="mb-4 text-xl font-bold text-sky-700">
            Le CPMB recrute !
          </h2>
          <div className="max-w-xl rounded-md bg-white p-4 shadow-md">
            <h3 className="font-noto text-lg font-bold text-gray-800 uppercase">Nous avons besoin de vos voix !</h3>
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
    </>
  );
}
