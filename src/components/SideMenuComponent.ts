import { Page, test, expect } from '@playwright/test';
import { BaseComponent } from "./BaseComponent";


export class SideMenuComponent extends BaseComponent{
    

    constructor(page: Page) {
        super(page,page.locator('nb-menu#menu[tag="menu"]'));
    }
    
    async navigateTo(path: readonly string[]) {
        await test.step(`Navegando a: ${path[path.length - 1]}`, async () => {
            let scope = this.container!;
            for (const menuName of path) {
                const menuItem = scope.locator('li', { has: this.page.locator(`a[title="${menuName}"]`) });
                const menuLink = menuItem.locator(`a[title="${menuName}"]`);

                const isExpanded = await menuLink.getAttribute('aria-expanded');
                if (isExpanded !== 'true') {
                    await menuLink.click();
                }
                scope = menuItem.locator('ul.menu-items');
            }
        });
    }

    async waitForVisible(): Promise<void> {
        await test.step('Esperar que el menú lateral sea visible', async () => {
            await this.container!.waitFor({state: 'visible'});
        });
    }
    
}