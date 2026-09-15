import ButtonLink from "@/components/ButtonLink";
import ConcertCard from "@/components/ConcertCard";
import InfoPanel from "@/components/InfoPanel";
import { type Concert } from "@/utils/concerts";

interface UpcomingConcertsProps {
  /** Concerts still ahead, soonest first, as the page derived them. */
  items: readonly Concert[];
}

/**
 * "Prochains concerts" section (CPMB-12). Two states, both driven by the
 * data alone: the cards when a season is published, the panel below when no
 * date has been set yet — a past date can never surface here, the split is
 * made against local midnight.
 *
 * The rules between cards are the 1px gaps of the grid, not borders.
 */
const UpcomingConcerts = ({ items }: UpcomingConcertsProps) => (
  <section className="max-w-site mx-auto px-6 pt-16 pb-6" aria-labelledby="prochains-concerts">
    <h2 id="prochains-concerts" className="font-display border-teal mb-6 border-b-2 pb-3 text-3xl font-semibold">
      Prochains concerts
    </h2>

    {items.length > 0 ? (
      <div className="bg-border grid gap-px">
        {items.map((concert) => (
          <ConcertCard key={concert.slug} concert={concert} />
        ))}
      </div>
    ) : (
      <InfoPanel className="p-8" aria-live="polite">
        <p className="font-display text-3xl">La saison n&apos;est pas encore programmée</p>
        <p className="text-muted mt-3 max-w-[62ch] text-lg">
          Aucune date n&apos;est arrêtée à ce jour. Les concerts de la saison seront annoncés sur cette page.
        </p>
        <ButtonLink href="/contact" className="mt-5.5">
          Nous contacter
        </ButtonLink>
      </InfoPanel>
    )}
  </section>
);

export default UpcomingConcerts;
