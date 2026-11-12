import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PestanaAgendaComponent } from "@components/ficha-colaborador/pestana.agenda.comp";
import { PestanaContratoComponent } from "@components/ficha-colaborador/pestana.contrato.comp";
import { PestanaLocalEstabFaenaComponent } from "@components/ficha-colaborador/pestana.local.estab.faena.comp";
import { PanelFiltros } from "@helpers/panel.filtros.helper";
import { PestanaFichaColaborador, TIEMPOS_ESPERA } from "@config/constantes";
import { RUTAS_MENU } from "@config/rutas.menu";
import { textoExacto } from "@utils/texto.util";

export class FichaColaboradorPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_FICHA_COLABORADOR;

  readonly panelFiltros: PanelFiltros;
  readonly contrato: PestanaContratoComponent;
  readonly localEstabFaena: PestanaLocalEstabFaenaComponent;
  readonly agenda: PestanaAgendaComponent;
  private readonly contenedor: Locator;
  private readonly campoIdentificador: Locator;
  private readonly filasResultados: Locator;
  private readonly campoIdentificadorFicha: Locator;
  private readonly switchHabilitado: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.contrato = new PestanaContratoComponent(page);
    this.localEstabFaena = new PestanaLocalEstabFaenaComponent(page);
    this.agenda = new PestanaAgendaComponent(page);
    this.contenedor = page.locator("nb-card-body").first();
    this.campoIdentificador = page.getByRole("textbox", { name: "Identificador" });
    this.filasResultados = page.locator("table tbody tr");
    this.campoIdentificadorFicha = page.locator("#inputIdentificationNumber");
    // La etiqueta "Habilitado" no está asociada al control, por eso se ancla por `formcontrolname`
    this.switchHabilitado = page.locator('nb-toggle[formcontrolname="enabled"]').getByRole("switch");
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que la Ficha Colaborador sea visible", async () => {
      await expect(this.contenedor).toBeVisible();
      await expect(this.campoIdentificador).toBeVisible();
    });
  }

  async ingresarIdentificador(identificador: string): Promise<void> {
    await test.step(`Ingresar identificador: ${identificador}`, async () => {
      await this.campoIdentificador.fill(identificador);
    });
  }

  /**
   * Abre la ficha del colaborador desde los resultados. La búsqueda es por prefijo ("1001" trae varios)
   * y la pantalla carga primero el listado completo: por eso se apunta a la fila con la celda exacta.
   */
  async editarColaborador(identificador: string): Promise<void> {
    await test.step(`Abrir la ficha del colaborador ${identificador}`, async () => {
      await this.filasResultados
        .filter({ has: this.page.getByRole("cell", { name: identificador, exact: true }) })
        .getByRole("button", { name: "editar" })
        .click();
    });
  }

  /** Atajo: busca al colaborador por identificador, abre su ficha y espera que termine de cargar. */
  async buscarYEditarColaborador(identificador: string): Promise<void> {
    await this.ingresarIdentificador(identificador);
    await this.panelFiltros.buscar();
    await this.editarColaborador(identificador);
    await this.esperarFichaCargada(identificador);
  }

  async esperarFichaCargada(identificador: string): Promise<void> {
    await test.step(`Esperar que cargue la ficha del colaborador ${identificador}`, async () => {
      await expect(this.campoIdentificadorFicha).toHaveValue(identificador, {
        timeout: TIEMPOS_ESPERA.cargaEdicion,
      });
    });
  }

  /** Lee el switch "Habilitado" de la pestaña inicial; llamar después de `esperarFichaCargada`. */
  async estaHabilitado(): Promise<boolean> {
    return await test.step("Verificar si el colaborador está habilitado", async () => {
      return await this.switchHabilitado.isChecked();
    });
  }

  async abrirPestana(nombre: PestanaFichaColaborador): Promise<void> {
    await test.step(`Abrir la pestaña: ${nombre}`, async () => {
      // Coincidencia exacta: "CONTRATO" también calza con el enlace del menú "Tipos de contrato"
      await this.page.getByRole("link", { name: textoExacto(nombre) }).click();
    });
  }
}
