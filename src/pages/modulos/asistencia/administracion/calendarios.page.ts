import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { RUTAS_MENU } from "@config/rutas.menu";
import { convertirFechaAIso } from "@utils/fecha.util";

const MAXIMO_MESES_A_RECORRER = 36;

export class CalendariosPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_CALENDARIOS;

  readonly panelFiltros: PanelFiltros;
  private readonly encabezadoBusqueda: Locator;
  private readonly campoNombre: Locator;
  private readonly tablaResultados: Locator;
  private readonly calendario: Locator;
  // Clases propias de FullCalendar: la librería no ofrece roles ni textos estables en español
  private readonly botonMesAnterior: Locator;
  private readonly botonMesSiguiente: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.encabezadoBusqueda = page.locator("nb-card-header", { hasText: "Búsqueda de calendario" });
    // Las etiquetas del formulario comparten el mismo `for`, por eso se ancla por el atributo `name`
    this.campoNombre = page.locator('input[name="description"]');
    this.tablaResultados = page.locator("table");
    this.calendario = page.locator("full-calendar");
    this.botonMesAnterior = this.calendario.locator(".fc-prev-button");
    this.botonMesSiguiente = this.calendario.locator(".fc-next-button");
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que la búsqueda de calendarios sea visible", async () => {
      await expect(this.encabezadoBusqueda).toBeVisible();
      await expect(this.campoNombre).toBeVisible();
    });
  }

  async buscarPorNombre(nombre: string): Promise<void> {
    await test.step(`Buscar el calendario: ${nombre}`, async () => {
      await this.campoNombre.fill(nombre);
      await this.panelFiltros.buscar();
    });
  }

  /** Abre la edición del calendario cuyo nombre aparece en los resultados de la búsqueda. */
  async editarCalendario(nombre: string): Promise<void> {
    await test.step(`Abrir la edición del calendario: ${nombre}`, async () => {
      const fila = this.tablaResultados.locator("tbody tr").filter({ hasText: nombre });
      await fila.getByRole("button", { name: "Editar" }).click();
      await expect(this.calendario).toBeVisible();
    });
  }

  /** Horarios (`hh:mm-hh:mm`) que el calendario en edición asigna a la fecha `dd-mm-aaaa`; vacío si no hay. */
  async obtenerHorariosDelDia(fecha: string): Promise<string[]> {
    return await test.step(`Obtener los horarios del calendario para el ${fecha}`, async () => {
      await this.irAlMesDe(fecha);
      const celdaDelDia = this.celdaDelMes(convertirFechaAIso(fecha));
      const horarios = await celdaDelDia.locator(".fc-event-title").allInnerTexts();
      return horarios.map((horario) => horario.trim());
    });
  }

  /** Celda del día dentro del mes que se está mostrando (excluye los días de relleno de otros meses). */
  private celdaDelMes(fechaIso: string): Locator {
    return this.calendario.locator(`td[data-date="${fechaIso}"]:not(.fc-day-other)`);
  }

  /** Avanza o retrocede mes a mes hasta que el calendario muestre la fecha buscada. */
  private async irAlMesDe(fecha: string): Promise<void> {
    const fechaIso = convertirFechaAIso(fecha);
    const primeraCelda = this.calendario.locator("td[data-date]").first();
    await expect(primeraCelda).toBeVisible();

    for (let mes = 0; mes < MAXIMO_MESES_A_RECORRER; mes++) {
      if ((await this.celdaDelMes(fechaIso).count()) > 0) return;

      const primeraFecha = (await primeraCelda.getAttribute("data-date")) ?? "";
      const boton = fechaIso < primeraFecha ? this.botonMesAnterior : this.botonMesSiguiente;
      await boton.click();
      // Se espera el cambio de mes antes de decidir de nuevo, para no avanzar dos veces
      await expect(primeraCelda).not.toHaveAttribute("data-date", primeraFecha);
    }
    throw new Error(`No se pudo llegar al mes de ${fecha} en el calendario`);
  }
}
