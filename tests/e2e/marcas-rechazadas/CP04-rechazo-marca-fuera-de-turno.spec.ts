import { PESTANAS_FICHA_COLABORADOR } from "@config/constantes";
import datos from "@data/marcas.rechazadas.json";
import { expect, test } from "@fixtures";
import { estaHoraEnRango } from "@utils/fecha.util";

const datosPrueba = datos.cp04;

test.describe("Marcas rechazadas - Rechazo por marca fuera de turno", { tag: "@regresion" }, () => {
  test("CP04 - Rechazo por Marca fuera de Turno", async ({
    marcasRechazadas,
    fichaColaborador,
    calendarios,
    horarios,
  }) => {
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

    await test.step("Validar que el colaborador tiene un contrato vigente a la fecha de la marca", async () => {
      const tieneContratoVigente = await fichaColaborador.contrato.tieneVigente(marca.fechaMarca);
      expect(
        tieneContratoVigente,
        `Se esperaba un contrato vigente al ${marca.fechaMarca} para el colaborador ${marca.identificador}, pero no existe: el rechazo no corresponde a 'Marca fuera de turno'`,
      ).toBe(true);
    });

    await fichaColaborador.abrirPestana(PESTANAS_FICHA_COLABORADOR.AGENDA);
    const nombreCalendario = await fichaColaborador.agenda.obtenerCalendarioVigente(marca.fechaMarca);

    await calendarios.navegar();
    await calendarios.buscarPorNombre(nombreCalendario);
    await calendarios.editarCalendario(nombreCalendario);
    const nombreHorario = await calendarios.obtenerHorarioDelDia(marca.fechaMarca);

    await horarios.navegar();
    await horarios.buscarPorNombre(nombreHorario);
    await horarios.editarHorario(nombreHorario);
    await horarios.abrirPeriodosHorarios();
    const { inicio, fin } = await horarios.obtenerRangoPeriodos();

    await test.step("Validar que la marca está fuera del rango de los periodos horarios", () => {
      const marcaDentroDelTurno = estaHoraEnRango(marca.horaMarca, inicio, fin);
      expect(
        marcaDentroDelTurno,
        `Se esperaba que la marca del ${marca.fechaMarca}
        a las ${marca.horaMarca} estuviera fuera del turno '${nombreHorario}' (${inicio}
        a ${fin}), pero se encontró dentro: falso positivo`,
      ).toBe(false);
    });
  });
});
