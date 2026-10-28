import { expect, Locator, Page, test } from "@playwright/test";
import { BasePage } from "@pages/base.page";

export class LoginPage extends BasePage {
  private readonly campoUsuario: Locator;
  private readonly campoClave: Locator;
  private readonly botonEntrar: Locator;

  constructor(page: Page) {
    super(page);
    this.campoUsuario = page.getByRole("textbox", { name: "Identificación:" });
    this.campoClave = page.getByLabel("Contraseña");
    this.botonEntrar = page.getByRole("button", { name: "Entrar" });
  }

  override async esperarVisible(): Promise<void> {
    await expect(this.campoUsuario).toBeVisible();
    await expect(this.campoClave).toBeVisible();
  }

  async iniciarSesion(usuario: string, clave: string): Promise<void> {
    await test.step(`Iniciar sesión con usuario ${usuario}`, async () => {
      await this.campoUsuario.fill(usuario);
      await this.campoClave.fill(clave);
      await this.botonEntrar.click();
    });
  }
}
