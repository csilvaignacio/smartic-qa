import { Download, Locator, Page, test } from "@playwright/test";

/** Ayuda para la botonera de filtros común en listados y reportes (Buscar / Limpiar / Exportar). */
export class PanelFiltros {
  private readonly botonBuscar: Locator;
  private readonly botonLimpiar: Locator;
  private readonly botonExportar: Locator;

  constructor(private readonly page: Page) {
    this.botonBuscar = page.getByRole("button", { name: "Buscar" });
    this.botonLimpiar = page.getByRole("button", { name: "Limpiar" });
    this.botonExportar = page.getByRole("button", { name: "Exportar" });
  }

  async buscar(): Promise<void> {
    await test.step("Panel de filtros: clic en Buscar", async () => {
      await this.botonBuscar.click();
    });
  }

  async limpiar(): Promise<void> {
    await test.step("Panel de filtros: clic en Limpiar", async () => {
      await this.botonLimpiar.click();
    });
  }

  async exportar(formato: string): Promise<Download> {
    return await test.step(`Panel de filtros: exportar en formato ${formato}`, async () => {
      await this.botonExportar.click();
      const [descarga] = await Promise.all([
        this.page.waitForEvent("download"),
        this.page.locator(".dropdown-item", { hasText: formato }).click(),
      ]);
      return descarga;
    });
  }
}
