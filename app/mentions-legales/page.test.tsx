/**
 * Tests for Mentions page.
 * Framework: Jest
 * Library: @testing-library/react with @testing-library/jest-dom matchers
 *
 * These tests focus on static rendering correctness, semantic structure, accessibility roles,
 * key content presence, and link attributes.
 */

import { render, screen, within } from "@testing-library/react";
import React from "react";

// Prefer importing the actual page component if available.
// Fallback: if the page component is mistakenly inside this test file in the PR, adjust the import accordingly.
let Mentions: React.ComponentType;

// Try to import from the expected Next.js App Router location.
// eslint-disable-next-line @typescript-eslint/no-var-requires
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Mentions = require("./page").default;
} catch {
  // If the implementation is co-located (for PR diff), dynamically define a no-op to make tests fail clearly.
  throw new Error(
    "Unable to import Mentions page from './page'. Ensure app/mentions-legales/page.tsx exports default function Mentions."
  );
}

describe("Mentions page", () => {
  beforeEach(() => {
    render(<Mentions />);
  });

  it("renders the main landmark with expected base classes", () => {
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    // sanity check a couple of tailwind classes to ensure structure remained
    expect(main).toHaveClass("p-4");
    expect(main).toHaveClass("text-zinc-900");
  });

  it("contains a top-level article with justified text container", () => {
    const article = screen.getByRole("article");
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass("container", "mx-auto", "text-justify");
  });

  it("displays main heading 'Mentions légales' as an h3", () => {
    // Using getByRole with name to ensure correct accessible name
    const heading = screen.getByRole("heading", { level: 3, name: /Mentions légales/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("text-sky-700", "font-bold");
  });

  it("renders subsection headings with correct levels and text", () => {
    const h4_1 = screen.getByRole("heading", {
      level: 4,
      name: /Droits d[’'&]auteurs et copyright/i,
    });
    expect(h4_1).toBeInTheDocument();

    const h4_2 = screen.getByRole("heading", {
      level: 4,
      name: /Données personnelles/i,
    });
    expect(h4_2).toBeInTheDocument();

    const h5_1 = screen.getByRole("heading", {
      level: 5,
      name: /1\.\s*Déclaration à la CNIL/i,
    });
    expect(h5_1).toBeInTheDocument();

    const h5_2 = screen.getByRole("heading", {
      level: 5,
      name: /2\.\s*Collecte de données personnelles/i,
    });
    expect(h5_2).toBeInTheDocument();

    const h5_3 = screen.getByRole("heading", {
      level: 5,
      name: /3\.\s*Publicité électronique/i,
    });
    expect(h5_3).toBeInTheDocument();
  });

  it("contains the expected CNIL statement paragraph", () => {
    expect(screen.getByText(/dispensant de déclaration les traitements automatisés de données/i)).toBeInTheDocument();
  });

  it("contains the email link with correct mailto href and hover styles", () => {
    const link = screen.getByRole("link", {
      name: /bureau@choeurdespaysdumontblanc\.fr/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mailto:bureau@choeurdespaysdumontblanc.fr");
    expect(link).toHaveClass("text-sky-700");
  });

  it("mentions that personal data are not sold or transferred", () => {
    expect(screen.getByText(/Cette dernière n[’'&]est pas cédée ou revendue/i)).toBeInTheDocument();
  });

  it("contains the electronic advertising opt-in statement", () => {
    expect(
      screen.getByText(/L[’'&]envoi de courrier électronique à des fins de publicité suppose/i)
    ).toBeInTheDocument();
  });

  it("shows spectacle licenses with correct numbers and typography", () => {
    // Scope to the trailing paragraph container
    const containers = screen.getAllByText(/Licences entrepreneur du spectacle/i);
    const container = containers[0].closest("p") as HTMLElement;
    expect(container).toBeInTheDocument();

    const utils = within(container);
    expect(utils.getByText(/PLATESV-D-2022-005692/i)).toBeInTheDocument();
    expect(utils.getByText(/PLATESV-D-2022-005721/i)).toBeInTheDocument();
  });

  it("does not render unexpected interactive elements", () => {
    // The page is informational; ensure there's no unintended form elements.
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  it("has no duplicate headings with the same level and name", () => {
    // Basic regression to avoid accidental duplicate headings
    const uniqueHeadings = new Set<string>();
    for (let level = 3 as const; level <= 5; level++) {
      const headings = screen.getAllByRole("heading", { level }).map((h) => h.textContent?.trim() ?? "");
      headings.forEach((name) => {
        const key = `${level}:${name}`;
        expect(uniqueHeadings.has(key)).toBe(false);
        uniqueHeadings.add(key);
      });
    }
  });
});