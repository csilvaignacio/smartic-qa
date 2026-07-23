import { Page, Locator } from "@playwright/test";

export class NbDatepicker {
  private input: Locator;

  constructor(private page: Page,private readonly id: string) {
    this.input = page.locator(`input[id="${id}"]`);
  }

  async setDate(date: string): Promise<void> {
    await this.input.fill(date);
    await this.page.locator("nb-card-body").click();
  }

  async getValue(): Promise<string> {
    return (await this.input.inputValue()).trim();
  }

  async clear(): Promise<void> {
    await this.input.clear();
  }
}