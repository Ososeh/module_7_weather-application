// This package supplies recommended JavaScript correctness rules.
import js from "@eslint/js";
// This package describes names that browsers and tests provide automatically.
import globals from "globals";
// This plugin checks the important Rules of Hooks.
import reactHooks from "eslint-plugin-react-hooks";
// This plugin supports Vite's safe React refresh behaviour.
import reactRefresh from "eslint-plugin-react-refresh";

// ESLint reads this exported list whenever npm run lint is executed.
export default [
  // Generated folders do not contain source code that learners need to lint.
  { ignores: ["dist", "node_modules"] },
  {
    // The following rules apply to every JavaScript and JSX file.
    files: ["**/*.{js,jsx}"],
    // These settings describe the language features used by the project.
    languageOptions: {
      // The project uses modern JavaScript syntax.
      ecmaVersion: 2022,
      // Source files use import and export statements.
      sourceType: "module",
      // Browser, modern JavaScript, and test globals are allowed.
      globals: { ...globals.browser, ...globals.es2021 },
      // JSX syntax is enabled for React components.
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // These plugins add React-specific safety checks.
    plugins: { "react-hooks": reactHooks, "react-refresh": reactRefresh },
    // The combined rules catch common JavaScript and Hook mistakes.
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
