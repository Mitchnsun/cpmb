import Image from "next/image";

import MailIcon from "@/public/mail.svg";

export default function Home() {
  return (
    <>
      <main className="py-8 text-zinc-900">
        <article className="container mx-auto">
          <h3 className="mb-4 text-xl font-bold text-sky-700">
            Le CPMB a le plaisir de vous présenter son nouveau Chef de Chœur !
          </h3>
          <div className="flex items-center gap-8">
            <Image
              src="/media/benoit_dubu.jpg"
              alt="Benoît Dubu"
              width={200}
              height={350}
              className="rounded-md object-cover"
            />
            <div>
              <p>Le CPMB, est dirigé par Benoît Dubu, Chef de choeur professionnel depuis le mois de janvier 2024.</p>
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
      </main>
      <div className="bg-sky-50">
        <div className="container mx-auto py-10">
          <h3 className="mb-4 text-xl font-bold text-sky-700">Le CPMB recrute !</h3>
          <div className="max-w-1/2 rounded-md bg-white p-4 shadow-md">
            <h4 className="font-noto text-lg font-bold text-gray-800 uppercase">Nous avons besoin de vos voix !</h4>
            <p className="pt-3">
              Nous recrutons des choristes ayant une expérience chorale et /ou une capacité en déchiffrage.
            </p>
            <p>Celles et ceux qui souhaitent venir nous rejoindre peuvent demander des informations par courriel à</p>
            <p className="flex items-center gap-2 py-2 pl-4">
              <MailIcon className="h-5 w-5" />
              <a href="mailto:bureau@choeurdespaysdumontblanc.fr" className="text-sky-700 hover:underline">
                bureau@choeurdespaysdumontblanc.fr
              </a>
            </p>
            <p className="pt-3">N&apos;hésitez pas !</p>
          </div>
        </div>
      </div>
    </>
  );
}
