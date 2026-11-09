import { Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";

/** Pestaña LOCAL.ESTAB.FAENA de la Ficha Colaborador. */
export class PestanaLocalEstabFaenaComponent extends BaseComponent {
  protected override readonly contenedor: Locator;

  constructor(page: Page) {
    const contenedor = page.locator("table").filter({ hasText: "Est. Faena" });
    super(page, contenedor);
    this.contenedor = contenedor;
  }

  async obtenerAsignado(): Promise<string> {
    return await test.step("Obtener el Establecimiento/Faena asignado", async () => {
      const celda = this.contenedor.locator("tbody tr").first().locator("td").nth(2);
      return (await celda.innerText()).trim();
    });
  }
}
