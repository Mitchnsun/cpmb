import js from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import next from "eslint-config-next/core-web-vitals";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";
import security from "eslint-plugin-security";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";

/**
 * Native flat config.
 *
 * `eslint-config-next` v16 exports flat config arrays directly, so we spread
 * `core-web-vitals` as-is — the equivalent of the old `next/core-web-vitals`
 * previously loaded via `FlatCompat`, now unneeded.
 *
 * This package itself provides the `react`, `react-hooks`, `import`,
 * `jsx-a11y`, `@next/next`, and `@typescript-eslint` plugins, plus the
 * TypeScript parser. Do not re-register them here: ESLint refuses a plugin
 * defined twice, and that double definition — via differently resolved
 * copies — is what broke the lint step of the Vercel build.
 */
const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      ".env*",
      "*.log",
      "coverage/**",
      ".DS_Store",
      ".yarn/**",
    ],
  },
  js.configs.recommended,
  ...next,
  prettierConfig,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      prettier: prettier,
      unicorn: unicorn,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      sonarjs: sonarjs,
      security: security,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "writable",
        module: "writable",
        require: "readonly",
        global: "readonly",
        window: "readonly",
        document: "readonly",
      },
    },
    rules: {
      "prefer-const": "error",
      "no-var": "error",
      "no-undef": "off", // TypeScript handles this
      "no-unused-vars": "off", // replaced by @typescript-eslint/no-unused-vars

      "prettier/prettier": "error",
      "unused-imports/no-unused-imports": "error",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "react/no-array-index-key": "error",

      "sonarjs/cognitive-complexity": ["error", 15],
      "security/detect-object-injection": "off",
    },
  },
  {
    // `next/typescript` only provides the `@typescript-eslint` plugin on
    // TypeScript files, so its rules can only be set here.
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Test files configuration
  {
    files: ["**/*.{test,spec}.{js,jsx,ts,tsx}", "__tests__/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        vi: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "sonarjs/no-duplicate-string": "off", // Test descriptions often repeat strings
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "warn",
      "vitest/consistent-test-it": "warn",
    },
  },
  {
    files: ["**/*.{test,spec}.{ts,tsx}", "__tests__/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow any in test mocks
    },
  },
];

export default config;
