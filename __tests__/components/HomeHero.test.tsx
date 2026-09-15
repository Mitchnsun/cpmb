import { render, screen } from "@testing-library/react";

import HomeHero from "@/components/HomeHero";
import type { Concert } from "@/utils/concerts";

const NOW = new Date("2025-06-01T12:00:00Z").getTime();

const concert = (dates: string[]): Concert =>
  ({
    title: "Concert Vivaldi Jenkins",
    slug: "concert-vivaldi-jenkins",
    date: dates,
    location: "Boëge et Saint-Gervais-les-Bains, France",
    media: "/concerts/affiche.jpg",
  }) as unknown as Concert;

describe("HomeHero", () => {
  describe("when no concert is ahead", () => {
    it("should announce that the season is being prepared", () => {
      render(<HomeHero now={NOW} />);

      expect(screen.getByText("Programmation de la saison en préparation")).toBeInTheDocument();
      expect(screen.getByText("Les concerts de cette saison seront annoncés prochainement.")).toBeInTheDocument();
    });

    it("should still link to the concerts page", () => {
      render(<HomeHero now={NOW} />);

      expect(screen.getByRole("link", { name: "Voir tous les concerts" })).toHaveAttribute("href", "/nos-concerts");
    });
  });

  describe("when a concert is ahead", () => {
    it("should show its date, time and venue", () => {
      render(<HomeHero nextConcert={concert(["2025-06-14T20:30:00+02:00"])} now={NOW} />);

      expect(screen.getByText("14 juin 2025")).toBeInTheDocument();
      expect(screen.getByText(/20h30/)).toBeInTheDocument();
      expect(screen.getByText(/Boëge et Saint-Gervais-les-Bains/)).toBeInTheDocument();
      expect(screen.queryByText("Programmation de la saison en préparation")).not.toBeInTheDocument();
    });

    it("should never show a date that has already passed", () => {
      render(<HomeHero nextConcert={concert(["2025-05-04T20:30:00+02:00", "2025-06-14T20:30:00+02:00"])} now={NOW} />);

      expect(screen.getByText("14 juin 2025")).toBeInTheDocument();
      expect(screen.queryByText("4 mai 2025")).not.toBeInTheDocument();
    });

    it("should omit the time line for a date-only concert", () => {
      render(<HomeHero nextConcert={concert(["2025-06-14"])} now={NOW} />);

      expect(screen.getByText("14 juin 2025")).toBeInTheDocument();
      expect(screen.getByText("Boëge et Saint-Gervais-les-Bains, France")).toBeInTheDocument();
    });

    it("should fall back to the pending state when every date of the concert is past", () => {
      render(<HomeHero nextConcert={concert(["2024-12-22T17:30:00+01:00"])} now={NOW} />);

      expect(screen.getByText("Programmation de la saison en préparation")).toBeInTheDocument();
      expect(screen.queryByText("22 décembre 2024")).not.toBeInTheDocument();
    });
  });

  it("should carry the choir name as the page title, on two lines", () => {
    render(<HomeHero now={NOW} />);

    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveTextContent(/Chœur des Pays\s*du Mont-Blanc/);
    expect(title.querySelector("br")).toBeInTheDocument();
  });

  it("should describe the photo and hide the decorative layers from screen readers", () => {
    const { container } = render(<HomeHero now={NOW} />);

    expect(screen.getByRole("img")).toHaveAttribute(
      "alt",
      "Le Chœur des Pays du Mont-Blanc et son orchestre en concert"
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelectorAll("[aria-hidden='true']").length).toBeGreaterThanOrEqual(2);
  });

  it("should draw the staff, then the ridge 0.3s later", () => {
    const { container } = render(<HomeHero now={NOW} />);

    expect(container.querySelectorAll("line")).toHaveLength(5);

    const ridge = container.querySelector("polyline");
    expect(ridge).toHaveClass("animate-ridge-draw");
    expect(ridge).toHaveStyle({ animationDelay: "0.3s" });
  });
});
