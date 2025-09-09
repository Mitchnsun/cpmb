const js = require("@eslint/js");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const { FlatCompat } = require("@eslint/eslintrc");
const prettier = require("eslint-plugin-prettier");
const importPlugin = require("eslint-plugin-import");
const unicorn = require("eslint-plugin-unicorn");
const unusedImports = require("eslint-plugin-unused-imports");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  js.configs.recommended,
  ...compat.extends("next/core-web-vitals"),
  ...compat.config({
    extends: ["prettier"],
    plugins: ["sonarjs", "security", "jsx-a11y"],
    rules: {
      "sonarjs/cognitive-complexity": ["error", 15],
      "security/detect-object-injection": "off", // Too many false positives
    },
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
    },
  },
];
