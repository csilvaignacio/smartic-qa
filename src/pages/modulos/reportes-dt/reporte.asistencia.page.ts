import { expect, Locator, Page, test } from "@playwright/test";
import { BaseReporteDTPage } from "@pages/modulos/reportes-dt/base.reporte.dt.page";
import { SelectorLista } from "@helpers/selector.lista.util";
import { SelectorFecha } from "@helpers/selector.fecha.util";
import { RUTAS_MENU } from "@config/rutas.menu";

export class ReporteAsistenciaPage extends BaseReporteDTPage {
  protected readonly rutaMenu = RUTAS_MENU.REPORTE_ASISTENCIA_DT;

  // Filtros propios del reporte
  private readonly selectorRut: SelectorLista;
  private readonly fechaInicio: SelectorFecha;
  private readonly fechaTermino: SelectorFecha;

  private readonly tablaResultados: Locator;
  private readonly celdaEstablecimientoFaena: Locator;

  constructor(page: Page) {
    super(page);
    this.selectorRut = new SelectorLista(page, "identification");
    this.fechaInicio = new SelectorFecha(page, "startDate");
    this.fechaTermino = new SelectorFecha(page, "endDate");
    this.tablaResultados = page.locator("table");
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
      await this.fechaInicio.ingresarFecha(fecha);
    });
  }

  async ingresarFechaTermino(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de término ${fecha}`, async () => {
      await this.fechaTermino.ingresarFecha(fecha);
    });
  }

  /** Atajo: completa RUT + rango de fechas y presiona Buscar. */
  async filtrarPorRutYFechas(rut: string, fechaInicio: string, fechaTermino: string): Promise<void> {
    await test.step("Filtrar reporte por RUT y rango de fechas", async () => {
      await this.ingresarRut(rut);
      await this.ingresarFechaInicio(fechaInicio);
      await this.ingresarFechaTermino(fechaTermino);
      await this.panelFiltros.buscar();
    });
  }

  async esperarResultados(): Promise<void> {
    await test.step("Esperar que cargue la tabla de resultados", async () => {
      await expect(this.celdaEstablecimientoFaena).toBeVisible();
    });
  }

  async obtenerEstablecimientoFaena(): Promise<string> {
    return await test.step("Obtener el valor de Establecimiento/Faena", async () => {
      const textoCompleto = await this.celdaEstablecimientoFaena.innerText();
      const [, valor] = textoCompleto.split(":");
      return (valor ?? textoCompleto).trim();
    });
  }

  /** Devuelve el valor de "Ausencia" de la primera fila cuya "Asistencia" sea SI (en minúsculas). */
  async obtenerAusenciaPrimeraAsistencia(): Promise<string> {
    return await test.step('Obtener Ausencia de la primera fila con Asistencia "SI"', async () => {
      await expect(this.tablaResultados).toBeVisible();

      const indiceColumnaAsistencia = 1;
      const indiceColumnaAusencia = 2;

      const filaObjetivo = this.tablaResultados
        .locator("tbody tr")
        .filter({
          has: this.page.locator("td").nth(indiceColumnaAsistencia).filter({ hasText: "SI" }),
        })
        .first();

      if ((await filaObjetivo.count()) === 0) {
        throw new Error("No se encontró ninguna fila en la tabla donde la Asistencia sea 'SI'.");
      }

      const valorAusencia = await filaObjetivo.locator("td").nth(indiceColumnaAusencia).innerText();
      return valorAusencia.trim().toLowerCase();
    });
  }
}
