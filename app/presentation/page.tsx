import type { Metadata } from "next";

import Artists from "@/assets/contents/artists.json";
import { PRESENTATION_BANNER } from "@/assets/contents/medias";
import ArtistArticle from "@/components/ArtistArticle";
import Carrousel from "@/components/Carrousel";
import PageBanner from "@/components/PageBanner";
import TextLink from "@/components/TextLink";

export const metadata: Metadata = {
  title: "Présentation - Chœur des Pays du Mont-Blanc",
  description:
    "Découvrez le Chœur des Pays du Mont-Blanc, ensemble vocal amateur de 30 choristes dirigé par Benoît Dubu. Créé en 2005, notre chœur propose des concerts de musique classique en Haute-Savoie.",
  keywords: [
    "chœur",
    "mont-blanc",
    "haute-savoie",
    "musique classique",
    "benoît dubu",
    "choristes",
    "concerts",
    "gaillard",
  ],
};

export default function Presentation() {
  const benoitDubu = Artists["benoit-dubu"];
  const agnesLorincz = Artists["agnes-lorincz"];
  const marjorieSaunier = Artists["marjorie-saunier"];

  return (
    <>
      <PageBanner overline="Le chœur" title="Présentation" image={PRESENTATION_BANNER} />

      <section className="max-w-site mx-auto px-6 pt-16 pb-16">
        {/* Three quarters of the container, centred: the block fills the page
            without stretching a paragraph across the full 1536px. */}
        <article className="mx-auto grid max-w-6xl gap-4">
          <h2 className="font-display mb-1 text-3xl font-semibold">Le chœur</h2>
          <p className="text-lg">
            Créé en mars 2005, le Chœur des Pays du Mont-Blanc, précédemment dénommé Chœur de l&apos;Orchestre
            Symphonique du Mont-Blanc, est composé de 30 choristes amateurs recrutés après audition, venant de
            différentes localités de la Haute-Savoie (Annecy, Sallanches, Thonon, Annemasse…). Il chante avec orchestre,
            mais également avec une formation plus réduite, un piano ou un orgue, voire a cappella.
          </p>
          <p className="text-lg">
            Il s&apos;est fait accompagner principalement par l&apos;Orchestre Symphonique du Mont-Blanc, sans exclure
            des concerts avec d&apos;autres orchestres.
          </p>
          <p className="text-lg">
            L&apos;objectif est de proposer à un public le plus large possible des interprétations de grande qualité.
            Notre vocation est de faire connaître et promouvoir la musique classique, permettant de rapprocher les
            musiciens et un large public, parfois non initié, en expliquant les œuvres musicales partant du principe
            qu&apos;« apprendre à écouter, c&apos;est découvrir l&apos;émotion ». Habituellement les orchestres qui nous
            accompagnent sont professionnels.
          </p>
          <p className="text-lg">
            La direction artistique et la direction du chœur sont assurées par Benoît Dubu, chef de chœur professionnel,
            ayant suivi une formation dans la classe de chant du CRR de Lyon et dans la classe de direction de chœur de
            Leslie Peeters à l&apos;ENM de Villeurbanne.
          </p>
          <p className="text-lg">
            Les répétitions ont lieu à l&apos;
            <TextLink
              href="https://www.gaillard.fr/espace-louis-simon/"
              aria-label="Visitez le site de l'Espace Louis-Simon - nouvelle fenêtre"
              target="_blank"
              rel="noopener noreferrer"
            >
              Espace Louis-Simon
            </TextLink>
            &nbsp;à Gaillard (salle Roger Duvanel), à raison de 9h par mois. Les répétitions commencent par un travail
            vocal afin d&apos;unifier les voix, et se poursuivent par le travail musical. Un travail individuel est
            réalisé par chaque choriste entre les répétitions.
          </p>
          <p className="text-lg">
            Les répétitions se tiennent un vendredi par mois, de 19h30 à 22h, et un dimanche par mois, de 10h à 16h.
            Nous pouvons vous communiquer le planning des répétitions : n&apos;hésitez pas à nous contacter !
          </p>
        </article>

        <div className="mx-auto mt-14 max-w-6xl">
          <Carrousel />
        </div>
      </section>

      <section className="bg-surface border-border border-y py-16">
        <div className="max-w-site mx-auto px-6">
          <div className="mx-auto max-w-6xl">
            <ArtistArticle
              name="Direction artistique – Benoît Dubu"
              media={benoitDubu.media}
              width={benoitDubu.width}
              height={benoitDubu.height}
              alt={benoitDubu.alt}
              text={benoitDubu.text}
              hLevel={2}
            />
          </div>
        </div>
      </section>

      <section className="max-w-site mx-auto px-6 pt-16 pb-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display border-teal mb-10 border-b-2 pb-3 text-3xl font-semibold">Instrumentistes</h2>
          {/* Side by side once two columns of 26rem fit, stacked below. */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(26rem,100%),1fr))] gap-x-12 gap-y-14">
            <ArtistArticle
              name={agnesLorincz.name}
              media={agnesLorincz.media}
              width={agnesLorincz.width}
              height={agnesLorincz.height}
              alt={agnesLorincz.alt}
              text={agnesLorincz.text}
              hLevel={3}
            />
            <ArtistArticle
              name={marjorieSaunier.name}
              media={marjorieSaunier.media}
              width={marjorieSaunier.width}
              height={marjorieSaunier.height}
              alt={marjorieSaunier.alt}
              text={marjorieSaunier.text}
              hLevel={3}
            />
          </div>
        </div>
      </section>
    </>
  );
}
