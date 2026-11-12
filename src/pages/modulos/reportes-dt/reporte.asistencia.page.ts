import { expect, Locator, Page, test } from "@playwright/test";
import { BaseReporteDTPage } from "@pages/modulos/reportes-dt/base.reporte.dt.page";
import { SelectorFecha } from "@helpers/selector.fecha.helper";
import { SelectorLista } from "@helpers/selector.lista.helper";
import { TIEMPOS_ESPERA } from "@config/constantes";
import { RUTAS_MENU } from "@config/rutas";

/** Posición de cada columna en la tabla del reporte. */
const COLUMNAS_REPORTE = {
  asistencia: 1,
  ausencia: 2,
} as const;

export class ReporteAsistenciaPage extends BaseReporteDTPage {
  protected readonly rutaMenu = RUTAS_MENU.REPORTE_ASISTENCIA_DT;

  private readonly selectorRut: SelectorLista;
  private readonly campoFechaInicio: SelectorFecha;
  private readonly campoFechaTermino: SelectorFecha;
  private readonly tablaResultados: Locator;
  private readonly celdaEstablecimientoFaena: Locator;

  constructor(page: Page) {
    super(page);
    this.selectorRut = new SelectorLista(page, "identification");
    this.campoFechaInicio = new SelectorFecha(page, "startDate");
    this.campoFechaTermino = new SelectorFecha(page, "endDate");
    this.tablaResultados = page.locator("table");
    // El dato viene como "Local, establecimiento o faena: <valor>" dentro de la cabecera del reporte
    this.celdaEstablecimientoFaena = page
      .locator("td b")
      .filter({ hasText: "Local, establecimiento" })
      .first();
  }

  async ingresarRut(rut: string | number): Promise<void> {
    await test.step(`Ingresar RUT ${rut}`, async () => {
      await this.selectorRut.seleccionarPorTexto(rut);
    });
  }

  async ingresarFechaInicio(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de inicio ${fecha}`, async () => {
      await this.campoFechaInicio.ingresarFecha(fecha);
    });
  }

  async ingresarFechaTermino(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de término ${fecha}`, async () => {
      await this.campoFechaTermino.ingresarFecha(fecha);
    });
  }

  /** Atajo: llena RUT y rango de fechas. No pulsa Buscar: eso lo decide el spec. */
  async filtrarPorRutYFechas(rut: string, fechaInicio: string, fechaTermino: string): Promise<void> {
    await test.step("Filtrar reporte por RUT y rango de fechas", async () => {
      await this.ingresarRut(rut);
      await this.ingresarFechaInicio(fechaInicio);
      await this.ingresarFechaTermino(fechaTermino);
    });
  }

  async esperarResultados(): Promise<void> {
    await test.step("Esperar que cargue la tabla de resultados", async () => {
      await expect(this.celdaEstablecimientoFaena).toBeVisible({ timeout: TIEMPOS_ESPERA.reporte });
    });
  }

  async obtenerEstablecimientoFaena(): Promise<string> {
    return await test.step("Obtener el valor de Establecimiento/Faena", async () => {
      const textoCompleto = await this.celdaEstablecimientoFaena.innerText();
      const [, valor] = textoCompleto.split(":");
      return (valor ?? textoCompleto).trim();
    });
  }

  /** Devuelve el valor de "Ausencia" (en minúsculas) de la primera fila cuya "Asistencia" sea SI. */
  async obtenerAusenciaPrimeraAsistencia(): Promise<string> {
    return await test.step('Obtener Ausencia de la primera fila con Asistencia "SI"', async () => {
      const filaObjetivo = this.tablaResultados
        .locator("tbody tr")
        .filter({
          // Regex completa y sensible a mayúsculas: `hasText: "SI"` también calzaría con "Sin" o "si"
          has: this.page
            .locator("td")
            .nth(COLUMNAS_REPORTE.asistencia)
            .filter({ hasText: /^\s*SI\s*$/ }),
        })
        .first();

      try {
        await filaObjetivo.waitFor({ state: "visible", timeout: TIEMPOS_ESPERA.busquedaSelector });
      } catch {
        throw new Error("No se encontró ninguna fila en la tabla donde la Asistencia sea 'SI'");
      }

      const valorAusencia = await filaObjetivo.locator("td").nth(COLUMNAS_REPORTE.ausencia).innerText();
      return valorAusencia.trim().toLowerCase();
    });
  }
}
