import { render, screen } from "@testing-library/react";

import { PARTNER_LOGOS } from "@/assets/contents/medias";
import PartnersBanner from "@/components/PartnersBanner";

describe("PartnersBanner", () => {
  it("should be labelled by its overline", () => {
    const { container } = render(<PartnersBanner />);

    const overline = screen.getByText("Partenaires");
    expect(overline).toHaveAttribute("id", "partenaires");
    expect(container.querySelector("section")).toHaveAttribute("aria-labelledby", "partenaires");
  });

  it("should show one cartouche per partner, all the same height", () => {
    const { container } = render(<PartnersBanner />);

    const cartouches = container.querySelectorAll("a");
    expect(cartouches).toHaveLength(PARTNER_LOGOS.length);
    cartouches.forEach((cartouche) => expect(cartouche).toHaveClass("min-h-30", "bg-surface"));
  });

  it("should use the partner name as the alternative text", () => {
    render(<PartnersBanner />);

    PARTNER_LOGOS.forEach(({ name }) => {
      expect(screen.getByAltText(name)).toBeInTheDocument();
    });
  });

  it("should link each logo to the partner's site", () => {
    render(<PartnersBanner />);

    PARTNER_LOGOS.forEach(({ name, href }) => {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
    });
  });

  it("should keep the native ratio of every logo, bounding the height only", () => {
    render(<PartnersBanner />);

    PARTNER_LOGOS.forEach(({ name, width, height }) => {
      const logo = screen.getByAltText(name);
      expect(logo).toHaveAttribute("width", String(width));
      expect(logo).toHaveAttribute("height", String(height));
      expect(logo).toHaveClass("h-auto", "w-auto", "max-w-full", "object-contain");
    });
  });
});
