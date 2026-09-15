import type { Metadata } from "next";

import concerts from "@/assets/contents/concerts.json";
import { CONCERTS_BANNER } from "@/assets/contents/medias";
import PageBanner from "@/components/PageBanner";
import PastSeasons from "@/components/PastSeasons";
import UpcomingConcerts from "@/components/UpcomingConcerts";
import { groupConcertsBySeason, splitConcertsByDate } from "@/utils/concerts";

export const metadata: Metadata = {
  title: "Nos concerts - Chœur des Pays du Mont-Blanc",
  description:
    "Les prochains concerts du Chœur des Pays du Mont-Blanc et les saisons passées : dates, lieux et programmes en Haute-Savoie.",
  keywords: ["chœur", "mont-blanc", "concerts", "agenda", "haute-savoie", "musique classique", "saison"],
};

/**
 * The page is prerendered, then rebuilt at most once an hour: the split
 * between upcoming and past concerts happens at Paris midnight, and without
 * this a concert would only move sections on the next deploy (CPMB-11).
 */
export const revalidate = 3600;

/**
 * "Nos concerts" page — milestone M3.
 *
 * Banner (CPMB-12), the season still ahead or its empty state (CPMB-12),
 * then the past seasons as an accordion (CPMB-13). Both lists come from the
 * same data: no concert is filed by hand into one section or the other.
 */
export default function NosConcerts() {
  /* Rebuilt hourly (see `revalidate`), so the reference date stays fresh. */
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const { upcoming, past } = splitConcertsByDate(concerts, now);

  return (
    <>
      <PageBanner overline="Agenda" title="Nos concerts" image={CONCERTS_BANNER} />
      <UpcomingConcerts items={upcoming} />
      <PastSeasons seasons={groupConcertsBySeason(past)} />
    </>
  );
}
