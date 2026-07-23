import { Page, Locator } from '@playwright/test';

export abstract class BaseComponent {
    protected readonly page: Page;
    protected readonly container?: Locator;


    constructor(page: Page, container?: Locator) {
        this.page = page;
        this.container = container;
    }

    async isVisible(): Promise<boolean> {
        if (this.container) {
            return await this.container.isVisible();
        }
        return false;
    }

    async waitForVisible(): Promise<void> {
        if (this.container) {
            await this.container.waitFor({ state: 'visible' });
        }
    }
}