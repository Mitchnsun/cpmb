/**
 * Tests for Next.js configuration (turbopack SVG rule).
 *
 * Focus on diff: ensure "*.svg" rule uses "@svgr/webpack" and emits "*.js".
 *
 * Test runner: Jest or Vitest (compatible). If using Vitest, no changes should be required.
 */

import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

// Resolve the config module from repo root. Try TS then JS, then bare without extension.
function loadConfig(): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("../next.config.ts");
  } catch {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("../next.config.js");
    } catch {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require("../next.config");
    }
  }
}

const configMod = loadConfig();
const nextConfig: NextConfig = (configMod && configMod.default) || configMod;

describe("next.config - structure", () => {
  it("exports an object", () => {
    expect(nextConfig).toBeDefined();
    expect(typeof nextConfig).toBe("object");
  });

  it("includes turbopack.rules object", () => {
    expect(nextConfig).toHaveProperty("turbopack");
    expect(typeof (nextConfig as any).turbopack).toBe("object");
    expect((nextConfig as any).turbopack).toHaveProperty("rules");
    expect(typeof (nextConfig as any).turbopack.rules).toBe("object");
  });
});

describe('next.config - "*.svg" rule', () => {
  const getSvgRule = () => {
    const rules = (nextConfig as any).turbopack.rules;
    expect(rules).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(rules, "*.svg")).toBe(true);
    const rule = rules["*.svg"];
    expect(rule).toBeDefined();
    expect(typeof rule).toBe("object");
    return rule;
  };

  it('defines a rule for "*.svg"', () => {
    getSvgRule(); // assertions inside
  });

  it('uses "@svgr/webpack" loader', () => {
    const svgRule = getSvgRule();
    expect(svgRule).toHaveProperty("loaders");
    expect(Array.isArray(svgRule.loaders)).toBe(true);
    expect(svgRule.loaders.length).toBeGreaterThan(0);
    expect(svgRule.loaders).toContain("@svgr/webpack");
  });

  it('emits "*.js" via the "as" property', () => {
    const svgRule = getSvgRule();
    expect(svgRule).toHaveProperty("as");
    expect(typeof svgRule.as).toBe("string");
    expect(svgRule.as).toBe("*.js");
  });

  it("keeps loaders as an array (guard against accidental scalar/object)", () => {
    const svgRule = getSvgRule();
    expect(Array.isArray(svgRule.loaders)).toBe(true);
  });

  it('does not unintentionally attach "@svgr/webpack" to other rules', () => {
    const rules = (nextConfig as any).turbopack.rules;
    const others = Object.keys(rules).filter((k) => k !== '*.svg');
    for (const key of others) {
      const rule = rules[key];
      if (rule && Array.isArray(rule.loaders)) {
        expect(rule.loaders).not.toContain("@svgr/webpack");
      }
    }
  });
});

describe("environment sanity checks", () => {
  it('has "@svgr/webpack" listed in package.json (dependencies or devDependencies)', () => {
    const pkgPath = path.join(__dirname, "..", "package.json");
    expect(fs.existsSync(pkgPath)).toBe(true);
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.optionalDependencies || {}),
      ...(pkg.peerDependencies || {}),
    };
    expect(Object.keys(deps)).toContain("@svgr/webpack");
  });

  it("basic NextConfig shape remains type-safe for common keys", () => {
    const candidate = nextConfig as Record<string, unknown>;
    if ("reactStrictMode" in candidate) {
      expect(typeof candidate.reactStrictMode === "boolean" || candidate.reactStrictMode === undefined).toBe(true);
    }
    if ("images" in candidate) {
      expect(typeof candidate.images === "object" || candidate.images === undefined).toBe(true);
    }
  });
});