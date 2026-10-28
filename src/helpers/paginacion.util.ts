import { Locator, Page } from "@playwright/test";

/** Ayuda para los botones Siguiente / Anterior de las tablas paginadas. */
export class Paginacion {
  private readonly botonSiguiente: Locator;
  private readonly botonAnterior: Locator;

  constructor(private readonly page: Page) {
    this.botonSiguiente = page.getByRole("button", { name: "Siguiente" });
    this.botonAnterior = page.getByRole("button", { name: "Anterior" });
  }

  async siguiente(): Promise<void> {
    if (await this.botonSiguiente.isDisabled()) {
      throw new Error("Paginación: el botón Siguiente está deshabilitado, no se puede avanzar");
    }
    await this.botonSiguiente.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async anterior(): Promise<void> {
    if (await this.botonAnterior.isDisabled()) {
      throw new Error("Paginación: el botón Anterior está deshabilitado, no se puede retroceder");
    }
    await this.botonAnterior.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async siguienteDeshabilitado(): Promise<boolean> {
    return await this.botonSiguiente.isDisabled();
  }

  async anteriorDeshabilitado(): Promise<boolean> {
    return await this.botonAnterior.isDisabled();
  }
}
