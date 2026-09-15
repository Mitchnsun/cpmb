import { render, screen } from "@testing-library/react";

import ConcertCard from "@/components/ConcertCard";
import type { Concert } from "@/utils/concerts";

const concert = (extra: Partial<Concert> = {}): Concert =>
  ({
    title: "Concert Vivaldi Jenkins",
    slug: "gloria",
    date: ["2025-06-14T20:30:00+02:00"],
    location: "Église Saint-Pierre, Gaillard",
    media: "/concerts/affiche.jpg",
    ...extra,
  }) as unknown as Concert;

describe("ConcertCard", () => {
  it("should show the date in the upcoming colour, with its time below", () => {
    render(<ConcertCard concert={concert()} />);

    expect(screen.getByText("14 juin 2025")).toHaveClass("text-teal", "font-display");
    expect(screen.getByText("20h30")).toHaveClass("text-muted");
  });

  it("should join the times of a concert given twice", () => {
    render(<ConcertCard concert={concert({ date: ["2025-06-14T20:30:00+02:00", "2025-06-15T18:00:00+02:00"] })} />);

    expect(screen.getByText("14 et 15 juin 2025")).toBeInTheDocument();
    expect(screen.getByText("20h30 et 18h00")).toBeInTheDocument();
  });

  it("should leave out the time of a date that carries none", () => {
    render(<ConcertCard concert={concert({ date: ["2025-12-12"] })} />);

    expect(screen.getByText("12 décembre 2025")).toBeInTheDocument();
    expect(screen.queryByText(/h\d/)).not.toBeInTheDocument();
  });

  it("should link the venue to the concert page, naming the concert", () => {
    render(<ConcertCard concert={concert()} />);

    const link = screen.getByRole("link", { name: /Église Saint-Pierre, Gaillard/ });
    expect(link).toHaveAttribute("href", "/nos-concerts/gloria");
    expect(link).toHaveAccessibleName("Église Saint-Pierre, Gaillard — Concert Vivaldi Jenkins");
  });

  it("should list the programme when the concert has one", () => {
    render(
      <ConcertCard concert={concert({ programme: ["Gloria — Vivaldi", "Gloria — Jenkins"] } as Partial<Concert>)} />
    );

    expect(screen.getByText("Gloria — Vivaldi, Gloria — Jenkins")).toBeInTheDocument();
  });

  it("should offer the calendar file as a download, not as a page", () => {
    render(<ConcertCard concert={concert()} />);

    const download = screen.getByRole("link", { name: /Ajouter à mon agenda/ });
    expect(download).toHaveAttribute("href", "/nos-concerts/gloria/concert.ics");
    expect(download).toHaveAttribute("download");
    expect(download).toHaveAccessibleName("Ajouter à mon agenda : Concert Vivaldi Jenkins");
  });
});
