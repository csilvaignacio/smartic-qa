import { PESTANAS_FICHA_COLABORADOR } from "@config/constantes";
import datos from "@data/reportes-dt/reporte.asistencia.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp01;

test.describe("Reporte Asistencia DT - Validación Establecimiento/Faena", { tag: "@regresion" }, () => {
  test("CP01 - Establecimiento/Faena del reporte coincide con la Ficha Colaborador", async ({
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

    await test.step("Validar que el Reporte DT informa un Establecimiento/Faena", () => {
      expect(
        estabFaenaEnReporte,
        `Se esperaba un Establecimiento/Faena en el Reporte DT del colaborador ${datosPrueba.identificadorColaborador}, pero llegó vacío: revisar su configuración`,
      ).not.toBe("");
    });

    await fichaColaborador.navegar();
    await fichaColaborador.buscarYEditarColaborador(datosPrueba.identificadorColaborador);
    await fichaColaborador.abrirPestana(PESTANAS_FICHA_COLABORADOR.LOCAL_ESTAB_FAENA);

    const estabFaenaEnFicha = await fichaColaborador.localEstabFaena.obtenerAsignado();

    await test.step("Validar que la Ficha Colaborador tiene el mismo Establecimiento/Faena del reporte", () => {
      expect(
        estabFaenaEnFicha,
        `Se esperaba en la Ficha Colaborador el Establecimiento/Faena '${estabFaenaEnReporte}' del Reporte DT, pero se encontró '${estabFaenaEnFicha}'`,
      ).toBe(estabFaenaEnReporte);
    });
  });
});
