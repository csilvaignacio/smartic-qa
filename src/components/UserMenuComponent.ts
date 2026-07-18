import { BasePage } from "@pages/BasePage";
import { Page } from "@playwright/test";
import { BaseComponent } from "./BaseComponent";

export class UserMenuComponet extends BaseComponent{
    
    private readonly userMenu = this.container!;
    private readonly btnSetPassword = this.page.getByTitle('Cambiar Contraseña');
    private readonly btnLogout = this.page.getByTitle('Cerrar sesión');

    constructor(page: Page) {
        super(page, page.locator('nb-user'));
    }

    async waitForVisible(): Promise<void> {
        await this.userMenu.waitFor({state: 'visible'});
    }

    async logout(): Promise<void> {
        await this.userMenu.click();
        await this.btnLogout.click();
    }
}