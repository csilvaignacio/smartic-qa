// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "node_modules/",
      "reports/",
      "storage/",
      ".playwright-mcp/",
      "allure-*/",
      "playwright-report/",
      "test-results/",
    ],
  },

  // ---- Reglas base para todo el código TypeScript ----
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Promesas: en Playwright un "await" olvidado es la causa #1 de tests inestables
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      // `return await` siempre: deja trazas de error completas en los reportes
      "@typescript-eslint/return-await": ["error", "always"],

      // Tipado y legibilidad
      "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/naming-convention": [
        "error",
        { selector: "default", format: ["camelCase"], leadingUnderscore: "allow" },
        { selector: "import", format: ["camelCase", "PascalCase"] },
        { selector: "variable", modifiers: ["const", "global"], format: ["camelCase", "UPPER_CASE"] },
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "objectLiteralProperty", format: null },
        { selector: "typeProperty", format: null },
      ],

      "no-console": "warn",
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
    },
  },

  // ---- Reglas de Playwright solo para los tests ----
  {
    files: ["tests/**/*.ts"],
    ...playwright.configs["flat/recommended"],
    rules: {
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-focused-test": "error",
      "playwright/no-skipped-test": "warn",
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-page-pause": "error",
      "playwright/no-conditional-in-test": "error",
      "playwright/prefer-web-first-assertions": "error",
      "playwright/valid-title": "error",
      // Métodos de Page Objects que empiezan con esperar/validar/verificar contienen expects web-first
      "playwright/expect-expect": [
        "error",
        { assertFunctionPatterns: ["^esperar", "^validar", "^verificar"] },
      ],
    },
  },

  // ---- Page Objects y componentes: no permitir esperas fijas ni pausas ----
  {
    files: ["src/**/*.ts"],
    plugins: { playwright },
    rules: {
      "playwright/no-wait-for-timeout": "error",
      "playwright/no-page-pause": "error",
      "playwright/no-element-handle": "error",
      "playwright/no-eval": "error",
      "playwright/no-force-option": "warn",
    },
  },

  // ---- Archivos de configuración JS ----
  {
    files: ["**/*.mjs", "**/*.cjs", "**/*.js"],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // Prettier al final: desactiva reglas de formato que chocan con Prettier
  prettier,
);
