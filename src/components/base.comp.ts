import { expect, Locator, Page } from "@playwright/test";

/**
 * Base de todos los componentes de UI reutilizables.
 * `contenedor` es el elemento raíz: los locators del componente se anclan a él.
 */
export abstract class BaseComponent {
  constructor(
    protected readonly page: Page,
    protected readonly contenedor: Locator,
  ) {}

  async estaVisible(): Promise<boolean> {
    return await this.contenedor.isVisible();
  }

  async esperarVisible(): Promise<void> {
    await expect(this.contenedor).toBeVisible();
  }
}
