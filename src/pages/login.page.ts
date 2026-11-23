import { expect, Locator, Page, test } from "@playwright/test";
import { BasePage } from "@pages/base.page";
import { RUTAS_API } from "@config/rutas";

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

  /** Inicia sesión y espera la respuesta del backend: si el login falla, el error dice su estado HTTP. */
  async iniciarSesion(usuario: string, clave: string): Promise<void> {
    await test.step(`Iniciar sesión con usuario ${usuario}`, async () => {
      await this.campoUsuario.fill(usuario);
      await this.campoClave.fill(clave);

      const promesaRespuesta = this.page.waitForResponse(
        (respuesta) =>
          respuesta.url().includes(RUTAS_API.auth.login) && respuesta.request().method() === "POST",
      );
      await this.botonEntrar.click();
      const respuestaLogin = await promesaRespuesta;

      if (!respuestaLogin.ok()) {
        throw new Error(
          `El login respondió con estado ${respuestaLogin.status()}: revisa las credenciales QA_EMAIL y QA_PASSWORD`,
        );
      }
    });
  }
}
