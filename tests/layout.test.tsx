/**
 * Tests for RootLayout, metadata, and viewport.
 * Frameworks: Vitest + React Testing Library (detected/assumed).
 * These tests mock next/font/google and Header/Footer to avoid external dependencies.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, screen, within } from "@testing-library/react";

// Mock next/font/google to return predictable classnames for variables/className
vi.mock("next/font/google", () => {
  return {
    Inter: vi.fn().mockImplementation((_opts: any) => ({
      className: "inter-class",
      variable: "inter-variable",
    })),
    Noto_Sans: vi.fn().mockImplementation((_opts: any) => ({
      className: "noto-class",
      variable: "noto-variable",
    })),
  };
});

// Mock Header and Footer components imported via "@/components/*"
vi.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <header data-testid="header-mock">Header</header>,
}));
vi.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer-mock">Footer</footer>,
}));

// Some codebases import CSS side-effects in layout. Vite generally handles CSS,
// but if not, you can uncomment the following virtual mock to bypass CSS import errors.
// vi.mock("./globals.css", () => ({}), { virtual: true });

/* eslint-disable @typescript-eslint/no-var-requires */
let moduleUnderTest: any;

function importLayoutModule() {
  // Dynamically import to ensure mocks are in place first.
  // Resolve the runtime path that Vite uses based on common locations.
  try {
    // app/layout.tsx (most common)
    // @ts-ignore
    moduleUnderTest = require("./layout.tsx");
  } catch {
    try {
      // src/app/layout.tsx
      // @ts-ignore
      moduleUnderTest = require("../app/layout.tsx");
    } catch {
      try {
        // ../../app/layout.tsx (if test lives in tests/)
        // @ts-ignore
        moduleUnderTest = require("../../app/layout.tsx");
      } catch {
        try {
          // fallback to ESM dynamic import path resolution via absolute from process.cwd()
          // Using require may fail in some ESM setups; this fallback aims to help.
          // Note: This branch may be unused in many repos.
          // @ts-ignore
          moduleUnderTest = require(process.cwd() + "/app/layout.tsx");
        } catch {
          // Last resort: try src/app
          // @ts-ignore
          moduleUnderTest = require(process.cwd() + "/src/app/layout.tsx");
        }
      }
    }
  }
}

describe("RootLayout module", () => {
  beforeEach(() => {
    importLayoutModule();
  });

  afterEach(() => {
    moduleUnderTest = undefined;
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("exports expected metadata with title and description", () => {
    const { metadata } = moduleUnderTest;
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Choeur des Pays du Mont-Blanc");

    // Ensure the French description string is intact (includes special chars and quotes)
    expect(typeof metadata.description).toBe("string");
    expect(metadata.description).toContain("L'objectif est de proposer");
    expect(metadata.description).toContain('partant du principe qu\'"Apprendre à écouter, c\'est découvrir l\'émotion"');
  });

  it("exports expected viewport configuration", () => {
    const { viewport } = moduleUnderTest;
    expect(viewport).toBeDefined();
    expect(viewport.width).toBe("device-width");
    expect(viewport.initialScale).toBe(1);
  });

  it("renders html with lang='fr' and applies expected classes on body", () => {
    const { default: RootLayout } = moduleUnderTest;

    const { container } = render(
      <RootLayout>
        <div data-testid="content">Hello</div>
      </RootLayout>
    );

    // html lang
    const htmlEl = container.querySelector("html");
    expect(htmlEl).toBeTruthy();
    expect(htmlEl?.getAttribute("lang")).toBe("fr");

    // body classes include font variables from mocks and utility classes
    const bodyEl = container.querySelector("body");
    expect(bodyEl).toBeTruthy();
    const classList = bodyEl?.className || "";
    expect(classList).toContain("inter-variable");
    expect(classList).toContain("noto-variable");
    expect(classList).toContain("font-inter");
    expect(classList).toContain("bg-zinc-50");
    expect(classList).toContain("text-zinc-900");
    expect(classList).toContain("antialiased");
  });

  it("renders Header, children, and Footer in order", () => {
    const { default: RootLayout } = moduleUnderTest;

    const { container } = render(
      <RootLayout>
        <main data-testid="main-slot">MainContent</main>
      </RootLayout>
    );

    const bodyEl = container.querySelector("body");
    if (!bodyEl) {
      throw new Error("body element not found");
    }
    const header = within(bodyEl).getByTestId("header-mock");
    const main = within(bodyEl).getByTestId("main-slot");
    const footer = within(bodyEl).getByTestId("footer-mock");

    // Ensure order: header -> children -> footer
    const bodyHtml = bodyEl.innerHTML;
    expect(bodyHtml.indexOf(header.outerHTML)).toBeLessThan(bodyHtml.indexOf(main.outerHTML));
    expect(bodyHtml.indexOf(main.outerHTML)).toBeLessThan(bodyHtml.indexOf(footer.outerHTML));
  });

  it("handles empty children gracefully (still renders header and footer)", () => {
    const { default: RootLayout } = moduleUnderTest;

    const { container } = render(<RootLayout>{null}</RootLayout>);
    const bodyEl = container.querySelector("body");
    if (!bodyEl) {
      throw new Error("body element not found");
    }
    expect(within(bodyEl).getByTestId("header-mock")).toBeTruthy();
    expect(within(bodyEl).getByTestId("footer-mock")).toBeTruthy();
  });
});