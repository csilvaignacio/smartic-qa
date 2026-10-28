import { expect, Locator, Page, test } from "@playwright/test";
import { BasePage } from "@pages/base.page";
import { MenuLateralComponent } from "@components/menu.lateral.comp";
import { MenuUsuarioComponent } from "@components/menu.usuario.comp";
import { ENTORNO } from "@config/entorno";

export class InicioPage extends BasePage {
  readonly menuLateral: MenuLateralComponent;
  readonly menuUsuario: MenuUsuarioComponent;
  private readonly mensajeBienvenida: Locator;
  private readonly seccionDashboard: Locator;

  constructor(page: Page) {
    super(page);
    this.menuLateral = new MenuLateralComponent(page);
    this.menuUsuario = new MenuUsuarioComponent(page);
    this.mensajeBienvenida = page.locator("nb-card-body h4");
    this.seccionDashboard = page.locator("ngx-app-dashboard");
  }

  override async esperarVisible(): Promise<void> {
    await expect(this.mensajeBienvenida).toBeVisible();
    await expect(this.seccionDashboard).toBeVisible();
  }

  async abrir(): Promise<void> {
    await test.step(`Navegar al inicio: ${ENTORNO.urlBase}`, async () => {
      await this.page.goto(ENTORNO.urlBase);
      await this.esperarVisible();
    });
  }
}
