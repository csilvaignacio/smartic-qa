import { Locator, Page } from "@playwright/test";

/**
 * Base de todos los componentes de UI reutilizables.
 * `contenedor` es el elemento raíz del componente (opcional).
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly contenedor?: Locator;

  constructor(page: Page, contenedor?: Locator) {
    this.page = page;
    this.contenedor = contenedor;
  }

  async estaVisible(): Promise<boolean> {
    return this.contenedor ? await this.contenedor.isVisible() : false;
  }

  async esperarVisible(): Promise<void> {
    await this.contenedor?.waitFor({ state: "visible" });
  }
}
