import { Locator, Page } from "@playwright/test";

/** Ayuda para operar el control `nb-datepicker` de Nebular. Formato de fecha: `dd-mm-aaaa`. */
export class SelectorFecha {
  private readonly campo: Locator;

  constructor(
    readonly page: Page,
    id: string,
  ) {
    this.campo = page.locator(`input[id="${id}"]`);
  }

  async ingresarFecha(fecha: string): Promise<void> {
    await this.campo.fill(fecha);
  }

  async obtenerValor(): Promise<string> {
    return (await this.campo.inputValue()).trim();
  }

  async limpiar(): Promise<void> {
    await this.campo.clear();
  }
}
