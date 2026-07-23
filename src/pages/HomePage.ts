import { BasePage } from "@pages/BasePage";
import { Page, test, expect } from "@playwright/test";   
import { ENV } from '@config/env'
import { SideMenuComponent } from "@components/SideMenuComponent";
import { UserMenuComponent } from "@components/UserMenuComponent";


export class HomePage extends BasePage {
    
    public readonly sideMenu = new SideMenuComponent(this.page);
    private readonly userMenu = new UserMenuComponent(this.page);
    private readonly welcomeMessage = this.page.locator('nb-card-body h4');
    private readonly dashboardSection = this.page.locator('ngx-app-dashboard')

    constructor(page: Page) {
        super(page);
    }       

    async waitForVisible(): Promise<void> {
        await expect(this.welcomeMessage).toBeVisible();
        await expect(this.dashboardSection).toBeVisible();
    }

    async goToBase(): Promise<void> {
        await test.step(`Navegando a la url: ${ENV.baseURL}`, async () =>{
            await Promise.all([
                this.page.goto(ENV.baseURL),
                this.waitForIdle(),
            ]);
        })
    }

}