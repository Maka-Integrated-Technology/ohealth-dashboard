import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default tseslint.config(
  // Ignored paths
  {
    ignores: ["build/**", ".react-router/**", "node_modules/**", "dist/**"],
  },

  // Base JS rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // React source files
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      // React
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      // React Hooks
      ...reactHooksPlugin.configs.recommended.rules,
      // React Refresh (Vite HMR)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // shadcn UI primitives export variant helpers alongside components — fast-refresh
  // warnings are not actionable here since these files are not application code.
  // prop-types is also disabled: these are TypeScript-typed generated components,
  // and react/prop-types only understands runtime PropTypes, not TS types.
  {
    files: ["app/components/ui/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
      "react/prop-types": "off",
    },
  },

  // Provider files export both a provider component and a configured instance.
  {
    files: ["app/components/providers/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  // Node globals for config files
  {
    files: ["*.config.{js,ts}", "*.config.mjs"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  }
);
