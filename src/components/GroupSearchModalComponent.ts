import { Page, test } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

export class GroupSearchModalComponent extends BaseComponent {
  private readonly searchInput = this.container!.locator('#firstName');
  private readonly searchButton = this.container!.getByRole('button', { name: 'Buscar' });
  private readonly closeButton = this.container!.getByRole('button', { name: 'Cerrar' });

  constructor(page: Page) {
    super(page, page.locator('nb-card-body.overFlowx'));
  }

  async waitForVisible(): Promise<void> {
    await this.container!.waitFor({ state: 'visible' });
  }

  async searchText(query: string): Promise<void> {
    await test.step(`Modal búsqueda grupal: buscar "${query}"`, async () => {
      await this.searchInput.fill(query);
      await this.searchButton.click();
    });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}