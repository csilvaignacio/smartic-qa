import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { RUTAS_MENU } from "@config/rutas.menu";
import { PestanaFichaColaborador } from "@config/constantes";

export class FichaColaboradorPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_FICHA_COLABORADOR;

  readonly panelFiltros: PanelFiltros;
  private readonly contenedor: Locator;
  private readonly campoIdentificador: Locator;
  private readonly botonEditar: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.contenedor = page.locator("nb-card-body");
    this.campoIdentificador = page.getByRole("textbox", { name: "Identificador" });
    this.botonEditar = page.getByRole("button", { name: "editar" });
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que la Ficha Colaborador sea visible", async () => {
      await expect(this.contenedor.first()).toBeVisible();
      await expect(this.campoIdentificador).toBeVisible();
    });
  }

  async ingresarIdentificador(identificador: string): Promise<void> {
    await test.step(`Ingresar identificador: ${identificador}`, async () => {
      await this.campoIdentificador.fill(identificador);
    });
  }

  async editarColaborador(): Promise<void> {
    await test.step("Clic en el botón Editar", async () => {
      await this.botonEditar.click();
    });
  }

  /** Atajo: busca al colaborador por identificador y abre su ficha en modo edición. */
  async buscarYEditarColaborador(identificador: string): Promise<void> {
    await this.ingresarIdentificador(identificador);
    await this.panelFiltros.buscar();
    await this.editarColaborador();
  }

  async abrirPestana(nombre: PestanaFichaColaborador): Promise<void> {
    await test.step(`Abrir la pestaña: ${nombre}`, async () => {
      // Coincidencia exacta: "CONTRATO" también calza con el enlace del menú "Tipos de contrato"
      await this.page.getByRole("link", { name: new RegExp(`^${nombre}$`, "i") }).click();
    });
  }

  // ---- Pestaña LOCAL.ESTAB.FAENA ----

  async obtenerEstablecimientoFaenaAsignado(): Promise<string> {
    return await test.step("Obtener el Establecimiento/Faena asignado", async () => {
      const tabla = this.page.locator("table").filter({ hasText: "Est. Faena" });
      const celda = tabla.locator("tbody tr").first().locator("td").nth(2);
      return (await celda.innerText()).trim();
    });
  }

  // ---- Pestaña AGENDA ----

  async tieneAnotacionCalendario(): Promise<boolean> {
    return await test.step('Verificar si existe una anotación tipo "Calendario" en la Agenda', async () => {
      const tabla = this.page.locator("table").filter({ hasText: "Tipo Anotación" });
      const indiceColumnaAnotacion = 2;

      const filaObjetivo = tabla.locator("tbody tr").filter({
        has: this.page.locator("td").nth(indiceColumnaAnotacion).filter({ hasText: "Calendario" }),
      });
      try {
        await filaObjetivo.first().waitFor({ state: "attached", timeout: 10_000 });
        return true;
      } catch {
        return false;
      }
    });
  }
}
