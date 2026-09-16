import { render, screen } from "@testing-library/react";

import UpcomingConcerts from "@/components/UpcomingConcerts";
import type { Concert } from "@/utils/concerts";

const GLORIA = {
  title: "Concert Vivaldi Jenkins",
  slug: "gloria",
  date: ["2025-06-14T20:30:00+02:00"],
  location: "Boëge",
  media: "/concerts/affiche.jpg",
} as unknown as Concert;

describe("UpcomingConcerts", () => {
  it("should title the section", () => {
    render(<UpcomingConcerts items={[GLORIA]} />);

    expect(screen.getByRole("heading", { level: 2, name: "Prochains concerts" })).toHaveClass("border-teal");
  });

  it("should render one card per concert still ahead", () => {
    render(<UpcomingConcerts items={[GLORIA, { ...GLORIA, slug: "noel", title: "Concert de Noël" }]} />);

    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("should announce that the season isn't programmed yet when no date is set", () => {
    render(<UpcomingConcerts items={[]} />);

    expect(screen.getByText("La saison n'est pas encore programmée")).toBeInTheDocument();
    expect(
      screen.getByText("Aucune date n'est arrêtée à ce jour. Les concerts de la saison seront annoncés sur cette page.")
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("should point the empty state at the contact page", () => {
    render(<UpcomingConcerts items={[]} />);

    expect(screen.getByRole("link", { name: "Nous contacter" })).toHaveAttribute("href", "/contact");
  });
});
