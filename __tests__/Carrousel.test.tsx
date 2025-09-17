import { render, screen } from "@testing-library/react";

import { CARROUSEL_IMAGES } from "@/assets/contents/carrousel";
import Carrousel from "@/components/Carrousel";

describe("Carrousel", () => {
  it("should render the carrousel with images", () => {
    render(<Carrousel />);

    expect(screen.getByRole("region", { name: /carrousel d'images du chœur/i })).toBeInTheDocument();
    CARROUSEL_IMAGES.forEach((image) => {
      expect(screen.getByAltText(image.alt)).toBeInTheDocument();
    });
  });

  it("should render navigation buttons", () => {
    render(<Carrousel />);

    expect(screen.getByRole("button", { name: /image précédente/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /image suivante/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /mettre en pause/i })).toBeInTheDocument();
  });

  it("should render indicator dots", () => {
    render(<Carrousel />);

    const dots = screen.getAllByRole("button", { name: /aller à l'image \d+/i });
    expect(dots).toHaveLength(CARROUSEL_IMAGES.length);
  });

  it("should have proper accessibility attributes", () => {
    render(<Carrousel />);

    const carrousel = screen.getByRole("region");
    expect(carrousel).toHaveAttribute("aria-label", "Carrousel d'images du chœur");
    expect(carrousel).toHaveAttribute("aria-roledescription", "carousel");
    expect(carrousel).toHaveAttribute("aria-live", "polite");
  });

  it("should have first indicator dot marked as current by default", () => {
    render(<Carrousel />);

    const dots = screen.getAllByRole("button", { name: /aller à l'image \d+/i });
    expect(dots[0]).toHaveAttribute("aria-current", "true");
  });
});
