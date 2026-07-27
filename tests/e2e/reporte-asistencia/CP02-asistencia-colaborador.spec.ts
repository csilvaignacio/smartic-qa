import { TAB_LIST_COLLABORATOR_PROFILE } from '@config/constants';
import { ENV } from '@config/env';
import { MENU_ROUTES } from '@config/menu-routes';
import { test, expect } from '@fixtures';

test.describe('@regression Reporte Asistencia DT - Validación Asistencia Colaborador', () => {
  test('Asistencia SI con Ausencia vacia y calendario asignado', async ({ attendanceReport, sideMenu, collaboratorProfile }) => {
    await attendanceReport.enterRut(ENV.ruts.rutTest);
    await attendanceReport.selectStartDate('01-04-2026');
    await attendanceReport.selectEndDate('22-04-2026');
    await attendanceReport.filterPanel.search();

    const ausencia = await attendanceReport.getAusenciaForFirstAsistencia();
    expect(ausencia,`Ausencia para la fila con Asistencia=SI: '${ausencia}' (se espera vacio)`).toBe('');

    await sideMenu.navigateTo(MENU_ROUTES.ASISTENCIA_ADMIN_FICHA_COLABORADOR);
    await collaboratorProfile.waitForVisible();
    await collaboratorProfile.enterIdentifier(ENV.ruts.rutTest);
    await collaboratorProfile.filterPanel.search();
    await collaboratorProfile.clickEditButton();
    await collaboratorProfile.enterTabList(TAB_LIST_COLLABORATOR_PROFILE.AGENDA);

    const tieneCalendario = await collaboratorProfile.agenda.hasCalendarAnnotation();
    expect(tieneCalendario, 
      `Calendario asignado en Agenda para colaborador con Asistencia=SI: ${tieneCalendario} (se espera true)`).toBe(true);
    
    await collaboratorProfile.enterTabList(TAB_LIST_COLLABORATOR_PROFILE.ANALISIS_DIARIO);
    await collaboratorProfile.dailyAnalysis.waitForVisible();
    await collaboratorProfile.dailyAnalysis.enterDate('06-04-2026');
    await collaboratorProfile.dailyAnalysis.search();
    
    const tieneMarcas = await collaboratorProfile.dailyAnalysis.hasAtLeastOneMark();
    expect(tieneMarcas,'Colaborador debe presentar marcas para periodo seleccionado').toBe(true);
  });

});