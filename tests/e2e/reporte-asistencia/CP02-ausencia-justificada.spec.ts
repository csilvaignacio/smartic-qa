import { MENU_ROUTES } from '@config/menu-routes';
import { test, expect } from '@fixtures';

test.describe('@regression Reporte Asistencia DT - Validación Ausencia Justificada', () => {
  test.skip('Caso feliz: Ausencia Justificada con incidencia Aprobada en Agenda', async ({ attendanceReport, sideMenu, collaboratorProfile }) => {
    await sideMenu.navigateTo(MENU_ROUTES.REPORTE_ASISTENCIA_DT)
  });
});