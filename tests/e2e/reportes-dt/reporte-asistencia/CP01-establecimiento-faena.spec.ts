import { test, expect } from "@fixtures";
import { PESTANAS_FICHA_COLABORADOR } from "@config/constantes";
import datos from "@data/reporte.asistencia.json";

const datosPrueba = datos.cp01;

test.describe("Reporte Asistencia DT - Validación Establecimiento/Faena", { tag: "@regresion" }, () => {
  test("Caso feliz: dato de Establecimiento/Faena presente y coincide con Ficha Colaborador", async ({
    reporteAsistencia,
    fichaColaborador,
  }) => {
    await reporteAsistencia.navegar();
    await reporteAsistencia.filtrarPorRutYFechas(
      datosPrueba.identificadorColaborador,
      datosPrueba.rangoFechas.fechaInicio,
      datosPrueba.rangoFechas.fechaTermino,
    );
    await reporteAsistencia.panelFiltros.buscar();
    await reporteAsistencia.esperarResultados();

    const estabFaenaEnReporte = await reporteAsistencia.obtenerEstablecimientoFaena();

    await test.step("Validar que el Reporte DT contenga dato de Establecimiento/Faena", () => {
      expect(
        estabFaenaEnReporte,
        "ERROR DE CONFIGURACIÓN: el Reporte DT no tiene dato en Establecimiento/Faena.",
      ).not.toBe("");
    });

    await fichaColaborador.navegar();
    await fichaColaborador.buscarYEditarColaborador(datosPrueba.identificadorColaborador);
    await fichaColaborador.abrirPestana(PESTANAS_FICHA_COLABORADOR.LOCAL_ESTAB_FAENA);

    const estabFaenaEnFicha = await fichaColaborador.localEstabFaena.obtenerAsignado();

    await test.step("Cruzar datos: Establecimiento de Ficha Colaborador vs Reporte DT", () => {
      expect(
        estabFaenaEnFicha,
        `Ficha Colaborador: '${estabFaenaEnFicha}' vs Reporte DT: '${estabFaenaEnReporte}'`,
      ).toEqual(estabFaenaEnReporte);
    });
  });
});
