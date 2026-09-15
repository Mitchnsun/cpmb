import { render, screen, within } from "@testing-library/react";

import Footer from "@/components/Footer";

describe("Footer", () => {
  it("should render the footer element", () => {
    const { container } = render(<Footer />);

    expect(container).toMatchSnapshot();
  });

  it("should render the logo and the baseline", () => {
    render(<Footer />);

    expect(screen.getByRole("img", { name: "Chœur des Pays du Mont-Blanc" })).toBeInTheDocument();
    expect(screen.getByText("Partager la passion de la musique chorale au cœur des Alpes.")).toBeInTheDocument();
  });

  it("should list the site map links", () => {
    render(<Footer />);

    const sitemap = screen.getByRole("navigation", { name: "Plan du site" });
    const links = within(sitemap).getAllByRole("link");

    expect(links.map((link) => link.textContent)).toEqual([
      "Accueil",
      "Présentation",
      "Nos concerts",
      "Presse",
      "Contact",
      "Mentions légales",
    ]);
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/",
      "/presentation",
      "/nos-concerts",
      "/presse",
      "/contact",
      "/mentions-legales",
    ]);
  });

  it("should expose the contact e-mail as a mailto link and the rehearsal address", () => {
    render(<Footer />);

    const email = screen.getByRole("link", { name: "bureau@choeurdespaysdumontblanc.fr" });
    expect(email).toHaveAttribute("href", "mailto:bureau@choeurdespaysdumontblanc.fr");
    expect(screen.getByText("Espace Louis-Simon, Gaillard (74240)")).toBeInTheDocument();
  });

  it("should link to the partners' sites, without logos", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "Ville de Gaillard" })).toHaveAttribute("href", "https://www.gaillard.fr/");
    expect(screen.getByRole("link", { name: "Département de la Haute-Savoie" })).toHaveAttribute(
      "href",
      "https://www.hautesavoie.fr/"
    );
    expect(screen.getByRole("link", { name: "Véran Pianos" })).toHaveAttribute("href", "https://www.veran-piano.com/");
    // Only the choir logo is an image in the footer.
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });

  it("should link to the artists", () => {
    render(<Footer />);

    const artists = screen.getByRole("navigation", { name: "Artistes" });
    const links = within(artists).getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => expect(link.getAttribute("href")).toMatch(/^\/presentation\/.+/));
  });

  it("should render the legal line", () => {
    render(<Footer />);

    expect(
      screen.getByText("Chœur des Pays du Mont-Blanc — association créée en 2005 à Gaillard, Haute-Savoie.")
    ).toBeInTheDocument();
  });

  it("should render the copyright line with the current year", () => {
    render(<Footer />);

    expect(screen.getByText(`© ${new Date().getFullYear()} — Tous droits réservés`)).toBeInTheDocument();
  });

  it("should not leave any dead link", () => {
    render(<Footer />);

    screen.getAllByRole("link").forEach((link) => {
      const href = link.getAttribute("href");
      expect(href).toBeTruthy();
      expect(href).not.toBe("#");
    });
  });
});
