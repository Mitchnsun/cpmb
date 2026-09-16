import Image from "next/image";

import { HOME_HERO } from "@/assets/contents/medias";
import ButtonLink from "@/components/ButtonLink";
import Overline from "@/components/Overline";
import { type Concert, nextConcertDate } from "@/utils/concerts";
import { formatFrenchDate, formatFrenchTime } from "@/utils/formatDate";

/** The five lines of the decorative musical staff, in the SVG viewBox. */
const STAFF_LINES = [150, 178, 206, 234, 262];

/** Alpine ridge drawn over the staff. */
const RIDGE_POINTS = "0,360 180,300 300,330 470,210 560,268 700,160 820,250 960,205 1120,290 1260,240 1440,320";

interface HomeHeroProps {
  /**
   * Next concert still to come, or `undefined` when the season isn't
   * announced yet. The caller derives it from the data, never by hand: the
   * two states of the card hang entirely on this single value.
   */
  nextConcert?: Concert;
  /** Reference date, so the component stays pure and testable. */
  now: number;
}

/**
 * Home hero (CPMB-06): concert photo, darkened left to right, an animated
 * staff and ridge, then the choir's name and the "next concert" card.
 *
 * Height follows the content — no `100vh` — so the card stays visible
 * without scrolling on a 390px screen. Every animation is stopped by the
 * global `prefers-reduced-motion` rule, and since none of them fades the
 * content in from `opacity: 0` on its own, nothing stays invisible.
 */
const HomeHero = ({ nextConcert, now }: HomeHeroProps) => {
  const nextDate = nextConcert && nextConcertDate(nextConcert, now);
  const nextTime = nextDate ? formatFrenchTime(nextDate) : "";

  return (
    <section className="bg-stage-black relative overflow-hidden">
      <Image
        src={HOME_HERO.src}
        alt={HOME_HERO.alt}
        fill
        sizes={HOME_HERO.sizes}
        priority={HOME_HERO.priority}
        style={{ objectPosition: HOME_HERO.objectPosition }}
        className="object-cover"
      />
      {/* Darkened on the left, where the text sits: the contrast is measured
          against this gradient, not against the bare photo. */}
      <div
        aria-hidden="true"
        className="from-stage-black/92 via-stage-black/78 to-stage-black/60 absolute inset-0 bg-linear-90 via-55%"
      />
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <g className="animate-staff-draw stroke-stage-border stroke-1" fill="none" strokeDasharray="1400">
          {STAFF_LINES.map((y) => (
            <line key={y} x1="0" y1={y} x2="1440" y2={y} />
          ))}
        </g>
        <polyline
          points={RIDGE_POINTS}
          fill="none"
          strokeDasharray="2400"
          className="animate-ridge-draw stroke-teal-light stroke-2"
          style={{ animationDelay: "0.3s" }}
        />
      </svg>

      <div className="max-w-site relative mx-auto grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-end gap-12 px-6 pt-26 pb-24">
        <div className="animate-fade-up">
          <Overline className="text-copper-light mb-4.5">Depuis 2005 — Gaillard, Haute-Savoie</Overline>
          <h1 className="font-display text-h1 font-semibold text-white">
            Chœur des Pays
            <br />
            du Mont-Blanc
          </h1>
          <p className="text-text-on-dark mt-5.5 max-w-2xs text-lg">
            Partager la passion de la musique chorale au cœur des Alpes
          </p>
        </div>

        <div
          className="bg-stage-surface border-stage-border border-l-teal-light animate-fade-up border border-l-[3px] p-7"
          style={{ animationDelay: "0.15s" }}
        >
          <Overline className="text-teal-light mb-2.5">Prochain concert</Overline>
          {nextDate ? (
            <>
              <p className="font-display text-3xl text-white">{formatFrenchDate(nextDate)}</p>
              <p className="text-text-on-dark mt-2 text-lg">
                {nextTime ? (
                  <>
                    {nextTime}
                    <br />
                  </>
                ) : null}
                {nextConcert?.location}
              </p>
            </>
          ) : (
            <>
              <p className="font-display text-3xl text-white">Programmation de la saison en préparation</p>
              <p className="text-text-on-dark mt-3 text-lg">
                Les concerts de cette saison seront annoncés prochainement.
              </p>
            </>
          )}
          <ButtonLink href="/nos-concerts" tone="onDark" className="mt-5.5">
            Voir tous les concerts
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
