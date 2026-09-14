import concerts from "@/assets/contents/concerts.json";
import ChoirBanner from "@/components/ChoirBanner";
import HomeDates from "@/components/HomeDates";
import HomeHero from "@/components/HomeHero";
import JoinBanner from "@/components/JoinBanner";
import PartnersBanner from "@/components/PartnersBanner";
import { splitConcertsByDate } from "@/utils/concerts";

/** Number of dates listed on the home page, whichever state it is in. */
const HOME_DATES_COUNT = 3;

/**
 * Home page (App Router, server component) — milestone M2.
 *
 * Sections, in order: hero (CPMB-06), "Nous rejoindre" (CPMB-07), dates
 * (CPMB-08), "Le chœur" (CPMB-09), partners (CPMB-10).
 *
 * A single flag drives the two states of the hero card and of the list:
 * `announced` is true as soon as one concert still lies ahead. It is
 * computed from the data, never entered by hand.
 */
export default function Home() {
  // The page is statically prerendered, so the reference date is the build
  // date, not the visit date — a concert only moves to "past" on the next
  // deploy. Same knowing trade-off as `/nos-concerts`; CPMB-11 will settle
  // it for both pages.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const { upcoming, past } = splitConcertsByDate(concerts, now);
  const announced = upcoming.length > 0;

  return (
    <>
      <HomeHero nextConcert={upcoming[0]} now={now} />
      <JoinBanner />
      <HomeDates items={(announced ? upcoming : past).slice(0, HOME_DATES_COUNT)} upcoming={announced} />
      <ChoirBanner />
      <PartnersBanner />
    </>
  );
}
