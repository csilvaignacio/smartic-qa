import { defineConfig, ReporterDescription } from "@playwright/test";
import { ENTORNO } from "@config/entorno";
import { RUTAS_SESION } from "@config/constantes";

const enCI = !!process.env.CI;

/** Todos los reportes y evidencias quedan dentro de `reports/`. */
const CARPETA_REPORTES = "reports";

const reportes: ReporterDescription[] = [
  [enCI ? "dot" : "list"],
  ["html", { outputFolder: `${CARPETA_REPORTES}/playwright-report`, open: "never" }],
  [
    "allure-playwright",
    {
      resultsDir: `${CARPETA_REPORTES}/allure-results`,
      detail: true,
      suiteTitle: true,
      environmentInfo: { ambiente: ENTORNO.ambiente, urlBase: ENTORNO.urlBase },
    },
  ],
  ["junit", { outputFile: `${CARPETA_REPORTES}/junit/resultados.xml` }],
];

export default defineConfig({
  testDir: "./tests",
  outputDir: `${CARPETA_REPORTES}/test-results`,
  fullyParallel: true,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  forbidOnly: enCI,
  retries: enCI ? 2 : 0,
  workers: enCI ? 1 : undefined,
  reporter: reportes,

  use: {
    baseURL: ENTORNO.urlBase,
    // Viewport fijo: en headless y en modo UI no hay ventana real que maximizar,
    // y el sitio colapsa el menú lateral con el tamaño por defecto.
    viewport: { width: 1440, height: 900 },
    locale: "es-CL",
    timezoneId: "America/Santiago",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "e2e",
      dependencies: ["setup"],
      testMatch: /tests[\\/](e2e|smoke)[\\/].*\.spec\.ts/,
      use: {
        browserName: "chromium",
        storageState: RUTAS_SESION.admin,
      },
    },
    { name: "api", testMatch: /tests[\\/]api[\\/].*\.spec\.ts/ },
  ],
});
