import datos from "@data/reportes-dt/reporte.asistencia.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp02;

test.describe("Reporte Asistencia DT - Validación Asistencia Colaborador", { tag: "@regresion" }, () => {
  test("CP02 - Asistencia SI con Ausencia vacía", async ({ reporteAsistencia }) => {
    await reporteAsistencia.navegar();
    await reporteAsistencia.filtrarPorRutYFechas(
      datosPrueba.identificadorColaborador,
      datosPrueba.rangoFechas.fechaInicio,
      datosPrueba.rangoFechas.fechaTermino,
    );
    await reporteAsistencia.panelFiltros.buscar();
    await reporteAsistencia.esperarResultados();

    const ausencia = await reporteAsistencia.obtenerAusenciaPrimeraAsistencia();

    await test.step("Validar que la Ausencia está vacía cuando la Asistencia es SI", () => {
      expect(
        ausencia,
        `Se esperaba Ausencia vacía cuando Asistencia = SI, pero se encontró: '${ausencia}'`,
      ).toBe("");
    });
  });
});
