import { BasePage } from "@pages/BasePage";
import { FilterPanel } from "@helpers/FilterPanel";
import { Pagination } from "@helpers/Pagination";
import { Page, expect, test } from "@playwright/test";
import { GroupSearchModalComponent } from "@components/GroupSearchModalComponent";

export abstract class BaseReportDTPage extends BasePage{
    readonly filterPanel = new FilterPanel(this.page);
    readonly pagination = new Pagination(this.page);
    readonly groupSearchModal = new GroupSearchModalComponent(this.page);
    private readonly reportDTFilterSection = this.page.locator('ngx-filter-report-dt');

    private readonly rutGroupSearchLink = this.reportDTFilterSection
    .locator('div.col-3')
    .filter({ has: this.page.locator('ng-select#identification') })
    .locator('p.advSearch');

  private readonly namesGroupSearchLink = this.reportDTFilterSection
    .locator('div.col-3')
    .filter({ has: this.page.locator('ng-select#fullName') })
    .locator('p.advSearch');
    

    constructor(page: Page){
        super(page)
    }

    async waitUntilReady(): Promise<void> {
        await this.waitForIdle()
        await expect(this.reportDTFilterSection).toBeVisible()
    }

    async filterRutByBatchSearch(rut: string):Promise<void>{
            await test.step(`Filtrando por RUT (búsqueda grupal): ${rut}`, async () => {
            await this.rutGroupSearchLink.click();
            await this.groupSearchModal.searchText(rut);
            await this.groupSearchModal.selectResult(rut);
            await this.groupSearchModal.close();
        });
    }
    

}