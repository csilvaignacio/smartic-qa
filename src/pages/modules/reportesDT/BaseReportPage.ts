import { BasePage } from "@pages/BasePage";
import { FilterPanel } from "@helpers/FilterPanel";
import { Pagination } from "@helpers/Pagination";
import { Page, expect } from "@playwright/test";

export abstract class BaseReportDTPage extends BasePage{
    readonly filterPanel = new FilterPanel(this.page);
    readonly pagination = new Pagination(this.page);
    private readonly reportDTFilterSection = this.page.locator('ngx-filter-report-dt');


    constructor(page: Page){
        super(page)
    }

    async waitUntilReady(): Promise<void> {
        await this.waitForIdle()
        await expect(this.reportDTFilterSection).toBeVisible()
    }

}
