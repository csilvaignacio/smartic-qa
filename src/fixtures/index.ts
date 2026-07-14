// src/fixtures/index.ts
import { expect } from "@playwright/test";
import { reportesDTFixtures } from "./reportesDT.fixture";

export const test = reportesDTFixtures;
export { expect };