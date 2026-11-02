import { RUTAS_MENU } from "@config/rutas.menu";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { Page, Locator } from "@playwright/test";
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

  constructor(page: Page) {
    super(page);
    this.contenedor = page.locator("ngx-transaction-reject");
    this.panelFiltros = new PanelFiltros(page);
    this.busquedaGrupal = new BusquedaGrupalComponent(page);
    this.campoFechaInicio = new SelectorFecha(page, "startDate");
    this.campoFechaFin = new SelectorFecha(page, "endDate");
    this.enlaceBusquedaGrupal = page.getByText("Búsqueda grupal", { exact: true });
  }

  async abrirBusquedaGrupal(): Promise<void> {
    await this.enlaceBusquedaGrupal.click();
  }

  async seleccionarRangoFechas(fechaInicio: string, fechaFin: string): Promise<void> {
    await this.campoFechaInicio.ingresarFecha(fechaInicio);
    await this.campoFechaFin.ingresarFecha(fechaFin);
    await this.contenedor.click();
  }
}
