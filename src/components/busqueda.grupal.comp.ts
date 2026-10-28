import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";

export class BusquedaGrupalComp extends BaseComponent {
  protected override readonly contenedor: Locator;

  constructor(page: Page) {
    // El panel se identifica por su título; las clases de Angular (ng-star-inserted) cambian solas
    const contenedor = page.locator("nb-card").filter({
      has: page.locator("nb-card-header", { hasText: "Búsqueda colaboradores" }),
    });
    super(page, contenedor);
    this.contenedor = contenedor;
  }

  override async esperarVisible(): Promise<void> {
    await this.contenedor.waitFor({ state: "visible" });
  }

  /** Escribe el criterio de búsqueda (nombre o identificador del colaborador). */
  async escribirBusqueda(criterio: string): Promise<void> {
    await this.contenedor.locator("#firstName").fill(criterio);
  }

  async seleccionarColaborador(): Promise<void> {
    await this.contenedor.locator(".toggle-switcher").click();
  }

  async buscar(): Promise<void> {
    await this.contenedor.locator("#search").click();
  }

  async cerrarBusquedaGrupal(): Promise<void> {
    await this.contenedor.getByRole("button", { name: "Cerrar" }).click();
  }
}
