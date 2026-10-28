import { Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";

export class MenuLateralComponent extends BaseComponent {
  protected override readonly contenedor: Locator;

  constructor(page: Page) {
    const contenedor = page.locator('nb-menu#menu[tag="menu"]');
    super(page, contenedor);
    this.contenedor = contenedor;
  }

  /** Navega por el menú expandiendo cada nivel. Ej: `['Reportes DT', 'Reporte asistencia']`. */
  async navegarA(ruta: readonly string[]): Promise<void> {
    await test.step(`Navegando a: ${ruta.join(" > ")}`, async () => {
      let alcance = this.contenedor;
      for (const nombreMenu of ruta) {
        const itemMenu = alcance.locator("li", { has: this.page.locator(`a[title="${nombreMenu}"]`) });
        const enlaceMenu = itemMenu.locator(`a[title="${nombreMenu}"]`);

        const estaExpandido = await enlaceMenu.getAttribute("aria-expanded");
        if (estaExpandido !== "true") {
          await enlaceMenu.click();
        }
        alcance = itemMenu.locator("ul.menu-items");
      }
    });
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que el menú lateral sea visible", async () => {
      await this.contenedor.waitFor({ state: "visible" });
    });
  }
}
