import { FilterPanel } from "@helpers/FilterPanel";
import { BasePage } from "@pages/BasePage";
import { Page, expect, test } from "@playwright/test";
import { LocalEstabFaenaTabComponent } from "./tabs/LocalEstabFaenaTabComponent";
import { AgendaTabComponent } from "./tabs/AgendaTabComponent";
import { DailyAnalysisTabComponent } from "./tabs/DailyAnalysisTabComponent";


export class CollaboratorProfilePage extends BasePage {

    private readonly container = this.page.locator('nb-card-body')
    private readonly IdentifierField = this.page.getByRole('textbox', { name: 'Identificador' });
    private readonly editButton = this.page.getByRole('button', { name: 'editar' });
    readonly filterPanel = new FilterPanel(this.page);

    readonly localEstabFaena = new LocalEstabFaenaTabComponent(this.page);
    readonly agenda = new AgendaTabComponent(this.page);
    readonly dailyAnalysis = new DailyAnalysisTabComponent(this.page);

    constructor(page: Page) {
        super(page)
    }

    async waitForVisible(): Promise<void> {
        await test.step('Esperar que la vista de perfil de colaborador sea visible', async () => {
            await expect(this.container).toBeVisible();
            await expect(this.IdentifierField).toBeVisible();
        });
    }

    async enterIdentifier(number: string): Promise<void> {
        await test.step(`Ingresar identificador: ${number}`, async () => {
            await this.IdentifierField.fill(number);
        });
    }

    async clickEditButton(): Promise<void> {
        await test.step('Hacer clic en el botón de edición', async () => {
            await this.editButton.click();
        });
    }

    async enterTabList(name: string): Promise<void> {
        await test.step(`Ingresar a la pestaña: ${name}`, async () => {
            const nameTabList = this.page.getByRole('link', { name: `${name}` })
            await nameTabList.click();
        });
    }

    
}