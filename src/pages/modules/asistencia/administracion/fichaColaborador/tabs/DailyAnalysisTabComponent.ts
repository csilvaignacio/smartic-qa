import { BaseComponent } from "@components/BaseComponent";
import { FilterPanel } from "@helpers/FilterPanel";
import { expect, Page, test } from '@playwright/test';

export class DailyAnalysisTabComponent extends BaseComponent{
    private readonly dialingDateField = this.page.getByRole('textbox',{name: 'Fecha de Marcación'})
    readonly filterPanel = new FilterPanel(this.page);


    constructor(page: Page){
        super(page, page.locator('nb-card-body'))
    }

    async waitForVisible(): Promise<void> {
        await expect(this.dialingDateField).toBeVisible()
    }

    async enterDate(date: string) {
        await this.dialingDateField.clear();
        await this.dialingDateField.pressSequentially(date, { delay: 100 });
    }

    async hasAtLeastOneMark(): Promise<boolean>{
        return await test.step('Verificar que exista al menos una marca en Analisis Diario', async () =>{
            const table = this.page.locator('table').filter({hasText: 'Fecha Marcación'})
            await expect(table).toBeVisible();
            const noResultsRow = table.getByText('No se encontraron registros.');
            return (await noResultsRow.count()) === 0 ;
        });
    }

    async search(): Promise<void> {
        await test.step('Buscar marcas y esperar respuesta del backend', async () => {
            await Promise.all([
                this.page.waitForResponse(resp => resp.url().includes('/services/transactions') && resp.status() === 200),
                this.filterPanel.search(),
            ]);
        });
    }
}