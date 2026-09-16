import ButtonLink from "@/components/ButtonLink";
import Overline from "@/components/Overline";

/**
 * "Nous rejoindre" banner (CPMB-07): full-width teal strip between the hero
 * and the dates. Text is pure white, never translucent, to hold the 4.5:1
 * contrast over `#0E6E92`.
 *
 * The button carries `?objet=rejoindre`, which preselects the matching
 * subject in the contact form.
 */
const JoinBanner = () => (
  <section className="bg-teal" aria-labelledby="nous-rejoindre">
    <div className="max-w-site mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] items-center gap-10 px-6 py-14">
      <div>
        <h2 id="nous-rejoindre" className="font-display mb-3.5 text-3xl font-semibold text-white">
          Nous rejoindre
        </h2>
        <Overline className="mb-2 text-base text-white">Nous avons besoin de vos voix !</Overline>
        <p className="max-w-md text-lg text-white">
          Le chœur recrute des choristes ayant une expérience chorale et/ou une capacité en déchiffrage. Le recrutement
          se fait après audition.
        </p>
      </div>
      <div className="text-lg text-white">
        <p className="mb-1.5 font-semibold">Espace Louis-Simon, salle Roger Duvanel — Gaillard</p>
        <p>
          Un vendredi par mois, 19h30 – 22h
          <br />
          Un dimanche par mois, 10h – 16h
        </p>
        {/* Full width below the mobile breakpoint, so the target is easy to hit. */}
        <ButtonLink
          href="/contact?objet=rejoindre"
          tone="onTeal"
          className="max-menu:w-full max-menu:justify-center mt-5.5"
        >
          Rejoindre le chœur
        </ButtonLink>
      </div>
    </div>
  </section>
);

export default JoinBanner;
