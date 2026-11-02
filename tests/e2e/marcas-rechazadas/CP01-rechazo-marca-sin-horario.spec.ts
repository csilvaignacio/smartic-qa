import { PESTANAS_FICHA_COLABORADOR } from "@config/constantes";
import { expect, test } from "@fixtures";
import { estaHoraEnAlgunHorario } from "@utils/fecha.util";

const datosPrueba = {
  rangoFechas: {
    fechaInicio: "01-10-2026",
    fechaFin: "31-10-2026",
  },
  motivoRechazo: "Marca sin horario",
} as const;

test.describe("Marcas rechazadas - Rechazo por marca sin horario asignado", { tag: "@regresion" }, () => {
  test("CP01 - Rechazo por Marca sin Horario", async ({
    marcasRechazadas,
    fichaColaborador,
    calendarios,
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
      const tieneContratoVigente = await fichaColaborador.tieneContratoVigente(marca.fechaMarca);
      expect(
        tieneContratoVigente,
        `Se esperaba un contrato vigente al ${marca.fechaMarca} para el colaborador ${marca.identificador}, pero no existe: el rechazo no corresponde a 'Marca sin horario'`,
      ).toBe(true);
    });

    await fichaColaborador.abrirPestana(PESTANAS_FICHA_COLABORADOR.AGENDA);
    const nombreCalendario = await fichaColaborador.obtenerCalendarioVigente(marca.fechaMarca);

    await calendarios.navegar();
    await calendarios.buscarPorNombre(nombreCalendario);
    await calendarios.editarCalendario(nombreCalendario);
    const horarios = await calendarios.obtenerHorariosDelDia(marca.fechaMarca);

    await test.step("Validar que la marca no está dentro de ningún horario del calendario", () => {
      const marcaDentroDeHorario = estaHoraEnAlgunHorario(marca.horaMarca, horarios);
      expect(
        marcaDentroDeHorario,
        `Se esperaba que la marca del ${marca.fechaMarca} a las ${marca.horaMarca} estuviera fuera de los horarios del calendario '${nombreCalendario}' (falso positivo si está dentro), pero se encontró dentro de: [${horarios.join(", ")}]`,
      ).toBe(false);
    });
  });
});
