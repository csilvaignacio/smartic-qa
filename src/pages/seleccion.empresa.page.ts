import { expect, Locator, Page, test } from "@playwright/test";
import { BasePage } from "@pages/base.page";

export class SeleccionEmpresaPage extends BasePage {
  private readonly tablaResultados: Locator;
  private readonly filasTabla: Locator;

  constructor(page: Page) {
    super(page);
    this.tablaResultados = page.getByRole("table");
    this.filasTabla = page.getByRole("row");
  }

  override async esperarVisible(): Promise<void> {
    await expect(this.tablaResultados).toBeVisible();
  }

  async seleccionarEmpresa(idEmpresa: string): Promise<void> {
    await test.step(`Ingresar a la empresa ${idEmpresa}`, async () => {
      await this.filasTabla
        // Celda exacta: con `hasText` el rut 1234567-8 también calzaría con 11234567-8
        .filter({ has: this.page.getByRole("gridcell", { name: idEmpresa, exact: true }) })
        .getByRole("gridcell")
        .last()
        .getByRole("button")
        .click();
    });
  }
}
