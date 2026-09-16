import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import NosConcerts, { metadata, revalidate } from "@/app/nos-concerts/page";
import concerts from "@/assets/contents/concerts.json";
import { CONCERTS_BANNER } from "@/assets/contents/medias";
import { groupConcertsBySeason, splitConcertsByDate } from "@/utils/concerts";

/** A day when the June 2025 concert is still ahead. */
const BEFORE_GLORIA = new Date("2025-06-01T12:00:00Z");

/** A day when every concert of the data is behind us. */
const AFTER_EVERYTHING = new Date("2026-09-15T12:00:00Z");

describe("NosConcertsPage", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("should open on the agenda banner", () => {
    vi.setSystemTime(AFTER_EVERYTHING);
    render(<NosConcerts />);

    expect(screen.getByRole("heading", { level: 1, name: "Nos concerts" })).toBeInTheDocument();
    expect(screen.getByText("Agenda")).toBeInTheDocument();
    expect(screen.getByAltText(CONCERTS_BANNER.alt)).toBeInTheDocument();
  });

  it("should list the concerts still ahead as cards", () => {
    vi.setSystemTime(BEFORE_GLORIA);
    render(<NosConcerts />);

    const { upcoming } = splitConcertsByDate(concerts, BEFORE_GLORIA.getTime());
    expect(upcoming.length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Ajouter à mon agenda/ })).toHaveLength(upcoming.length);
  });

  it("should fall back on the empty state once every date has passed", () => {
    vi.setSystemTime(AFTER_EVERYTHING);
    render(<NosConcerts />);

    expect(screen.getByText("La saison n'est pas encore programmée")).toBeInTheDocument();
  });

  it("should group the past concerts into the seasons read from the data", () => {
    vi.setSystemTime(AFTER_EVERYTHING);
    render(<NosConcerts />);

    const { past } = splitConcertsByDate(concerts, AFTER_EVERYTHING.getTime());
    const seasons = groupConcertsBySeason(past);

    expect(screen.getByRole("heading", { level: 2, name: "Concerts passés" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /^Saison / })).toHaveLength(seasons.length);
    expect(screen.getByRole("button", { name: new RegExp(`Saison ${seasons[0].label}`) })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("should be rebuilt hourly so a concert moves section on its own", () => {
    expect(revalidate).toBe(3600);
  });

  it("should carry its own metadata, canonical address included", () => {
    expect(metadata.title).toBe("Nos concerts");
    expect(metadata.alternates?.canonical).toBe("/nos-concerts");
    expect(metadata.openGraph?.url).toBe("/nos-concerts");
  });
});
