import type { Metadata } from "next";
import Image from "next/image";

import Artists from "@/assets/contents/artists.json";
import ArtistArticle from "@/components/ArtistArticle";
import Heading from "@/components/Heading";

export const metadata: Metadata = {
  title: "Présentation - Chœur des Pays du Mont-Blanc",
  description:
    "Découvrez le Chœur des Pays du Mont-Blanc, ensemble vocal amateur de 30 choristes dirigé par Benoît Dubu. Créé en 2005, notre chœur propose des concerts de musique classique en Haute-Savoie.",
  keywords: "chœur, mont-blanc, haute-savoie, musique classique, benoît dubu, choristes, concerts, gaillard",
};

export default function Presentation() {
  const benoitDubu = Artists["benoit-dubu"];
  const agnesLorincz = Artists["agnes-lorincz"];
  const marjorieSaunier = Artists["marjorie-saunier"];

  return (
    <>
      <section
        className="relative mx-auto mb-4 h-80 w-full md:h-96 lg:mb-8 xl:h-128 2xl:mt-8"
        style={{ maxWidth: 1536 }}
      >
        <Image
          src="/carrousel/CPMB2.jpg"
          alt="Description"
          priority
          fill
          sizes="100vw"
          className="object-cover 2xl:rounded-md"
        />
        <Heading
          hLevel={1}
          variant={0}
          className="absolute bottom-8 w-full text-center text-5xl text-white text-shadow-sm md:text-6xl lg:text-7xl"
        >
          Présentation
        </Heading>
      </section>
      <section className="px-4">
        <article className="container mx-auto text-justify">
          <Heading hLevel={2} className="mb-2">
            Le Choeur
          </Heading>
          <p className="mb-2">
            Créé en mars 2005, le Choeur des Pays du Mont-Blanc, précédemment dénommé Chœur de l&apos;Orchestre
            Symphonique du Mont-Blanc, est composé de 30 choristes amateurs recrutés après audition, venant de
            différentes localités de la Haute Savoie (Annecy, Sallanches, Thonon, Annemasse...etc). Il chante avec
            orchestre, mais également avec une formation plus réduite, un piano ou un orgue, voire a cappella.
          </p>
          <p className="mb-2">
            Il s&apos;est fait accompagner principalement par l&apos;Orchestre Symphonique du Mont-Blanc, sans exclure
            des concerts avec d&apos;autres orchestres.
          </p>
          <p className="mb-2">
            L&apos;objectif est de proposer à un public le plus large possible des interprétations de grande qualité.
            Notre vocation est de faire connaître et promouvoir la musique classique, permettant de rapprocher les
            musiciens et un large public, parfois non initié, en expliquant les œuvres musicales partant du principe
            qu&apos; &quot;Apprendre à écouter, c&apos;est découvrir l&apos;émotion&quot;. Habituellement les orchestres
            qui nous accompagnent sont professionnels.
          </p>
          <p className="mb-2">
            La direction artistique et la direction du chœur sont assurées par Benoît Dubu, chef de choeur
            professionnel, ayant suivi une formation dans la classe de chant du CRR de Lyon et dans la classe de
            direction de choeur de Leslie Peeters à l&apos;ENM de Villeurbanne.
          </p>
          <p className="mb-2">
            Les répétitions ont lieu à l&apos;
            <a
              href="https://www.gaillard.fr/espace-louis-simon/"
              aria-label="Visitez le site de l'Espace Louis-Simon - nouvelle fenêtre"
              className="text-sky-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Espace Louis-Simon
            </a>
            &nbsp;à Gaillard (salle Roger Duvanel), à raison de 9h par mois. Les répétitions commencent par un travail
            vocal afin d&apos;unifier les voix, et se poursuit par le travail musical. Un travail individuel est réalisé
            par chaque choriste entre les répétitions.
          </p>
          <p>
            Les répétitions se tiennent un vendredi par mois, de 19h30 à 22h, et un dimanche par mois, de 10h à 16h.
            Nous pouvons vous communiquer le planning des répétitions : n&apos;hésitez pas à nous contacter !
          </p>
        </article>
      </section>
      <section className="my-4 bg-sky-50 p-4 lg:my-8">
        <ArtistArticle
          name="Direction artistique – Benoît Dubu"
          media={benoitDubu.media}
          alt={benoitDubu.alt}
          text={benoitDubu.text}
          hLevel={2}
        />
      </section>
      <section className="p-4">
        <div className="container m-auto">
          <Heading
            hLevel={2}
            variant={0}
            className="relative -left-2 mb-8 inline-block w-1/2 border-b-2 border-sky-700 pb-2 text-xl font-bold tracking-tight lg:-left-4"
          >
            Instrumentistes
          </Heading>
        </div>

        <ArtistArticle
          name={agnesLorincz.name}
          media={agnesLorincz.media}
          alt={agnesLorincz.alt}
          text={agnesLorincz.text}
          hLevel={3}
        />
        <br />
        <ArtistArticle
          name={marjorieSaunier.name}
          media={marjorieSaunier.media}
          alt={marjorieSaunier.alt}
          text={marjorieSaunier.text}
          hLevel={3}
        />
      </section>
    </>
  );
}
