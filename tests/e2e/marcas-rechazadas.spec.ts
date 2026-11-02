import { expect, test } from "@fixtures";

export const datosPrueba = {
  fechas: {
    fechaInicio: "22-10-2026",
    fechaFin: "22-10-2026",
  },
  colaborador: "21042004",
} as const;

test.describe("Pruebas reporte marcas rechazadas web", { tag: "@regresion" }, () => {
  test("CP01 - Rechazo por Marca sin Horario", async ({ marcasRechazadas }) => {
    await marcasRechazadas.navegar();
    await marcasRechazadas.abrirBusquedaGrupal();
    await marcasRechazadas.busquedaGrupal.escribirBusqueda(datosPrueba.colaborador);
    await marcasRechazadas.busquedaGrupal.buscar();
    await marcasRechazadas.busquedaGrupal.seleccionarColaborador();
    await marcasRechazadas.busquedaGrupal.cerrarBusquedaGrupal();
    await marcasRechazadas.seleccionarRangoFechas(
      datosPrueba.fechas.fechaInicio,
      datosPrueba.fechas.fechaFin,
    );
    await marcasRechazadas.panelFiltros.buscar();

    await marcasRechazadas.validarMarcaRechazada(datosPrueba.colaborador);
    const motivoRechazo = await marcasRechazadas.obtenerMotivoRechazo(datosPrueba.colaborador);

    expect(
      motivoRechazo,
      `Se esperaba un motivo de rechazo para el colaborador ${datosPrueba.colaborador}, pero se encontró: '${motivoRechazo}'`,
    ).not.toBe("");
  });
});
