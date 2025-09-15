/**
 * Test suite for app/layout.tsx
 *
 * Testing library and framework:
 * - We use Jest as the test runner (with jsdom environment) and @testing-library/react utilities where appropriate.
 * - We use react-dom/server renderToStaticMarkup for testing Next.js RootLayout which returns <html>/<body>.
 *
 * Notes:
 * - We mock next/font/google to provide stable class names for font variables.
 * - We mock Header and Footer components to simple placeholders to focus on layout structure.
 */

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Prefer jest-dom matchers if available without hard dependency
// eslint-disable-next-line @typescript-eslint/no-var-requires

let screen: typeof import("@testing-library/react")["screen"] | undefined;
let render: typeof import("@testing-library/react")["render"] | undefined;
try {
  // These imports are optional; some assertions use plain string checks.

  // If @testing-library/react is installed in the repo (it should be), this will work.
  // If not, tests that rely on render/screen are skipped via runtime guards.
  const rtl = require("@testing-library/react");
  screen = rtl.screen;
  render = rtl.render;
} catch {
  // @testing-library/react not present; proceed with server-side markup assertions only.
}

/* Mocks for external modules used by RootLayout */
jest.mock("next/font/google", () => ({
  __esModule: true,
  Inter: jest.fn(() => ({ className: "mock-inter-class", variable: "mock-inter-var" })),
  Noto_Sans: jest.fn(() => ({ className: "mock-noto-class", variable: "mock-noto-var" })),
}));

jest.mock("@/components/Header", () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}));

jest.mock("@/components/Footer", () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}));

// Import after mocks so that the module under test picks them up
import RootLayout, { metadata, viewport } from "./layout";

describe("app/layout.tsx - metadata and viewport", () => {
  test("exports correct metadata.title", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Choeur des Pays du Mont-Blanc");
  });

  test("exports correct metadata.description (non-empty, French text)", () => {
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(20);
    // Spot-check a distinctive phrase to avoid full string coupling
    expect(metadata.description).toContain("Apprendre à écouter");
  });

  test("exports viewport with device-width and initialScale=1", () => {
    expect(viewport).toBeDefined();
    expect(viewport.width).toBe("device-width");
    expect(viewport.initialScale).toBe(1);
  });
});

describe("app/layout.tsx - RootLayout structure", () => {
  const renderMarkup = (children: React.ReactNode) =>
    renderToStaticMarkup(<RootLayout>{children}</RootLayout>);

  test("renders <html lang='fr'> and one <body>", () => {
    const html = renderMarkup(<main>content</main>);
    // Basic structure checks
    expect(html).toContain('<html lang="fr">');
    const bodyOpenCount = (html.match(/<body\b/g) || []).length;
    const bodyCloseCount = (html.match(/<\/body>/g) || []).length;
    expect(bodyOpenCount).toBe(1);
    expect(bodyCloseCount).toBe(1);
  });

  test("body includes font variables and utility classes", () => {
    const html = renderMarkup(<main />);

    // From mocked next/font/google
    expect(html).toContain('class="mock-inter-var mock-noto-var');
    // Utility classes defined in the component
    expect(html).toContain(" font-inter ");
    expect(html).toContain(" bg-zinc-50 ");
    expect(html).toContain(" text-zinc-900 ");
    expect(html).toContain(" antialiased");
  });

  test("includes Header, children, and Footer in order", () => {
    const child = <main data-testid="content">Hello</main>;
    const html = renderMarkup(child);

    const headerIndex = html.indexOf("<header");
    const childIndex = html.indexOf("Hello");
    const footerIndex = html.indexOf("<footer");
    expect(headerIndex).toBeGreaterThanOrEqual(0);
    expect(childIndex).toBeGreaterThan(headerIndex);
    expect(footerIndex).toBeGreaterThan(childIndex);
  });

  test("gracefully renders with null children", () => {
    const html = renderMarkup(null);
    // Header and Footer should still be present
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
  });
});

describe("app/layout.tsx - Client DOM smoke (optional, if @testing-library/react present)", () => {
  const maybe = (screen && render) ? it : it.skip;

  maybe("mounts and exposes header/footer via data-testid", () => {
    render?.(<RootLayout><main data-testid="content">X</main></RootLayout>);
    // Using screen queries if available
    expect(screen?.getByTestId("header")).toBeInTheDocument();
    expect(screen?.getByTestId("footer")).toBeInTheDocument();
    expect(screen?.getByTestId("content")).toBeInTheDocument();
  });
});