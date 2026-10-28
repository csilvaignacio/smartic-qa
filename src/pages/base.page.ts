import { Page } from "@playwright/test";

/**
 * Base de todas las páginas.
 * `esperarVisible` es opcional: por defecto espera la carga. Sobrescríbelo solo si la pantalla
 * necesita una condición propia (p. ej. un elemento que aparece tarde).
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async esperarVisible(): Promise<void> {
    await this.esperarCarga();
  }

  async esperarCarga(): Promise<void> {
    await this.page.waitForLoadState("load");
  }
}
