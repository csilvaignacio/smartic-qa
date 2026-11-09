import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { RUTAS_MENU } from "@config/rutas.menu";

export type RangoPeriodos = {
  inicio: string;
  fin: string;
};

export class HorariosPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_HORARIOS;

  readonly panelFiltros: PanelFiltros;
  private readonly encabezadoBusqueda: Locator;
  private readonly encabezadoEdicion: Locator;
  private readonly campoNombre: Locator;
  private readonly filasResultados: Locator;
  private readonly botonPeriodosHorarios: Locator;
  private readonly camposInicioPeriodo: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.encabezadoBusqueda = page.locator("nb-card-header", { hasText: "Búsqueda de horario" });
    this.encabezadoEdicion = page.locator("nb-card-header", { hasText: "Edición de horario" });
    // Las etiquetas del formulario comparten el mismo `for`, por eso se ancla por el atributo `name`
    this.campoNombre = page.locator('input[name="description"]');
    this.filasResultados = page.locator("table tbody tr");
    this.botonPeriodosHorarios = page.getByRole("button", { name: "Periodos horarios" });
    this.camposInicioPeriodo = page.locator('nb-dialog-container input[formcontrolname="timeInit"]');
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que la búsqueda de horarios sea visible", async () => {
      await expect(this.encabezadoBusqueda).toBeVisible();
      await expect(this.campoNombre).toBeVisible();
    });
  }

  async buscarPorNombre(nombre: string): Promise<void> {
    await test.step(`Buscar el horario: ${nombre}`, async () => {
      await this.campoNombre.fill(nombre);
      await this.panelFiltros.buscar();
    });
  }

  /** Abre la edición del horario cuyo nombre coincide exactamente en los resultados de la búsqueda. */
  async editarHorario(nombre: string): Promise<void> {
    await test.step(`Abrir la edición del horario: ${nombre}`, async () => {
      const filas = this.filasResultados.filter({
        has: this.page.getByRole("cell", { name: nombre, exact: true }),
      });
      await expect(filas.first()).toBeVisible();

      // Hay horarios distintos con el mismo nombre: elegir uno al azar validaría contra otro turno
      const cantidad = await filas.count();
      if (cantidad > 1) {
        throw new Error(`Se esperaba un único horario llamado '${nombre}', pero se encontraron ${cantidad}`);
      }

      await filas.getByRole("button", { name: "Editar" }).click();
      await expect(this.encabezadoEdicion).toBeVisible();
    });
  }

  async abrirPeriodosHorarios(): Promise<void> {
    await test.step("Abrir el detalle de periodos horarios", async () => {
      await this.botonPeriodosHorarios.click();
      await expect(this.camposInicioPeriodo.first()).not.toHaveValue("");
    });
  }

  /** Hora del primer y del último registro de los periodos horarios abiertos (`hh:mm`). */
  async obtenerRangoPeriodos(): Promise<RangoPeriodos> {
    return await test.step("Obtener el rango de los periodos horarios", async () => {
      const campos = await this.camposInicioPeriodo.all();
      const horas = await Promise.all(campos.map(async (campo) => await campo.inputValue()));
      const inicio = horas[0];
      const fin = horas.at(-1);
      if (!inicio || !fin) {
        throw new Error("El horario no tiene periodos horarios registrados");
      }
      return { inicio, fin };
    });
  }
}
