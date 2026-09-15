import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

/**
 * The home page reads `concerts.json` at render time, and every concert in
 * it is now behind us: the assertions below describe the "season not
 * published yet" state, which is the live one.
 */
describe("Home page", () => {
  it("should lay out the five M2 sections in order", () => {
    const { container } = render(<Home />);

    const headings = [...container.querySelectorAll("h1, h2")].map((heading) => heading.textContent);
    expect(headings).toEqual([
      "Chœur des Paysdu Mont-Blanc", // the h1 is split over two lines by a <br>
      "Nous rejoindre",
      "Retour sur les dernières saisons",
      "Le chœur",
    ]);
    expect(screen.getByText("Partenaires")).toBeInTheDocument();
  });

  it("should derive the hero card and the list from the data alone", () => {
    render(<Home />);

    expect(screen.getByText("Programmation de la saison en préparation")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Retour sur les dernières saisons" })).toBeInTheDocument();
  });

  it("should list exactly three dates", () => {
    render(<Home />);

    const rows = screen.getAllByRole("link", { name: /^\d/ });
    expect(rows).toHaveLength(3);
    rows.forEach((row) => expect(row.getAttribute("href")).toMatch(/^\/nos-concerts\//));
  });

  it("should point both calls to action at the right pages", () => {
    render(<Home />);

    expect(screen.getByRole("link", { name: "Voir tous les concerts" })).toHaveAttribute("href", "/nos-concerts");
    expect(screen.getByRole("link", { name: "Rejoindre le chœur" })).toHaveAttribute(
      "href",
      "/contact?objet=rejoindre"
    );
  });
});
