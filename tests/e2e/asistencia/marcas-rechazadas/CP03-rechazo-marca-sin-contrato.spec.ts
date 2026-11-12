import { PESTANAS_FICHA_COLABORADOR } from "@config/constantes";
import datos from "@data/marcas.rechazadas.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp03;

test.describe("Marcas rechazadas - Rechazo por marca sin contrato", { tag: "@regresion" }, () => {
  test("CP03 - Rechazo por Marca sin Contrato", async ({ marcasRechazadas, fichaColaborador }) => {
    // En QA el reporte de marcas rechazadas puede tardar más de un minuto en responder
    test.slow();

    await marcasRechazadas.navegar();
    await marcasRechazadas.seleccionarRangoFechas(
      datosPrueba.rangoFechas.fechaInicio,
      datosPrueba.rangoFechas.fechaFin,
    );
    await marcasRechazadas.panelFiltros.buscar();
    const marca = await marcasRechazadas.obtenerMarcaRechazadaPorMotivo(datosPrueba.motivoRechazo);

    await fichaColaborador.navegar();
    await fichaColaborador.buscarYEditarColaborador(marca.identificador);
    await fichaColaborador.abrirPestana(PESTANAS_FICHA_COLABORADOR.CONTRATO);

    await test.step("Validar que el colaborador no tiene un contrato vigente a la fecha de la marca", async () => {
      const tieneContratoVigente = await fichaColaborador.contrato.tieneVigente(marca.fechaMarca);
      expect(
        tieneContratoVigente,
        `Se esperaba que el colaborador ${marca.identificador} no tuviera contrato vigente al ${marca.fechaMarca}, pero se encontró uno: falso positivo`,
      ).toBe(false);
    });
  });
});
