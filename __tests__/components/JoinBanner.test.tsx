import { render, screen } from "@testing-library/react";

import JoinBanner from "@/components/JoinBanner";

describe("JoinBanner", () => {
  it("should state the recruitment terms", () => {
    render(<JoinBanner />);

    expect(screen.getByRole("heading", { level: 2, name: "Nous rejoindre" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Le chœur recrute des choristes ayant une expérience chorale et/ou une capacité en déchiffrage. Le recrutement se fait après audition."
      )
    ).toBeInTheDocument();
  });

  it("should give the rehearsal place and schedule", () => {
    render(<JoinBanner />);

    expect(screen.getByText("Espace Louis-Simon, salle Roger Duvanel — Gaillard")).toBeInTheDocument();
    expect(screen.getByText(/Un vendredi par mois, 19h30 – 22h/)).toBeInTheDocument();
    expect(screen.getByText(/Un dimanche par mois, 10h – 16h/)).toBeInTheDocument();
    expect(screen.getByText(/Soit 9 heures de répétition par mois\./)).toBeInTheDocument();
  });

  it("should lead to the contact page with the subject preselected", () => {
    render(<JoinBanner />);

    expect(screen.getByRole("link", { name: "Rejoindre le chœur" })).toHaveAttribute(
      "href",
      "/contact?objet=rejoindre"
    );
  });

  it("should stretch its button to the full width on mobile", () => {
    render(<JoinBanner />);

    expect(screen.getByRole("link", { name: "Rejoindre le chœur" })).toHaveClass(
      "max-menu:w-full",
      "max-menu:justify-center",
      "min-h-12"
    );
  });

  it("should write the text in pure white, never translucent, for contrast", () => {
    const { container } = render(<JoinBanner />);

    container.querySelectorAll("p, h2").forEach((element) => {
      expect(element.className).not.toMatch(/text-white\//);
    });
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("text-white");
  });

  it("should stack title, schedule then button, in that order", () => {
    const { container } = render(<JoinBanner />);

    const order = [...container.querySelectorAll("h2, p, a")].map((element) => element.tagName);
    expect(order.indexOf("H2")).toBeLessThan(order.indexOf("A"));
    expect(order.lastIndexOf("P")).toBeLessThan(order.indexOf("A"));
  });
});
