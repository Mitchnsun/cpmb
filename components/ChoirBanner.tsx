import Image from "next/image";

import { CHOIR_PORTRAIT } from "@/assets/contents/medias";

/**
 * "Le chœur" banner (CPMB-09): photo on one side, the choir's story and its
 * motto on the other, on stage black. The `object-position` of the media
 * library keeps the singers in frame at every width.
 */
const ChoirBanner = () => (
  <section className="bg-stage-black" aria-labelledby="le-choeur">
    <div className="max-w-site mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-center gap-14 px-6 py-20">
      <Image
        src={CHOIR_PORTRAIT.src}
        alt={CHOIR_PORTRAIT.alt}
        width={CHOIR_PORTRAIT.width}
        height={CHOIR_PORTRAIT.height}
        sizes={CHOIR_PORTRAIT.sizes}
        loading="lazy"
        style={{ objectPosition: CHOIR_PORTRAIT.objectPosition }}
        className="border-stage-border aspect-4/3 w-full border object-cover"
      />
      <div>
        <h2 id="le-choeur" className="font-display mb-4.5 text-3xl font-semibold text-white">
          Le chœur
        </h2>
        <p className="text-text-on-dark mb-4 text-lg">
          Créé en 2005 à Gaillard, le Chœur des Pays du Mont-Blanc réunit trente choristes amateurs recrutés sur
          audition. Il est dirigé par le chef de chœur professionnel Benoît Dubu.
        </p>
        <p className="text-text-on-dark mb-8 text-lg">
          Le chœur chante avec orchestre un répertoire classique et sacré : Vivaldi, Mozart, Michael Haydn, Dvořák,
          Rheinberger, Jenkins.
        </p>
        <blockquote className="font-display border-l-copper-light border-l-2 pl-5.5 text-2xl text-white">
          « Apprendre à écouter, c’est découvrir l’émotion »
        </blockquote>
      </div>
    </div>
  </section>
);

export default ChoirBanner;
