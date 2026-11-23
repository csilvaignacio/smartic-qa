import datos from "@data/asistencia/marcas.rechazadas.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp05;

test.describe("Marcas rechazadas - Rechazo por usuario inhabilitado", { tag: "@regresion" }, () => {
  // Pendiente: realizar la marca de asistencia con el usuario inhabilitado
  test("CP05 - Rechazo por Usuario Inhabilitado", async ({ marcasRechazadas, fichaColaborador }) => {
    // En QA el reporte de marcas rechazadas puede tardar más de un minuto en responder
    test.slow();

    await marcasRechazadas.navegar();
    await marcasRechazadas.filtrarPorColaboradorYFechas(
      datosPrueba.identificador,
      datosPrueba.fechaInicio,
      datosPrueba.fechaFin,
    );
    await marcasRechazadas.panelFiltros.buscar();
    const marca = await marcasRechazadas.obtenerMarcaRechazadaPorMotivo(datosPrueba.motivoRechazo);

    await fichaColaborador.navegar();
    await fichaColaborador.buscarYEditarColaborador(marca.identificador);

    await test.step("Validar que el switch Habilitado del colaborador está apagado", async () => {
      const estaHabilitado = await fichaColaborador.estaHabilitado();
      expect(
        estaHabilitado,
        `Se esperaba que el colaborador ${marca.identificador} estuviera inhabilitado, pero el switch 'Habilitado' está encendido: falso positivo`,
      ).toBe(false);
    });
  });
});
