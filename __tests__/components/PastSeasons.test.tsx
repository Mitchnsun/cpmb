import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PastSeasons from "@/components/PastSeasons";
import type { Concert, Season } from "@/utils/concerts";

const concert = (slug: string): Concert =>
  ({
    title: slug,
    slug,
    date: ["2024-12-13T20:00:00+01:00"],
    location: "Église de Vétraz-Monthoux",
    media: "/concerts/affiche.jpg",
  }) as unknown as Concert;

const SEASONS: Season[] = [
  { label: "2024 – 2025", id: "saison-2024-2025", concerts: [concert("gloria"), concert("noel-2024")] },
  { label: "2023 – 2024", id: "saison-2023-2024", concerts: [concert("noel-2023")] },
];

const setHash = (hash: string) => {
  window.location.hash = hash;
};

describe("PastSeasons", () => {
  beforeEach(() => {
    setHash("");
  });

  it("should title the section in the copper reserved for the past", () => {
    render(<PastSeasons seasons={SEASONS} />);

    expect(screen.getByRole("heading", { level: 2, name: "Concerts passés" })).toHaveClass("text-copper");
  });

  it("should count the concerts of every season", () => {
    render(<PastSeasons seasons={SEASONS} />);

    expect(screen.getByText("2 concerts")).toBeInTheDocument();
    expect(screen.getByText("1 concert")).toBeInTheDocument();
  });

  it("should open the most recent season and leave the others closed", () => {
    render(<PastSeasons seasons={SEASONS} />);

    expect(screen.getByRole("button", { name: /Saison 2024 – 2025/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Saison 2023 – 2024/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("should keep a closed panel out of reach", () => {
    render(<PastSeasons seasons={SEASONS} />);

    expect(document.getElementById("saison-2023-2024-panel")).toHaveAttribute("inert");
    expect(document.getElementById("saison-2024-2025-panel")).not.toHaveAttribute("inert");
  });

  it("should collapse a closed panel and expand the open one", () => {
    render(<PastSeasons seasons={SEASONS} />);

    expect(document.getElementById("saison-2023-2024-panel")).toHaveClass("grid-rows-[0fr]");
    expect(document.getElementById("saison-2024-2025-panel")).toHaveClass("grid-rows-[1fr]");
  });

  it("should point the chevron down for a closed season and up for the open one", () => {
    render(<PastSeasons seasons={SEASONS} />);

    const openHeader = screen.getByRole("button", { name: /Saison 2024 – 2025/ });
    const closedHeader = screen.getByRole("button", { name: /Saison 2023 – 2024/ });

    expect(openHeader.querySelector("svg")).toHaveClass("rotate-180");
    expect(closedHeader.querySelector("svg")).not.toHaveClass("rotate-180");
  });

  it("should point every header at the panel it controls", () => {
    render(<PastSeasons seasons={SEASONS} />);

    const header = screen.getByRole("button", { name: /Saison 2024 – 2025/ });
    expect(header).toHaveAttribute("aria-controls", "saison-2024-2025-panel");
    expect(document.getElementById("saison-2024-2025-panel")).toHaveAttribute(
      "aria-labelledby",
      "saison-2024-2025-header"
    );
  });

  it("should open the season the visitor clicks and close the one that was open", async () => {
    const user = userEvent.setup();
    render(<PastSeasons seasons={SEASONS} />);

    await user.click(screen.getByRole("button", { name: /Saison 2023 – 2024/ }));

    expect(screen.getByRole("button", { name: /Saison 2023 – 2024/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Saison 2024 – 2025/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("should close the open season when its header is pressed again", async () => {
    const user = userEvent.setup();
    render(<PastSeasons seasons={SEASONS} />);

    await user.click(screen.getByRole("button", { name: /Saison 2024 – 2025/ }));

    expect(screen.getByRole("button", { name: /Saison 2024 – 2025/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("should reopen the season named by the anchor, on return from a concert page", () => {
    setHash("#saison-2023-2024");

    render(<PastSeasons seasons={SEASONS} />);

    expect(screen.getByRole("button", { name: /Saison 2023 – 2024/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /Saison 2024 – 2025/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("should ignore an anchor that names no season", () => {
    setHash("#saison-1999-2000");

    render(<PastSeasons seasons={SEASONS} />);

    expect(screen.getByRole("button", { name: /Saison 2024 – 2025/ })).toHaveAttribute("aria-expanded", "true");
  });

  it("should render nothing when no season has a concert", () => {
    const { container } = render(<PastSeasons seasons={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
