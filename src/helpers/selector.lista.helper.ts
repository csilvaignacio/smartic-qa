import { expect, Locator, Page } from "@playwright/test";
import { TIEMPOS_ESPERA } from "@config/constantes";

/** Ayuda para operar el control `ng-select` de Angular (lista desplegable con búsqueda). */
export class SelectorLista {
  private readonly contenedor: Locator;
  private readonly campoBusqueda: Locator;
  private readonly opciones: Locator;
  // Clases propias de la librería ng-select (estables, no autogeneradas por Angular)
  private readonly etiquetaSeleccionada: Locator;
  private readonly botonLimpiar: Locator;

  constructor(page: Page, id: string) {
    this.contenedor = page.locator(`ng-select[id="${id}"]`);
    this.campoBusqueda = this.contenedor.locator("input");
    this.opciones = page.getByRole("option");
    this.etiquetaSeleccionada = this.contenedor.locator(".ng-value-label");
    this.botonLimpiar = this.contenedor.locator(".ng-clear-wrapper");
  }

  /** Escribe el texto y reintenta hasta que quede una sola opción (mitiga búsquedas lentas). */
  async seleccionarPorTexto(texto: string | number): Promise<void> {
    await this.contenedor.click();

    await expect(async () => {
      await this.campoBusqueda.fill(texto.toString());
      await expect(this.opciones).toHaveCount(1, { timeout: TIEMPOS_ESPERA.intentoCorto });
    }).toPass({ timeout: TIEMPOS_ESPERA.busquedaSelector });

    await this.opciones.first().click();
  }

  async obtenerTextoSeleccionado(): Promise<string> {
    return (await this.etiquetaSeleccionada.innerText()).trim();
  }

  async limpiar(): Promise<void> {
    await this.botonLimpiar.click();
  }
}
