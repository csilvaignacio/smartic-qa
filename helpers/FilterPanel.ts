import { Page, test } from "@playwright/test";

export class FilterPanel {
  constructor(private page: Page) {}

  async search(): Promise<void> {
    await test.step('FilterPanel: click Buscar y esperar carga', async () => {
      try {
        await this.page.getByRole("button", { name: "Buscar" }).dblclick();
      } catch {
        throw new Error("FilterPanel: no se pudo realizar la búsqueda, el botón no está disponible");
      }
    });
  }

  async clean(): Promise<void> {
    await test.step('FilterPanel: click Limpiar', async () => {
      try {
        await this.page.getByRole("button", { name: "Limpiar" }).click();
      } catch {
        throw new Error("FilterPanel: no se pudo limpiar los filtros, el botón no está disponible");
      }
    });
  }

  async export(format: string): Promise<import("@playwright/test").Download> {
    return test.step(`FilterPanel: exportar en formato ${format}`, async () => {
      try {
        const [download] = await Promise.all([
          this.page.waitForEvent("download"),
          this.page.getByRole("button", { name: "Exportar" }).click(),
        ]);
        await this.page.locator(".dropdown-item", { hasText: format }).click();
        return download;
      } catch {
        throw new Error(`FilterPanel: no se pudo exportar en formato ${format}`);
      }
    });
  }
}