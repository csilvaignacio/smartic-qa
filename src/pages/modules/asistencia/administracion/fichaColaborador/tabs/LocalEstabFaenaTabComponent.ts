import { Page } from "@playwright/test";
import { BaseComponent } from "@components/BaseComponent";
import { test } from "@playwright/test";

export class LocalEstabFaenaTabComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator('nb-card-body'));
  }

  async getAssignedEstabFaena(): Promise<string> {
    return await test.step('Obtener valor asignado de Establecimiento/Faena', async () => {
      const table = this.page.locator('table').filter({ hasText: 'Est. Faena' });
      const firstRow = table.locator('tbody tr').first();
      const cell = firstRow.locator('td').nth(2);
      const textValue = await cell.innerText();
      return textValue.trim();
    });
  }
}