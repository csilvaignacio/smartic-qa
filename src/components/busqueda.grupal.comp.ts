import { Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";

/** Panel "Búsqueda colaboradores" que se abre desde el enlace "Búsqueda grupal" de los reportes. */
export class BusquedaGrupalComponent extends BaseComponent {
  private readonly campoCriterio: Locator;
  private readonly switchColaborador: Locator;
  private readonly botonBuscar: Locator;
  private readonly botonCerrar: Locator;

  constructor(page: Page) {
    // El panel se identifica por su título; las clases de Angular (ng-star-inserted) cambian solas
    super(
      page,
      page.locator("nb-card").filter({
        has: page.locator("nb-card-header", { hasText: "Búsqueda colaboradores" }),
      }),
    );
    this.campoCriterio = this.contenedor.locator("#firstName");
    this.switchColaborador = this.contenedor.locator(".toggle-switcher");
    this.botonBuscar = this.contenedor.locator("#search");
    this.botonCerrar = this.contenedor.getByRole("button", { name: "Cerrar" });
  }

  /** Busca colaboradores por nombre o identificador dentro del panel. */
  async buscar(criterio: string): Promise<void> {
    await test.step(`Búsqueda grupal: buscar '${criterio}'`, async () => {
      await this.campoCriterio.fill(criterio);
      await this.botonBuscar.click();
    });
  }

  async seleccionarColaborador(): Promise<void> {
    await this.switchColaborador.click();
  }

  async cerrar(): Promise<void> {
    await this.botonCerrar.click();
  }
}
