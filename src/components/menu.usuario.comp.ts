import { Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";

export class MenuUsuarioComponent extends BaseComponent {
  private readonly botonCambiarClave: Locator;
  private readonly botonCerrarSesion: Locator;

  constructor(page: Page) {
    super(page, page.locator("nb-user"));
    this.botonCambiarClave = page.getByTitle("Cambiar Contraseña");
    this.botonCerrarSesion = page.getByTitle("Cerrar sesión");
  }

  async abrirCambioClave(): Promise<void> {
    await test.step("Abrir cambio de contraseña", async () => {
      await this.contenedor.click();
      await this.botonCambiarClave.click();
    });
  }

  async cerrarSesion(): Promise<void> {
    await test.step("Cerrar sesión", async () => {
      await this.contenedor.click();
      await this.botonCerrarSesion.click();
    });
  }
}
