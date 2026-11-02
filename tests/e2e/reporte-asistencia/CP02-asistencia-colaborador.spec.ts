import { test, expect } from "@fixtures";

export const datosPrueba = {
  rangoFechas: {
    fechaInicio: "01-04-2026",
    fechaTermino: "22-04-2026",
  },
  identificadorColaborador: "16283712",
} as const;

test.describe("Reporte Asistencia DT - Validación Asistencia Colaborador", { tag: "@regresion" }, () => {
  test("Asistencia SI con Ausencia vacía", async ({ reporteAsistencia }) => {
    await reporteAsistencia.navegar();
    await reporteAsistencia.filtrarPorRutYFechas(
      datosPrueba.identificadorColaborador,
      datosPrueba.rangoFechas.fechaInicio,
      datosPrueba.rangoFechas.fechaTermino,
    );

    const ausencia = await reporteAsistencia.obtenerAusenciaPrimeraAsistencia();

    expect(
      ausencia,
      `Se esperaba Ausencia vacía cuando Asistencia = SI, pero se encontró: '${ausencia}'`,
    ).toBe("");
  });
});
