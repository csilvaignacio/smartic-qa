import { RUTAS_MENU } from "@config/rutas.menu";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { expect, Locator, Page, test } from "@playwright/test";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { SelectorFecha } from "@helpers/selector.fecha.util";
import { BusquedaGrupalComponent } from "@components/busqueda.grupal.comp";

export class MarcasRechazadasPage extends BaseModuloPage {
  protected override rutaMenu = RUTAS_MENU.ASISTENCIA_MARCAS_RECHAZADAS;

  private readonly contenedor: Locator;
  readonly panelFiltros: PanelFiltros;
  readonly busquedaGrupal: BusquedaGrupalComponent;
  private readonly campoFechaInicio: SelectorFecha;
  private readonly campoFechaFin: SelectorFecha;
  private readonly enlaceBusquedaGrupal: Locator;
  private readonly tablaResultados: Locator;

  constructor(page: Page) {
    super(page);
    this.contenedor = page.locator("ngx-transaction-reject");
    this.panelFiltros = new PanelFiltros(page);
    this.busquedaGrupal = new BusquedaGrupalComponent(page);
    this.campoFechaInicio = new SelectorFecha(page, "startDate");
    this.campoFechaFin = new SelectorFecha(page, "endDate");
    this.enlaceBusquedaGrupal = page.getByText("Búsqueda grupal", { exact: true });
    this.tablaResultados = this.contenedor.locator("table");
  }

  /** Fila de la tabla de resultados que corresponde al colaborador con ese identificador. */
  private filaDelColaborador(identificador: string): Locator {
    return this.tablaResultados.locator("tbody tr").filter({ hasText: identificador });
  }

  async abrirBusquedaGrupal(): Promise<void> {
    await this.enlaceBusquedaGrupal.click();
  }

  async seleccionarRangoFechas(fechaInicio: string, fechaFin: string): Promise<void> {
    await this.campoFechaInicio.ingresarFecha(fechaInicio);
    await this.campoFechaFin.ingresarFecha(fechaFin);
    await this.contenedor.click();
  }

  async validarMarcaRechazada(identificador: string): Promise<void> {
    await test.step(`Validar que exista una marca rechazada del colaborador ${identificador}`, async () => {
      await expect(this.filaDelColaborador(identificador).first()).toBeVisible();
    });
  }

  async obtenerMotivoRechazo(identificador: string): Promise<string> {
    return await test.step(`Obtener el motivo de rechazo del colaborador ${identificador}`, async () => {
      const indiceColumnaMotivoRechazo = 9;
      const celda = this.filaDelColaborador(identificador)
        .first()
        .locator("td")
        .nth(indiceColumnaMotivoRechazo);
      return (await celda.innerText()).trim();
    });
  }
}
