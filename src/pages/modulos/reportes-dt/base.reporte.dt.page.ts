import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { Paginacion } from "@helpers/paginacion.util";

/** Base de los reportes del módulo "Reportes DT": todos comparten panel de filtros y paginación. */
export abstract class BaseReporteDTPage extends BaseModuloPage {
  readonly panelFiltros: PanelFiltros;
  readonly paginacion: Paginacion;
  private readonly seccionFiltrosReporte: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.paginacion = new Paginacion(page);
    this.seccionFiltrosReporte = page.locator("ngx-filter-report-dt");
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que el reporte esté listo", async () => {
      await this.esperarCarga();
      await expect(this.seccionFiltrosReporte).toBeVisible();
    });
  }
}
