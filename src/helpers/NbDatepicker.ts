import { Page, Locator } from "@playwright/test";

export class NbDatepicker {
  private input: Locator;

  constructor(private page: Page,private readonly id: string) {
    this.input = page.locator(`input[id="${id}"]`);
  }

  async setDate(date: string): Promise<void> {
    try{
      await this.input.fill(date);
      await this.page.locator("nb-card-body").click(); 
    }catch{
      throw new Error(`NbDatepicker [${this.id}] no pudo ingresar la fecha: ${date}`)
    }
  }

  async getValue(): Promise<string> {
    try{
      return (await this.input.inputValue()).trim();
    }catch{
      throw new Error(`NbDatepicker [${this.id}] no se encontro valor visible`)
    }
  }

  async clear(): Promise<void> {
    try{
      await this.input.clear();
    }catch{
      throw new Error(`NbDatepicker [${this.id}] no se pudo limpiar el campo correctamente`)
    }
  }
}