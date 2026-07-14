import {test, Page, expect} from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class OrganizationPage extends BasePage {
   
    private readonly resultsTable = this.page.getByRole('table');
    private readonly tableRows = this.page.getByRole('row');

    constructor(page: Page) {
        super(page);
    }

    async waitForVisible(): Promise<void> {
        await expect(this.resultsTable).toBeVisible();
    }

    // Selecciona una empresa en especifico
    async selectCompany(companyName: string): Promise<void> {
        await test.step(`Ingresando a empresa ${companyName}`,async()=>{
            await this.tableRows.filter({hasText: companyName})
            .getByRole('gridcell').last().getByRole('button').click();
        })
    }

}
