import { expect, Locator, Page } from "@playwright/test";

/** Ayuda para operar el control `nb-datepicker` de Nebular. Formato de fecha: `dd-mm-aaaa`. */
export class SelectorFecha {
  private readonly campo: Locator;
  private readonly encabezadoPantalla: Locator;

  constructor(page: Page, id: string) {
    this.campo = page.locator(`input[id="${id}"]`);
    // Zona neutra para cerrar el calendario: `Escape` no lo cierra y su overlay tapa el botón Buscar
    this.encabezadoPantalla = page.locator("nb-card-header").first();
  }

  /** Escribe la fecha, cierra el calendario emergente y confirma que el campo quedó con el valor. */
  async ingresarFecha(fecha: string): Promise<void> {
    await this.campo.fill(fecha);
    await this.encabezadoPantalla.click();
    await expect(this.campo).toHaveValue(fecha);
  }

  async obtenerValor(): Promise<string> {
    return (await this.campo.inputValue()).trim();
  }

  async limpiar(): Promise<void> {
    await this.campo.clear();
  }
}
