import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { RUTAS_MENU } from "@config/rutas.menu";
import { PestanaFichaColaborador } from "@config/constantes";
import { PestanaAgendaComponent } from "@components/ficha.colaborador/pestana.agenda.comp";
import { PestanaContratoComponent } from "@components/ficha.colaborador/pestana.contrato.comp";
import { PestanaLocalEstabFaenaComponent } from "@components/ficha.colaborador/pestana.local.estab.faena.comp";

export class FichaColaboradorPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_FICHA_COLABORADOR;

  readonly panelFiltros: PanelFiltros;
  readonly contrato: PestanaContratoComponent;
  readonly localEstabFaena: PestanaLocalEstabFaenaComponent;
  readonly agenda: PestanaAgendaComponent;
  private readonly contenedor: Locator;
  private readonly campoIdentificador: Locator;
  private readonly botonEditar: Locator;
  private readonly campoIdentificadorFicha: Locator;
  private readonly switchHabilitado: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.contrato = new PestanaContratoComponent(page);
    this.localEstabFaena = new PestanaLocalEstabFaenaComponent(page);
    this.agenda = new PestanaAgendaComponent(page);
    this.contenedor = page.locator("nb-card-body");
    this.campoIdentificador = page.getByRole("textbox", { name: "Identificador" });
    this.botonEditar = page.getByRole("button", { name: "editar" });
    this.campoIdentificadorFicha = page.locator("#inputIdentificationNumber");
    // La etiqueta "Habilitado" no está asociada al control, por eso se ancla por `formcontrolname`
    this.switchHabilitado = page.locator('nb-toggle[formcontrolname="enabled"]').getByRole("switch");
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

  async esperarFichaCargada(identificador: string): Promise<void> {
    await test.step(`Esperar que cargue la ficha del colaborador ${identificador}`, async () => {
      await expect(this.campoIdentificadorFicha).toHaveValue(identificador);
    });
  }

  /** Lee el switch "Habilitado" solo cuando la ficha ya cargó, para no tomar su valor inicial. */
  async estaHabilitado(identificador: string): Promise<boolean> {
    return await test.step(`Verificar si el colaborador ${identificador} está habilitado`, async () => {
      await this.esperarFichaCargada(identificador);
      return await this.switchHabilitado.isChecked();
    });
  }

  async abrirPestana(nombre: PestanaFichaColaborador): Promise<void> {
    await test.step(`Abrir la pestaña: ${nombre}`, async () => {
      // Coincidencia exacta: "CONTRATO" también calza con el enlace del menú "Tipos de contrato"
      await this.page.getByRole("link", { name: new RegExp(`^${nombre}$`, "i") }).click();
    });
  }
}
