/**
 * Punto de entrada único de fixtures. Los tests SIEMPRE importan desde aquí:
 *   import { test, expect } from "@fixtures";
 *
 * Para agregar un módulo nuevo: crea `modulos/<modulo>.fixture.ts` extendiendo
 * `base.fixture.ts` y súmalo a `mergeTests` abajo.
 */
import { mergeTests } from "@playwright/test";
import { test as asistenciaTest } from "@fixtures/modulos/asistencia.fixture";
import { test as reportesDTTest } from "@fixtures/modulos/reportes-dt.fixture";

export const test = mergeTests(asistenciaTest, reportesDTTest);
export { expect } from "@playwright/test";
