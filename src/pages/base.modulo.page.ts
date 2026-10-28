import { Page, test } from "@playwright/test";
import { BasePage } from "@pages/base.page";
import { MenuLateralComponent } from "@components/menu.lateral.comp";
import { ENTORNO } from "@config/entorno";

/**
 * Base de las páginas que se abren desde el menú lateral.
 * Cada página hija declara su `rutaMenu` y obtiene gratis el método `abrir()`.
 */
export abstract class BaseModuloPage extends BasePage {
  readonly menuLateral: MenuLateralComponent;
  protected abstract readonly rutaMenu: readonly string[];

  constructor(page: Page) {
    super(page);
    this.menuLateral = new MenuLateralComponent(page);
  }

  /** Va al inicio, navega por el menú lateral hasta la página y espera que esté lista. */
  async navegar(): Promise<void> {
    await test.step(`Abrir página: ${this.rutaMenu.join(" > ")}`, async () => {
      await this.page.goto(ENTORNO.urlBase);
      await this.menuLateral.esperarVisible();
      await this.menuLateral.navegarA(this.rutaMenu);
      await this.esperarVisible();
    });
  }
}
