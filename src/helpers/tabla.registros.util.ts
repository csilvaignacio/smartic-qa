import { Locator } from "@playwright/test";
import { TIEMPOS_ESPERA } from "@config/constantes";

/** Ayuda para leer los registros de una tabla HTML (por posición de columna, desde 0). */
export class TablaRegistros {
  constructor(private readonly tabla: Locator) {}

  /** Texto de cada celda de una columna. */
  async leerColumna(indiceColumna: number): Promise<string[]> {
    const celdas = await this.tabla.locator(`tbody tr td:nth-child(${indiceColumna + 1})`).allInnerTexts();
    return celdas.map((celda) => celda.trim());
  }

  /** Espera la primera fila con datos; devuelve `false` si la tabla no tiene registros. */
  async tieneFilas(): Promise<boolean> {
    // Mientras carga (o si está vacía) la tabla muestra una fila con este mensaje, que no es un registro
    return await this.tabla
      .locator("tbody tr")
      .filter({ hasNotText: "No se encontraron registros" })
      .first()
      .waitFor({ state: "visible", timeout: TIEMPOS_ESPERA.busquedaSelector })
      .then(
        () => true,
        () => false,
      );
  }
}
