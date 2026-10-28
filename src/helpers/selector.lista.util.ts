import { expect, Locator, Page } from "@playwright/test";
import { TIEMPOS_ESPERA } from "@config/constantes";

/** Ayuda para operar el control `ng-select` de Angular (lista desplegable con búsqueda). */
export class SelectorLista {
  private readonly contenedor: Locator;

  constructor(
    private readonly page: Page,
    id: string,
  ) {
    this.contenedor = page.locator(`ng-select[id="${id}"]`);
  }

  /** Escribe el texto y reintenta hasta que quede una sola opción (mitiga búsquedas lentas). */
  async seleccionarPorTexto(texto: string | number): Promise<void> {
    await this.contenedor.click();

    await expect(async () => {
      await this.contenedor.locator("input").fill(texto.toString());
      await expect(this.page.getByRole("option")).toHaveCount(1, { timeout: 3_000 });
    }).toPass({ timeout: TIEMPOS_ESPERA.busquedaSelector });

    await this.page.getByRole("option").first().click();
  }

  async obtenerTextoSeleccionado(): Promise<string> {
    return (await this.contenedor.locator(".ng-value-label").innerText()).trim();
  }

  async limpiar(): Promise<void> {
    await this.contenedor.locator(".ng-clear-wrapper").click();
  }
}
