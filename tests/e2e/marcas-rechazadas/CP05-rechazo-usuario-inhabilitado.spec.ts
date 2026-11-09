import datos from "@data/marcas.rechazadas.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp05;

test.describe("Marcas rechazadas - Rechazo por usuario inhabilitado", { tag: "@regresion" }, () => {
  test("CP05 - Rechazo por Usuario Inhabilitado", async ({ marcasRechazadas, fichaColaborador }) => {
    await marcasRechazadas.navegar();
    await marcasRechazadas.seleccionarRangoFechas(
      datosPrueba.rangoFechas.fechaInicio,
      datosPrueba.rangoFechas.fechaFin,
    );
    await marcasRechazadas.panelFiltros.buscar();
    const marca = await marcasRechazadas.obtenerMarcaRechazadaPorMotivo(datosPrueba.motivoRechazo);

    await fichaColaborador.navegar();
    await fichaColaborador.buscarYEditarColaborador(marca.identificador);

    await test.step("Validar que el switch Habilitado del colaborador está apagado", async () => {
      const estaHabilitado = await fichaColaborador.estaHabilitado(marca.identificador);
      expect(
        estaHabilitado,
        `Se esperaba que el colaborador ${marca.identificador} estuviera inhabilitado, pero el switch 'Habilitado' está encendido: falso positivo`,
      ).toBe(false);
    });
  });
});
