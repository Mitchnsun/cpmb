/// <reference types="vitest" />
import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    css: true,
    testTimeout: 10000, // Increase timeout for tests
    // Exclude files from coverage
    coverage: {
      enabled: process.env.CI === "true" || !!process.env.COVERAGE,
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "__tests__/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/coverage/**",
        "app/layout.tsx", // Next.js specific files
        "app/globals.css",
        ".next/**",
        "public/**",
        "*.config.{js,ts}",
        "eslint.config.js",
        "postcss.config.mjs",
        "tailwind.config.js",
        "next.config.ts",
        "vitest.config.ts",
        "tsconfig*.json",
      ],
      include: ["components/**/*.{ts,tsx}", "utils/**/*.{ts,tsx}"],
      reportsDirectory: "./coverage",
      provider: "v8",
      thresholds: { lines: 90, functions: 70, branches: 75, statements: 90 },
    },
    // Use the test-specific TypeScript config
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
