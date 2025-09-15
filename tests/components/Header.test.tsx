/**
 * Tests for Header component.
 * Framework: React Testing Library with the project's configured runner (Jest or Vitest).
 * Expectations rely on @testing-library/jest-dom matchers if Jest is used.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// Prefer project alias and paths already used in source code.
// We search commonly for component location; adjust import if necessary.

import Header from "@/components/Header"; // Update path if your Header is elsewhere.

// Helper: resolve link href robustly in JSDOM

function getHref(element: HTMLElement | null): string | null {
  if (!element) {
    return null;
  }
  // In Next.js with next/link this will be an <a>
  // Use getAttribute to avoid full URL normalization differences.
  return (element as HTMLAnchorElement).getAttribute("href");
}

describe("Header", () => {
  it("renders a header element with key layout classes", () => {
    render(<Header />);
    const header = screen.getByRole("banner"); // <header> maps to role="banner"
    expect(header).toBeInTheDocument();
    const classList = (header as HTMLElement).className;
    expect(classList).toEqual(expect.stringContaining("sticky"));
    expect(classList).toEqual(expect.stringContaining("top-0"));
    expect(classList).toEqual(expect.stringContaining("bg-white"));
  });

  it("renders a level-1 heading with the choir name", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Choeur des pays du Mont-Blanc",
    });
    expect(heading).toBeInTheDocument();
  });

  it("wraps content in a link to '/' with accessible name", () => {
    render(<Header />);
    const link = screen.getByRole("link", {
      name: "Choeur des pays du Mont-Blanc",
    });
    expect(link).toBeInTheDocument();
    expect(getHref(link)).toBe("/");
    expect(link.className).toEqual(
      expect.stringContaining("text-inherit")
    );
    expect(link.className).toEqual(
      expect.stringContaining("no-underline")
    );
  });

  it("includes a decorative SVG icon that is hidden from accessibility tree", () => {
    render(<Header />);
    // Because the SVG has aria-hidden, it should not have an accessible role of img.
    const img = screen.queryByRole("img");
    expect(img).toBeNull();
    // But the heading text is still exposed as the link name.
    const link = screen.getByRole("link", {
      name: "Choeur des pays du Mont-Blanc",
    });
    expect(link).toBeInTheDocument();
  });

  it("does not render unintended interactive elements", () => {
    render(<Header />);
    // Only a single link is expected
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    // No buttons or inputs
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});