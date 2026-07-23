import { ENV } from '@config/env';
import { test, expect } from '@fixtures';

test.describe('@regression Reporte Asistencia DT - Validación Asistencia Colaborador', () => {
  test('Asistencia SI con Ausencia vacia', async ({ attendanceReport }) => {
    await attendanceReport.enterRut(ENV.ruts.rutTest);
    await attendanceReport.selectStartDate('01-04-2026');
    await attendanceReport.selectEndDate('22-04-2026');
    await attendanceReport.filterPanel.search();

    const ausencia = await attendanceReport.getAusenciaForFirstAsistencia();

    expect(ausencia,`Se esperaba que Ausencia estuviera vacia cuando Asistencia = SI, pero se encontro: '${ausencia}'`).toBe('');
  });
});