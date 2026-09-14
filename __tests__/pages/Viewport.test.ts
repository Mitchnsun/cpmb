import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * CPMB-04 — le zoom mobile doit rester possible.
 * Next.js centralise la balise viewport dans l'export `viewport` du layout
 * racine : ce test empêche la réintroduction de `user-scalable=no` ou d'un
 * `maximum-scale`, ici ou dans une page qui réécrirait la balise.
 */
const SOURCES = ["app/layout.tsx", "app/page.tsx", "app/contact/page.tsx", "app/nos-concerts/page.tsx"];

describe("viewport", () => {
  it.each(SOURCES)("should not lock the zoom in %s", (source) => {
    const content = readFileSync(path.join(process.cwd(), source), "utf8");

    expect(content).not.toMatch(/user-?[Ss]calable/);
    expect(content).not.toMatch(/maximum-?[Ss]cale/);
    expect(content).not.toMatch(/minimum-?[Ss]cale/);
  });

  it("should declare width=device-width and initial-scale=1 in the root layout", () => {
    const layout = readFileSync(path.join(process.cwd(), "app/layout.tsx"), "utf8");

    expect(layout).toMatch(/width:\s*"device-width"/);
    expect(layout).toMatch(/initialScale:\s*1/);
  });
});
