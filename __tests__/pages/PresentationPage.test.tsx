import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import PresentationPage from "@/app/presentation/page";
import Artists from "@/assets/contents/artists.json";

vi.mock("@/components/Carrousel", () => ({
  default: () => <div data-testid="carrousel">Mocked Carrousel</div>,
}));

describe("PresentationPage", () => {
  it("should open on the charter banner", () => {
    render(<PresentationPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Présentation" })).toBeInTheDocument();
  });

  it("should hold every block to three quarters of the container, centred", () => {
    const { container } = render(<PresentationPage />);

    // A paragraph stretched across the full 1536px would run past 200
    // characters; the blocks are capped and centred instead.
    const blocks = container.querySelectorAll(".max-w-6xl");
    expect(blocks.length).toBeGreaterThanOrEqual(4);
    blocks.forEach((block) => expect(block).toHaveClass("mx-auto"));
  });

  it("should let the presentation text fill its block, uncapped", () => {
    render(<PresentationPage />);

    const paragraph = screen.getByText(/Créé en mars 2005/);
    expect(paragraph).toHaveClass("text-lg");
    expect(paragraph).not.toHaveClass("max-w-prose");
  });

  it("should show the photo gallery under the presentation", () => {
    render(<PresentationPage />);

    expect(screen.getByTestId("carrousel")).toBeInTheDocument();
  });

  it("should lay the two instrumentistes out side by side on a wide screen", () => {
    const { container } = render(<PresentationPage />);

    const grid = [...container.querySelectorAll("div")].find((node) =>
      node.className.includes("grid-cols-[repeat(auto-fit,minmax(min(26rem,100%),1fr))]")
    );
    expect(grid).toBeDefined();
    expect(grid?.querySelectorAll("article")).toHaveLength(2);
  });

  it("should name the conductor and both instrumentistes", () => {
    render(<PresentationPage />);

    expect(screen.getByRole("heading", { level: 2, name: "Direction artistique – Benoît Dubu" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: Artists["agnes-lorincz"].name })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: Artists["marjorie-saunier"].name })).toBeInTheDocument();
  });

  it("should keep a single h1 and an unbroken heading hierarchy", () => {
    render(<PresentationPage />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });
});
