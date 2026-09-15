"use client";

import { useState, useSyncExternalStore } from "react";

import PastConcertRow from "@/components/PastConcertRow";
import { type Season } from "@/utils/concerts";

interface PastSeasonsProps {
  /** Seasons built from the data, most recent first. */
  seasons: readonly Season[];
}

/** "3 concerts" / "1 concert". */
const concertCount = (total: number): string => `${total} ${total > 1 ? "concerts" : "concert"}`;

/** The address bar is the external system this section reads its anchor from. */
const subscribeToHash = (onChange: () => void): (() => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

const currentHash = (): string => window.location.hash.slice(1);

/** No anchor is known while rendering on the server. */
const noHash = (): string => "";

/**
 * Past concerts, one accordion panel per season (CPMB-13). Copper is the
 * accent of this section and of nothing else on the page.
 *
 * The most recent season is open on arrival; coming back from a concert page
 * the anchor of its season (`#saison-2024-2025`) reopens the one the visitor
 * left, and the browser scrolls to it on its own. A closed panel is hidden,
 * so neither the keyboard nor a screen reader walks through it.
 */
const PastSeasons = ({ seasons }: PastSeasonsProps) => {
  const anchor = useSyncExternalStore(subscribeToHash, currentHash, noHash);
  /* `null` while the visitor hasn't clicked: the anchor, then the most
     recent season, decide on their own. "" means everything is closed. */
  const [chosen, setChosen] = useState<string | null>(null);

  const fromAnchor = seasons.some((season) => season.id === anchor) ? anchor : undefined;
  const openId = chosen ?? fromAnchor ?? seasons[0]?.id;

  /* Closing the open season means "nothing open", whether it was opened by
     a click, by the anchor or by default. */
  const toggle = (id: string) => setChosen(openId === id ? "" : id);

  if (seasons.length === 0) return null;

  return (
    <section className="max-w-site mx-auto px-6 pt-12 pb-20" aria-labelledby="concerts-passes">
      <h2
        id="concerts-passes"
        className="font-display border-copper text-copper mb-2 border-b-2 pb-3 text-3xl font-semibold"
      >
        Concerts passés
      </h2>

      {seasons.map((season) => {
        const open = season.id === openId;

        return (
          <div key={season.id} id={season.id} className="border-border border-b">
            <button
              type="button"
              id={`${season.id}-header`}
              aria-expanded={open}
              aria-controls={`${season.id}-panel`}
              onClick={() => toggle(season.id)}
              className="flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 py-3.5 text-left"
            >
              <span className="font-display text-copper text-2xl">Saison {season.label}</span>
              <span className="text-muted font-mono text-sm">{concertCount(season.concerts.length)}</span>
            </button>

            <div
              id={`${season.id}-panel`}
              role="region"
              aria-labelledby={`${season.id}-header`}
              hidden={!open}
              className="pb-7"
            >
              {season.concerts.map((concert) => (
                <PastConcertRow key={concert.slug} concert={concert} />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default PastSeasons;
