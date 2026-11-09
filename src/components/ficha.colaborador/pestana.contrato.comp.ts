import { Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";
import { TablaRegistros } from "@helpers/tabla.registros.util";
import { estaFechaEnRango } from "@utils/fecha.util";

/** Pestaña CONTRATO de la Ficha Colaborador. */
export class PestanaContratoComponent extends BaseComponent {
  protected override readonly contenedor: Locator;
  private readonly tabla: TablaRegistros;

  constructor(page: Page) {
    const contenedor = page.locator("table").filter({ hasText: "Tipo de Contrato" });
    super(page, contenedor);
    this.contenedor = contenedor;
    this.tabla = new TablaRegistros(contenedor);
  }

  /** Indica si algún contrato del colaborador cubre la fecha (`dd-mm-aaaa`). Sin fecha de término = vigente. */
  async tieneVigente(fecha: string): Promise<boolean> {
    return await test.step(`Verificar si existe un contrato vigente al ${fecha}`, async () => {
      if (!(await this.tabla.tieneFilas())) return false;

      const fechasInicio = await this.tabla.leerColumna(0);
      const fechasTermino = await this.tabla.leerColumna(1);
      return fechasInicio.some((inicio, indice) =>
        estaFechaEnRango(fecha, inicio, fechasTermino[indice] ?? ""),
      );
    });
  }
}
