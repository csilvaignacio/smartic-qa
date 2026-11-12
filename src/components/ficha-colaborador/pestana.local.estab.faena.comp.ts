import { Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";
import { TablaRegistros } from "@helpers/tabla.registros.helper";

/** Posición de cada columna en la tabla de local, establecimiento o faena. */
const COLUMNAS_LOCAL_ESTAB_FAENA = {
  establecimientoFaena: 2,
} as const;

/** Pestaña LOCAL.ESTAB.FAENA de la Ficha Colaborador. */
export class PestanaLocalEstabFaenaComponent extends BaseComponent {
  private readonly tabla: TablaRegistros;

  constructor(page: Page) {
    // Se ancla por un encabezado propio: todas las pestañas usan una <table> sin id
    super(page, page.locator("table").filter({ hasText: "Est. Faena" }));
    this.tabla = new TablaRegistros(this.contenedor);
  }

  /** Establecimiento/Faena del primer registro de la pestaña. */
  async obtenerAsignado(): Promise<string> {
    return await test.step("Obtener el Establecimiento/Faena asignado", async () => {
      if (!(await this.tabla.tieneFilas())) {
        throw new Error("La pestaña LOCAL.ESTAB.FAENA del colaborador no tiene registros");
      }
      return await this.tabla.leerCelda(0, COLUMNAS_LOCAL_ESTAB_FAENA.establecimientoFaena);
    });
  }
}
