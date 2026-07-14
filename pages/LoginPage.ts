import { test, Page, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';

export class LoginPage extends BasePage{
   
    private readonly usernameInput = this.page.getByRole('textbox', { name: 'Identificación:' });
    private readonly passwordInput = this.page.getByLabel('Contraseña');
    private readonly loginButtton = this.page.getByRole('button',{name: 'Entrar'});

    constructor(page: Page){
        super(page)

    }

    async waitForVisible(): Promise<void> {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }

    async login(username: string, password: string){
        await test.step(`Ingresando con usuario ${username}`, async () => {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButtton.click();
        })
    }

}
