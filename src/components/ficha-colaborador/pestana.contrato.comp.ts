import { Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";
import { TablaRegistros } from "@helpers/tabla.registros.helper";
import { estaFechaEnRango } from "@utils/fecha.util";

/** Posición de cada columna en la tabla de contratos. */
const COLUMNAS_CONTRATO = {
  fechaInicio: 0,
  fechaTermino: 1,
} as const;

/** Pestaña CONTRATO de la Ficha Colaborador. */
export class PestanaContratoComponent extends BaseComponent {
  private readonly tabla: TablaRegistros;

  constructor(page: Page) {
    // Se ancla por un encabezado propio: todas las pestañas usan una <table> sin id
    super(page, page.locator("table").filter({ hasText: "Tipo de Contrato" }));
    this.tabla = new TablaRegistros(this.contenedor);
  }

  /** Indica si algún contrato del colaborador cubre la fecha (`dd-mm-aaaa`). Sin fecha de término = vigente. */
  async tieneVigente(fecha: string): Promise<boolean> {
    return await test.step(`Verificar si existe un contrato vigente al ${fecha}`, async () => {
      if (!(await this.tabla.tieneFilas())) return false;

      const fechasInicio = await this.tabla.leerColumna(COLUMNAS_CONTRATO.fechaInicio);
      const fechasTermino = await this.tabla.leerColumna(COLUMNAS_CONTRATO.fechaTermino);
      return fechasInicio.some((inicio, indice) =>
        estaFechaEnRango(fecha, inicio, fechasTermino[indice] ?? ""),
      );
    });
  }
}
