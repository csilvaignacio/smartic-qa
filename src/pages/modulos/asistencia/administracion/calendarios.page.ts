import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { TIEMPOS_ESPERA } from "@config/constantes";
import { RUTAS_MENU } from "@config/rutas.menu";
import { convertirFechaAIso } from "@utils/fecha.util";

const MAXIMO_MESES_A_RECORRER = 36;

export class CalendariosPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_CALENDARIOS;

  readonly panelFiltros: PanelFiltros;
  private readonly encabezadoBusqueda: Locator;
  private readonly campoNombre: Locator;
  private readonly filasResultados: Locator;
  private readonly calendario: Locator;
  // Clases propias de FullCalendar: la librería no ofrece roles ni textos estables en español
  private readonly botonMesAnterior: Locator;
  private readonly botonMesSiguiente: Locator;
  private readonly primeraCeldaDelMes: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.encabezadoBusqueda = page.locator("nb-card-header", { hasText: "Búsqueda de calendario" });
    // Las etiquetas del formulario comparten el mismo `for`, por eso se ancla por el atributo `name`
    this.campoNombre = page.locator('input[name="description"]');
    this.filasResultados = page.locator("table tbody tr");
    this.calendario = page.locator("full-calendar");
    this.botonMesAnterior = this.calendario.locator(".fc-prev-button");
    this.botonMesSiguiente = this.calendario.locator(".fc-next-button");
    this.primeraCeldaDelMes = this.calendario.locator("td[data-date]").first();
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

  /** Abre la edición del calendario cuyo nombre coincide exactamente en los resultados de la búsqueda. */
  async editarCalendario(nombre: string): Promise<void> {
    await test.step(`Abrir la edición del calendario: ${nombre}`, async () => {
      await this.filasResultados
        .filter({ has: this.page.getByRole("cell", { name: nombre, exact: true }) })
        .getByRole("button", { name: "Editar" })
        .click();
      // Tras el clic los botones quedan deshabilitados mientras el backend arma la edición
      await expect(this.calendario).toBeVisible({ timeout: TIEMPOS_ESPERA.cargaEdicion });
    });
  }

  /** Horarios (`hh:mm-hh:mm`) que el calendario en edición asigna a la fecha `dd-mm-aaaa`; vacío si no hay. */
  async obtenerHorariosDelDia(fecha: string): Promise<string[]> {
    return await test.step(`Obtener los horarios del calendario para el ${fecha}`, async () => {
      await this.irAlMesDe(fecha);
      const horarios = await this.celdaDelMes(convertirFechaAIso(fecha))
        .locator(".fc-event-title")
        .allInnerTexts();
      return horarios.map((horario) => horario.trim());
    });
  }

  /** Nombre del único horario que el calendario en edición asigna a la fecha `dd-mm-aaaa`. */
  async obtenerHorarioDelDia(fecha: string): Promise<string> {
    const horarios = await this.obtenerHorariosDelDia(fecha);
    const [horario] = horarios;
    if (!horario || horarios.length > 1) {
      throw new Error(
        `Se esperaba un único horario asignado al ${fecha}, pero se encontraron ${horarios.length}: [${horarios.join(", ")}]`,
      );
    }
    return horario;
  }

  /** Celda del día dentro del mes que se está mostrando (excluye los días de relleno de otros meses). */
  private celdaDelMes(fechaIso: string): Locator {
    return this.calendario.locator(`td[data-date="${fechaIso}"]:not(.fc-day-other)`);
  }

  /** Avanza o retrocede mes a mes hasta que el calendario muestre la fecha buscada. */
  private async irAlMesDe(fecha: string): Promise<void> {
    const fechaIso = convertirFechaAIso(fecha);
    await expect(this.primeraCeldaDelMes).toBeVisible();

    for (let mes = 0; mes < MAXIMO_MESES_A_RECORRER; mes++) {
      if ((await this.celdaDelMes(fechaIso).count()) > 0) return;

      const primeraFecha = (await this.primeraCeldaDelMes.getAttribute("data-date")) ?? "";
      const boton = fechaIso < primeraFecha ? this.botonMesAnterior : this.botonMesSiguiente;
      await boton.click();
      // Se espera el cambio de mes antes de decidir de nuevo, para no avanzar dos veces
      await expect(this.primeraCeldaDelMes).not.toHaveAttribute("data-date", primeraFecha);
    }
    throw new Error(`No se pudo llegar al mes de ${fecha} en el calendario`);
  }
}
