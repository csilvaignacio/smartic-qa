import { Page, Locator, expect } from "@playwright/test";

export class NgSelect {
  private container: Locator;
  
  constructor(private page: Page, private readonly id: string) {
    this.container = page.locator(`ng-select[id="${id}"]`);
  }

  async selectByText(text: string | number): Promise<void> {
    await this.container.click();
    await this.container.locator("input").fill(text.toString());
    const option = this.page.locator(".ng-option");
    try{
      expect(option).toBeVisible();
      await option.first().click();
    }catch{
      throw new Error(`NgSelect [${this.id}]: no se encontró ninguna opción visible después de escribir "${text}`);
    }
  }

  async selectedText(): Promise<string> {
    try{
      return (await this.container.locator(".ng-value-label").innerText()).trim();
    }catch{
      throw new Error(`ngSelect [${this.id}] no se encontro texto visible`)
    }
  
  }

  async clear(): Promise<void> {
    try{
      await this.container.locator(".ng-clear-wrapper").click();
    }catch{
      throw new Error(`NgSelect [${this.id}] no se pudo limpiar correctamente`)
    }
  }
}