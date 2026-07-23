import { FilterPanel } from "@helpers/FilterPanel";
import { BasePage } from "@pages/BasePage";
import { expect, Page, test } from "@playwright/test";


export class CollaboratorProfilePage extends BasePage{

    private readonly container = this.page.locator('nb-card-body')
    private readonly IdentifierField = this.page.getByRole('textbox',{name:'Identificador'});
    private readonly editButton =  this.page.getByRole('button',{name: 'editar'});
    readonly filterPanel = new FilterPanel(this.page);


    constructor(page: Page){
        super(page)
    }

    async waitForVisible(): Promise<void> {
        await test.step('Esperar que la vista de perfil de colaborador sea visible', async () => {
            await expect(this.container).toBeVisible();
            await expect(this.IdentifierField).toBeVisible();
        });
    }

    async enterIdentifier(number: string): Promise<void>{
        await test.step(`Ingresar identificador: ${number}`, async () => {
            await this.IdentifierField.fill(number);
        });
    }

    async clickEditButton(): Promise<void>{
        await test.step('Hacer clic en el botón de edición', async () => {
            await this.editButton.click();
        });
    }

    async enterTabList(name: string): Promise<void>{
        await test.step(`Ingresar a la pestaña: ${name}`, async () => {
            const nameTabList = this.page.getByRole('link',{name: `${name}`})
            await nameTabList.click();
        });
    }

    // ESTB.FAENA

    async getAssignedEstabFaena(): Promise<string> {
        return await test.step('Obtener valor asignado de Establecimiento/Faena', async () => {
            const table = this.page.locator('table').filter({ hasText: 'Est. Faena' });
            const firstRow = table.locator('tbody tr').first();
            const cell = firstRow.locator('td').nth(2);
            const textValue = await cell.innerText();
            return textValue.trim();
        });
    }

    // AGENDA

    async hasCalendarAnnotation(): Promise<boolean> {
        return await test.step('Verificar existencia de anotación tipo "Calendario" en la tabla Agenda', async () => {
            
            const table = this.page.locator('table').filter({ hasText: 'Tipo Anotación' });
            const allRows = table.locator('tbody tr');
            const annotationColumnIndex = 2;
            
            const targetRow = allRows.filter({ 
                has: this.page.locator('td').nth(annotationColumnIndex).filter({ hasText: 'Calendario' }) 
            });
            try {
                await targetRow.first().waitFor({ state: 'attached', timeout: 10000 });
                return true;
            } catch (error) {
                return false;
            }
            
        });
    }

    // ANALISIS DIARIO

    

}