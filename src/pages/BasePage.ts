import { Page } from '@playwright/test';

export abstract class BasePage {
    protected readonly page: Page;
    

    constructor(page: Page, ) {
        this.page = page;
    }  

    abstract waitForVisible(): Promise<void>;

    async waitForIdle(): Promise<void> {
        await this.page.waitForLoadState('load');
    }

}