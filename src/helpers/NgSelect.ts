import { Page, Locator, expect } from "@playwright/test";

export class NgSelect {
  private container: Locator;
  
  constructor(private page: Page, private readonly id: string) {
    this.container = page.locator(`ng-select[id="${this.id}"]`);
  }

  async selectByText(text: string | number): Promise<void> {
    await this.container.click();

    await expect(async () => {
      await this.container.locator("input").fill(text.toString());
      const option = this.page.getByRole('option');
      await expect(option).toHaveCount(1, { timeout: 3000 });
    }).toPass({ timeout: 15000 });

    await this.page.getByRole('option').first().click();
  }

  async selectedText(): Promise<string> {
    return (await this.container.locator(".ng-value-label").innerText()).trim();
  }

  async clear(): Promise<void> {
    await this.container.locator(".ng-clear-wrapper").click();
  }
}