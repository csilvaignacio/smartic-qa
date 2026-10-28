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

  async seleccionarEmpresa(nombreEmpresa: string): Promise<void> {
    await test.step(`Ingresar a la empresa ${nombreEmpresa}`, async () => {
      await this.filasTabla
        .filter({ hasText: nombreEmpresa })
        .getByRole("gridcell")
        .last()
        .getByRole("button")
        .click();
    });
  }
}
