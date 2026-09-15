import { render, screen } from "@testing-library/react";

import Overline from "@/components/Overline";

describe("Overline", () => {
  it("should render the charter overline: mono, 12px, uppercase, wide tracking", () => {
    render(<Overline>Prochain concert</Overline>);

    expect(screen.getByText("Prochain concert")).toHaveClass("font-mono", "text-xs", "uppercase", "tracking-[0.16em]");
  });

  it("should let the caller tighten the tracking without keeping the default one", () => {
    render(<Overline className="text-muted tracking-[0.14em]">Partenaires</Overline>);

    const overline = screen.getByText("Partenaires");
    expect(overline).toHaveClass("tracking-[0.14em]", "text-muted");
    expect(overline).not.toHaveClass("tracking-[0.16em]");
  });

  it("should forward html attributes, so a section can be labelled by it", () => {
    render(<Overline id="partenaires">Partenaires</Overline>);

    expect(screen.getByText("Partenaires")).toHaveAttribute("id", "partenaires");
  });
});
