import { render, screen } from "@testing-library/react";

import PastConcertRow from "@/components/PastConcertRow";
import type { Concert } from "@/utils/concerts";

const concert = (extra: Partial<Concert> = {}): Concert =>
  ({
    title: "Concert de Noël, 13 décembre 2024, Vétraz-Monthoux",
    slug: "noel-2024",
    date: ["2024-12-13T20:00:00+01:00"],
    location: "Église de Vétraz-Monthoux",
    media: "/concerts/affiche.jpg",
    ...extra,
  }) as unknown as Concert;

describe("PastConcertRow", () => {
  it("should show the date in the copper of past concerts, spelled out in French", () => {
    render(<PastConcertRow concert={concert()} />);

    expect(screen.getByText("13 décembre 2024")).toHaveClass("text-copper", "font-display");
  });

  it("should show the poster as a lazy portrait thumbnail", () => {
    render(<PastConcertRow concert={concert()} />);

    const poster = screen.getByAltText("Affiche du concert : Concert de Noël, 13 décembre 2024, Vétraz-Monthoux");
    expect(poster).toHaveClass("aspect-3/4", "max-w-[90px]");
  });

  it("should drop the poster column rather than leave a hole", () => {
    const { container } = render(<PastConcertRow concert={concert({ media: "" })} />);

    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("article")?.className).toContain(
      "menu:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
    );
  });

  it("should keep a column for the poster when the concert has one", () => {
    const { container } = render(<PastConcertRow concert={concert()} />);

    expect(container.querySelector("article")?.className).toContain(
      "menu:grid-cols-[minmax(0,90px)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]"
    );
  });

  it("should stack into a single column below the mobile breakpoint", () => {
    const { container } = render(<PastConcertRow concert={concert()} />);

    expect(container.querySelector("article")).toHaveClass("grid", "gap-2", "menu:gap-5");
  });

  it("should show the programme when the concert has one", () => {
    render(<PastConcertRow concert={concert({ programme: ["Messe en ré, Dvořák"] } as Partial<Concert>)} />);

    expect(screen.getByText("Messe en ré, Dvořák")).toHaveClass("text-muted");
  });

  it("should link to the concert page, naming the concert", () => {
    render(<PastConcertRow concert={concert()} />);

    const link = screen.getByRole("link", { name: /Voir le concert/ });
    expect(link).toHaveAttribute("href", "/nos-concerts/noel-2024");
    expect(link).toHaveAccessibleName("Voir le concert : Concert de Noël, 13 décembre 2024, Vétraz-Monthoux");
  });
});
