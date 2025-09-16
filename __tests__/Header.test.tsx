import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import Header from "@/components/Header";

// Mock SVG import
vi.mock("@/assets/icons/music-note.svg", () => ({
  default: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="music-note-icon" {...props} />,
}));

describe("Header", () => {
  it("should render the header with logo and title", () => {
    render(<Header />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /chœur des pays du mont-blanc/i })).toBeInTheDocument();
    expect(screen.getByTestId("music-note-icon")).toBeInTheDocument();
  });

  it("should have correct link attributes", () => {
    render(<Header />);

    const link = screen.getByRole("link", { name: /chœur des pays du mont-blanc/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("should have proper semantic structure", () => {
    render(<Header />);

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Check for sticky positioning classes
    expect(header).toHaveClass("sticky", "top-0");
  });
});
