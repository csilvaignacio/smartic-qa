import { Locator } from "@playwright/test";
import { TIEMPOS_ESPERA } from "@config/constantes";

// Mientras carga (o si está vacía) la tabla muestra una fila con este mensaje, que no es un registro
const MENSAJE_SIN_REGISTROS = "No se encontraron registros";

/** Ayuda para leer los registros de una tabla HTML (por posición de columna, desde 0). */
export class TablaRegistros {
  private readonly filas: Locator;

  constructor(tabla: Locator) {
    this.filas = tabla.locator("tbody tr").filter({ hasNotText: MENSAJE_SIN_REGISTROS });
  }

  /** Espera la primera fila con datos; devuelve `false` si la tabla no tiene registros. */
  async tieneFilas(): Promise<boolean> {
    try {
      await this.filas.first().waitFor({ state: "visible", timeout: TIEMPOS_ESPERA.busquedaSelector });
      return true;
    } catch {
      return false;
    }
  }

  /** Texto de cada celda de una columna, en el orden de las filas. */
  async leerColumna(indiceColumna: number): Promise<string[]> {
    const celdas = await this.filas.locator(`td:nth-child(${indiceColumna + 1})`).allInnerTexts();
    return celdas.map((celda) => celda.trim());
  }

  /** Texto de una celda; lanza error si la fila o la columna no existen. */
  async leerCelda(indiceFila: number, indiceColumna: number): Promise<string> {
    const valores = await this.leerColumna(indiceColumna);
    const valor = valores[indiceFila];
    if (valor === undefined) {
      throw new Error(
        `La tabla no tiene la celda [fila ${indiceFila}, columna ${indiceColumna}]: solo hay ${valores.length} filas`,
      );
    }
    return valor;
  }
}
