// src/fixtures/index.ts
import { mergeTests, expect } from "@playwright/test";
import { dtReportsFixtures } from "./reportesDT/dtReports.fixture";
import { administrationFixtures } from "./asistencia/administration.fixture";

export const test = mergeTests(dtReportsFixtures, administrationFixtures);
export { expect };
