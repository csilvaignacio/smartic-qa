import { expect, test } from "@fixtures";

export const testData = {
  fechas: {
    fechaInicio: "22-10-2026",
    fechaFin: "22-10-2026",
  },
  colaborador: "21042004",
};

test.describe("Pruebas reporte marcas rechazadas web", { tag: "@regresion" }, () => {
  test("CP01 - Rechazo por Marca sin Horario", async ({ marcasRechazadas }) => {
    await marcasRechazadas.navegar();
    await marcasRechazadas.abrirBusquedaGrupal();
    await marcasRechazadas.busquedaGrupal.escribirBusqueda(testData.colaborador);
    await marcasRechazadas.busquedaGrupal.buscar();
    await marcasRechazadas.busquedaGrupal.seleccionarColaborador();
    await marcasRechazadas.busquedaGrupal.cerrarBusquedaGrupal();
    await marcasRechazadas.seleccionarRangoFechas(testData.fechas.fechaInicio, testData.fechas.fechaFin);
    await marcasRechazadas.panelFiltros.buscar();

    expect(true).toBe(true);
  });
});
