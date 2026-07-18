import { expect, Page, test , TestInfo} from '@playwright/test';
import { NgSelect } from '@helpers/NgSelect'
import { NbDatepicker } from '@helpers/NbDatepicker';
import { BaseReportDTPage } from '@pages/modules/reportesDT/BaseReportPage';


export class AttendanceReportPage extends BaseReportDTPage {

  // Filtros propios del reporte
  private readonly rutSelect = new NgSelect(this.page, "identification");
  private readonly startDate = new NbDatepicker(this.page, "startDate");
  private readonly endDate = new NbDatepicker(this.page, "endDate");
  private readonly groupSearchLink = this.page.getByRole('paragraph',{name: 'Búsqueda grupal'})

  

  constructor(page: Page, public readonly testInfo: TestInfo) {
    super(page);
  }

  async waitForVisible(): Promise<void> {
    await test.step('Esperando a que el reporte de asistencia esté listo', async () => {
      await super.waitForIdle();
    });
  }

  async enterGroupSearchRut(rut: string | number): Promise<void> {
    await test.step(`Ingresando RUT ${rut}`, async () => {
      await this.groupSearchLink.click();
    });
  }

  async selectStartDate(date: string): Promise<void> {
    await test.step(`Ingresando fecha inicio ${date}`, async () => {
      await this.startDate.setDate(date);
    });
  }

  async selectEndDate(date: string): Promise<void> {
    await test.step(`Ingresando fecha término ${date}`, async () => {
      await this.endDate.setDate(date);
    });
  }
  
  async waitForResults(): Promise<void> {
    await test.step('Esperando a que cargue la tabla de resultados', async () => {
      const nameEst = this.page.locator('td b').filter({ hasText: 'Local, establecimiento' }).first();
      await expect(nameEst).toBeVisible();
    });
  }

  async getEstabFaena(): Promise<string> {
    return await test.step('Obteniendo el valor de Establecimiento/Faena', async () => {
      const elemento = this.page.locator('td b').filter({ hasText: 'Local, establecimiento' }).first();
      const textoCompleto = await elemento.innerText();
      const partes = textoCompleto.split(':');

      if (partes.length > 1) {
        return partes[1].trim(); 
      }
      return textoCompleto.trim(); 
    });
  }

  async getAusenciaForFirstAsistenciaSi(): Promise<string> {
      return await test.step('Obtener Ausencia de la primera fila con Asistencia "Si"', async () => {
          await expect(this.page.locator('table')).toBeVisible();
          
          const allRows = this.page.locator('table tbody tr');
          const attendanceColumnIndex  = 1; 
          const absenceColumnIndex  = 2;
          
          const targetRow = allRows
              .filter({ has: this.page.locator('td').nth(attendanceColumnIndex).filter({ hasText: 'SI' }) })
              .first(); 
          if (await targetRow.count() === 0) {
              throw new Error("No se encontró ninguna fila en toda la tabla donde la Asistencia sea 'Si'.");
          }
          const absenceCell  = targetRow.locator('td').nth(absenceColumnIndex);
          
          const absenceValue  = await absenceCell .innerText();
          return absenceValue.trim().toLowerCase();
      });
  }
}
