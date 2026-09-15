import { render, screen } from "@testing-library/react";

import ChoirBanner from "@/components/ChoirBanner";

describe("ChoirBanner", () => {
  it("should tell the choir's story", () => {
    render(<ChoirBanner />);

    expect(screen.getByRole("heading", { level: 2, name: "Le chœur" })).toBeInTheDocument();
    expect(screen.getByText(/Créé en 2005 à Gaillard/)).toBeInTheDocument();
    expect(screen.getByText(/chef de chœur professionnel Benoît Dubu/)).toBeInTheDocument();
  });

  it("should spell the composers with their diacritics", () => {
    render(<ChoirBanner />);

    expect(screen.getByText(/Vivaldi, Mozart, Michael Haydn, Dvořák, Rheinberger, Jenkins/)).toBeInTheDocument();
  });

  it("should quote the motto with French quotation marks", () => {
    const { container } = render(<ChoirBanner />);

    const quote = container.querySelector("blockquote");
    expect(quote).toHaveTextContent("« Apprendre à écouter, c’est découvrir l’émotion »");
    expect(quote).toHaveClass("border-l-copper-light", "font-display");
  });

  it("should keep the deliberate crop of the photo and defer its loading", () => {
    render(<ChoirBanner />);

    const photo = screen.getByRole("img");
    expect(photo).toHaveAttribute("alt", "Le chœur en concert, écharpes turquoise, dirigé par Benoît Dubu");
    expect(photo).toHaveClass("aspect-4/3", "object-cover");
  });
});
