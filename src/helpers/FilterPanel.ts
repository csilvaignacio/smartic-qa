import { Page, test, Download } from "@playwright/test";

export class FilterPanel {
  constructor(private page: Page) {}

  async search(): Promise<void> {
    await test.step('FilterPanel: click Buscar y esperar carga', async () => {
      await this.page.getByRole("button", { name: "Buscar" }).dblclick();
    });
  }

  async clean(): Promise<void> {
    await test.step('FilterPanel: click Limpiar', async () => {
      await this.page.getByRole("button", { name: "Limpiar" }).click();
    });
  }

  async export(format: string): Promise<Download> {
    return test.step(`FilterPanel: exportar en formato ${format}`, async () => {
      const [download] = await Promise.all([
        this.page.waitForEvent("download"),
        this.page.getByRole("button", { name: "Exportar" }).click(),
      ]);
      await this.page.locator(".dropdown-item", { hasText: format }).click();
      return download;
    });
  }
}