import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { FlatCompat } from "@eslint/eslintrc";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import security from "eslint-plugin-security";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import vitest from "@vitest/eslint-plugin";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  ...compat.config({
    extends: ["prettier"],
  }),
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
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
      prettier: prettier,
      import: importPlugin,
      unicorn: unicorn,
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
      sonarjs: sonarjs,
      security: security,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parser: tsParser,
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
      // Existing rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "prefer-const": "error",
      "no-var": "error",
      "no-undef": "off", // TypeScript handles this

      // New rules from requirement
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
      "@typescript-eslint/no-explicit-any": "off", // Allow any in test mocks
      "sonarjs/no-duplicate-string": "off", // Test descriptions often repeat strings
      "vitest/no-focused-tests": "error",
      "vitest/no-disabled-tests": "warn",
      "vitest/consistent-test-it": "warn",
    },
  },
];

export default config;
