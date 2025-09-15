/**
 * Test suite for Home component (app/page.tsx)
 * Testing Library & Framework: React Testing Library with Jest or Vitest (whichever the repo uses).
 *
 * Notes:
 * - We mock next/image to render a plain <img> for predictable assertions.
 * - We mock SVG import used as React component.
 * - Tests focus on textual content and semantics rather than Tailwind classes.
 */

import React from "react";
import { render, screen, within } from "@testing-library/react";

// Runner-agnostic mock controls (Jest or Vitest)
const isJest = typeof globalThis.jest !== "undefined";
const isVitest = typeof globalThis.vi !== "undefined";

// Mock next/image to plain img for test environment
if (isJest) {
  jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: any) => React.createElement("img", props),
  }));
} else if (isVitest) {
  vi.mock("next/image", () => ({
    default: (props: any) => React.createElement("img", props),
  }));
}

// Mock SVG import used as React component
// Path in source: "@/public/mail.svg"
if (isJest) {
  jest.mock("@/public/mail.svg", () => ({
    __esModule: true,
    default: (props: any) => React.createElement("svg", { "data-testid": "mail-icon", ...props }),
  }));
} else if (isVitest) {
  vi.mock("@/public/mail.svg", () => ({
    default: (props: any) => React.createElement("svg", { "data-testid": "mail-icon", ...props }),
  }));
}

// Import after mocks so component uses mocked modules
import Home from "./page";

describe("Home page (app/page.tsx)", () => {
  it("renders the main landmark and article container", () => {
    render(<Home />);
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Article should be within main
    const article = within(main).getByRole("article");
    expect(article).toBeInTheDocument();
  });

  it("shows the French headline announcing the new Chef de Chœur", () => {
    render(<Home />);
    const headline = screen.getByRole("heading", {
      name: /Le CPMB a le plaisir de vous présenter son nouveau Chef de Chœur !/i,
      level: 3,
    });
    expect(headline).toBeVisible();
  });

  it("renders the featured image with correct alt and src", () => {
    render(<Home />);
    const img = screen.getByRole("img", { name: /Benoît Dubu/i });
    expect(img).toBeInTheDocument();
    // src can be absolute after Next processing; ensure it contains the source path
    expect((img as HTMLImageElement).getAttribute("src")).toContain("/media/benoit_dubu.jpg");
    expect((img as HTMLImageElement).getAttribute("alt")).toBe("Benoît Dubu");
    // width/height props are passed through by our mock; not all renderers keep them on DOM
  });

  it("lists the announced concert dates for June 2025 and December 2025", () => {
    render(<Home />);
    expect(screen.getByText(/14 juin 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/15 juin 2025/i)).toBeInTheDocument();
    expect(screen.getByText(/12 décembre 2025/i)).toBeInTheDocument();
  });

  it("highlights the season program mentioning Gloria by Vivaldi and Jenkins", () => {
    render(<Home />);
    expect(
      screen.getByText(/autour des .*gloria.* de vivaldi et de jenkins/i)
    ).toBeInTheDocument();
  });

  it("renders the recruitment section with title and subheading", () => {
    render(<Home />);
    const sectionTitle = screen.getByRole("heading", { level: 3, name: /Le CPMB recrute !/i });
    expect(sectionTitle).toBeVisible();

    const subheading = screen.getByRole("heading", {
      level: 4,
      name: /Nous avons besoin de vos voix !/i,
    });
    expect(subheading).toBeVisible();
  });

  it("displays the recruitment email address as a mailto link and shows the mail icon (SVG)", () => {
    render(<Home />);

    const link = screen.getByRole("link", {
      name: /bureau@choeurdespaysdumontblanc\.fr/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:bureau@choeurdespaysdumontblanc.fr");

    // Icon is hidden on small screens via classes; since we mock SVG, we assert it renders in DOM
    const icon = screen.getByTestId("mail-icon");
    expect(icon).toBeInTheDocument();
  });

  it("mentions the names of the soloists", () => {
    render(<Home />);
    expect(screen.getByText(/Helena Duckert/i)).toBeInTheDocument();
    expect(screen.getByText(/Chloé Roussel/i)).toBeInTheDocument();
    expect(screen.getByText(/soprano/i)).toBeInTheDocument();
    expect(screen.getByText(/mezzo-soprano/i)).toBeInTheDocument();
  });

  it("contains encouraging call to action 'N'hésitez pas !'", () => {
    render(<Home />);
    expect(screen.getByText(/N'?hésitez pas !/i)).toBeInTheDocument();
  });
});