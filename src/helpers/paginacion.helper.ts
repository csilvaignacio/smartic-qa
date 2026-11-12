import { Locator, Page } from "@playwright/test";

/**
 * Ayuda para los botones Siguiente / Anterior de las tablas paginadas.
 * El cambio de página no navega (es una SPA): quien la usa debe esperar el contenido nuevo de su tabla.
 */
export class Paginacion {
  private readonly botonSiguiente: Locator;
  private readonly botonAnterior: Locator;

  constructor(page: Page) {
    this.botonSiguiente = page.getByRole("button", { name: "Siguiente", exact: true });
    this.botonAnterior = page.getByRole("button", { name: "Anterior", exact: true });
  }

  async irAPaginaSiguiente(): Promise<void> {
    if (await this.siguienteDeshabilitado()) {
      throw new Error("Paginación: el botón Siguiente está deshabilitado, no se puede avanzar");
    }
    await this.botonSiguiente.click();
  }

  async irAPaginaAnterior(): Promise<void> {
    if (await this.anteriorDeshabilitado()) {
      throw new Error("Paginación: el botón Anterior está deshabilitado, no se puede retroceder");
    }
    await this.botonAnterior.click();
  }

  async siguienteDeshabilitado(): Promise<boolean> {
    return await this.botonSiguiente.isDisabled();
  }

  async anteriorDeshabilitado(): Promise<boolean> {
    return await this.botonAnterior.isDisabled();
  }
}
