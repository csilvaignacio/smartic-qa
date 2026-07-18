import { defineConfig, devices } from "@playwright/test";
import { ENV } from "@config/env";
require("tsconfig-paths/register");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 60 * 1000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"], ["allure-playwright"]],

  use: {
    viewport: { width: 1980, height: 1080 },
    baseURL: ENV.baseURL,
    locale: "es-CL",
    timezoneId: "America/Santiago",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000,
  },

  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "e2e",
      dependencies: ["setup"],
      use: { 
        browserName: 'chromium',
        storageState: "storage/admin.json" 
      },
      testMatch: /tests\/(e2e|smoke)\/.*\.spec\.ts/,
    },
    { name: "api", testMatch: /tests\/api\/.*\.spec\.ts/ },
  ],
});