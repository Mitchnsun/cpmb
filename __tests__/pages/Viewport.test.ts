import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Mobile zoom must stay possible. Next.js centralizes the viewport tag in
 * the root layout's `viewport` export: this test prevents reintroducing
 * `user-scalable=no` or a `maximum-scale`, here or in a page that would
 * rewrite the tag.
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
