import { Page } from "@playwright/test";
import { BaseComponent } from "@components/BaseComponent";
import { test } from "@playwright/test";

export class AgendaTabComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator('nb-card-body'));
  }

  async hasCalendarAnnotation(): Promise<boolean> {
    return await test.step('Verificar existencia de anotación tipo "Calendario" en la tabla Agenda', async () => {
      const table = this.page.locator('table').filter({ hasText: 'Tipo Anotación' });
      const allRows = table.locator('tbody tr');
      const annotationColumnIndex = 2;

      const targetRow = allRows.filter({
        has: this.page.locator('td').nth(annotationColumnIndex).filter({ hasText: 'Calendario' })
      });
      try {
        await targetRow.first().waitFor({ state: 'attached', timeout: 10000 });
        return true;
      } catch (error) {
        return false;
      }
    });
  }
}