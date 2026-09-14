import { render, screen } from "@testing-library/react";

import HomeDates from "@/components/HomeDates";
import type { Concert } from "@/utils/concerts";

const concert = (slug: string, dates: string[], extra: Partial<Concert> = {}): Concert =>
  ({
    title: slug,
    slug,
    date: dates,
    location: "Église de Vétraz-Monthoux, France",
    media: "/concerts/affiche.jpg",
    ...extra,
  }) as unknown as Concert;

const NOEL = concert("concert-de-noel", ["2024-12-13T20:00:00+01:00"]);
const GLORIA = concert("concert-gloria", ["2025-06-14T20:30:00+02:00", "2025-06-15T18:00:00+02:00"], {
  programme: ["Gloria — Antonio Vivaldi", "Gloria (extraits) — Karl Jenkins"],
} as Partial<Concert>);

describe("HomeDates", () => {
  it("should title the section after the published season and colour the dates teal", () => {
    render(<HomeDates items={[GLORIA]} upcoming />);

    expect(screen.getByRole("heading", { level: 2, name: "Trois prochaines dates" })).toBeInTheDocument();
    expect(screen.getByText("14 et 15 juin 2025")).toHaveClass("text-teal");
  });

  it("should look back at past seasons and colour the dates copper", () => {
    render(<HomeDates items={[NOEL]} upcoming={false} />);

    expect(screen.getByRole("heading", { level: 2, name: "Retour sur les dernières saisons" })).toBeInTheDocument();
    expect(screen.getByText("13 décembre 2024")).toHaveClass("text-copper");
  });

  it("should list venue and programme next to the date", () => {
    render(<HomeDates items={[GLORIA]} upcoming />);

    expect(screen.getByText("Église de Vétraz-Monthoux, France")).toBeInTheDocument();
    expect(screen.getByText("Gloria — Antonio Vivaldi, Gloria (extraits) — Karl Jenkins")).toBeInTheDocument();
  });

  it("should leave the programme column empty when the concert has none", () => {
    render(<HomeDates items={[NOEL]} upcoming={false} />);

    expect(screen.queryByText(/Gloria/)).not.toBeInTheDocument();
  });

  it("should make each row a link to the concert page", () => {
    render(<HomeDates items={[NOEL, GLORIA]} upcoming={false} />);

    expect(screen.getByRole("link", { name: /13 décembre 2024/ })).toHaveAttribute(
      "href",
      "/nos-concerts/concert-de-noel"
    );
    expect(screen.getByRole("link", { name: /14 et 15 juin 2025/ })).toHaveAttribute(
      "href",
      "/nos-concerts/concert-gloria"
    );
  });

  it("should link to the full concerts page", () => {
    render(<HomeDates items={[NOEL]} upcoming={false} />);

    expect(screen.getByRole("link", { name: "Tous les concerts" })).toHaveAttribute("href", "/nos-concerts");
  });

  it("should collapse the three columns into one below the mobile breakpoint", () => {
    render(<HomeDates items={[NOEL]} upcoming={false} />);

    const row = screen.getByRole("link", { name: /13 décembre 2024/ });
    expect(row).toHaveClass("grid", "gap-2", "items-start");
    expect(row.className).toMatch(/menu:grid-cols-\[minmax\(0,200px\)_minmax\(0,1fr\)_minmax\(0,1\.2fr\)\]/);
  });

  it("should render nothing at all when there is no date to show", () => {
    const { container } = render(<HomeDates items={[]} upcoming />);

    expect(container).toBeEmptyDOMElement();
  });
});
