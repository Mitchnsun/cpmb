import { render, screen } from "@testing-library/react";

import InfoPanel from "@/components/InfoPanel";

describe("InfoPanel", () => {
  it("should mark neutral information with the teal edge", () => {
    render(<InfoPanel>Aucune date arrêtée</InfoPanel>);

    expect(screen.getByText("Aucune date arrêtée")).toHaveClass("border-l-teal", "bg-surface");
  });

  it("should mark the past with the copper edge", () => {
    render(<InfoPanel accent="copper">14 juin 2025</InfoPanel>);

    expect(screen.getByText("14 juin 2025")).toHaveClass("border-l-copper");
  });

  it("should let the caller widen the padding", () => {
    render(<InfoPanel className="p-8">Encart</InfoPanel>);

    expect(screen.getByText("Encart")).toHaveClass("p-8");
    expect(screen.getByText("Encart")).not.toHaveClass("p-6");
  });
});
