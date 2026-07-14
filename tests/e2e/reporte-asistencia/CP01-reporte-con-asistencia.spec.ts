import { ENV } from '@config/env';
import { test, expect } from '@fixtures';
import { MENU_ROUTES } from "@config/menu-routes"; 
import { TAB_LIST_COLLABORATOR_PROFILE } from '@config/constants';


test.describe('@regression Reporte de Asistencia', () => {
    test('Caso 1: Asistencia válida', async ({ sideMenu , attendanceReport, collaboratorProfile } ) => {  
       
        await attendanceReport.selectStartDate('01-04-2026');
        await attendanceReport.selectEndDate('22-04-2026');
        await attendanceReport.enterRut(ENV.ruts.rutTest);
        await attendanceReport.filterPanel.search();
        await attendanceReport.waitForResults();

        const estbFaenainReport = await attendanceReport.getEstabFaena(); 
        await test.step('Verificar que el reporte DT contenga un Establecimiento/Faena', 
            async () => {expect(estbFaenainReport).not.toBe('');});

        await sideMenu.navigateTo(MENU_ROUTES.ASISTENCIA_ADMIN_FICHA_COLABORADOR);
        await collaboratorProfile.waitForVisible();
        await collaboratorProfile.enterIdentifier(ENV.ruts.rutTest);
        await collaboratorProfile.filterPanel.search();
        await collaboratorProfile.clickEditButton();
        await collaboratorProfile.enterTabList(TAB_LIST_COLLABORATOR_PROFILE.LOCA_ESTAB_FAENA);

        const estbFaenaInProfile = await collaboratorProfile.getAssignedEstabFaena();
        await test.step('Cruzar datos: Establecimiento de Ficha VS Reporte DT', 
            async () => {expect(estbFaenaInProfile).toEqual(estbFaenainReport);});

        await sideMenu.navigateTo(MENU_ROUTES.REPORTE_ASISTENCIA_DT);
        await attendanceReport.enterRut(ENV.ruts.rutTest);
        await attendanceReport.selectStartDate('01-04-2026');
        await attendanceReport.selectEndDate('22-04-2026');
        await attendanceReport.filterPanel.search();

        await test.step('Validar Reglas de Negocio (Paso 12): Ausencia debe estar vacía si hay Asistencia', async () => {
            const absenceValue = await attendanceReport.getAusenciaForFirstAsistenciaSi();
            
            expect(
                absenceValue !== 'justificada' && absenceValue !== 'injustificada', 
                `ERROR DE NEGOCIO (Paso 12): La Asistencia es 'si', pero la Ausencia indica '${absenceValue}'. Es un error.`
            ).toBeTruthy();
            
            expect(
                absenceValue, 
                `ERROR DE NEGOCIO (Paso 12): Si la Asistencia es 'si', la Ausencia DEBE estar vacía, pero contiene el texto: '${absenceValue}'.`
            ).toBe('');
        });

        await sideMenu.navigateTo(MENU_ROUTES.ASISTENCIA_ADMIN_FICHA_COLABORADOR);
        await collaboratorProfile.waitForVisible();
        await collaboratorProfile.enterIdentifier(ENV.ruts.rutTest);
        await collaboratorProfile.filterPanel.search();
        await collaboratorProfile.clickEditButton();
        await collaboratorProfile.enterTabList(TAB_LIST_COLLABORATOR_PROFILE.AGENDA);

        await test.step('Validar Reglas de Negocio (Paso 15): Existencia de anotación Calendario en Agenda', async () => {
            const hasCalendar = await collaboratorProfile.hasCalendarAnnotation();
            expect(
                hasCalendar, 
                `ERROR DE NEGOCIO (Paso 15): Se esperaba encontrar una anotación de tipo 'Calendario' en la pestaña Agenda, pero no existe.`
            ).toBeTruthy();
        });

        await collaboratorProfile.enterTabList(TAB_LIST_COLLABORATOR_PROFILE.ANALISIS_DIARIO);
        

    });
}); 
