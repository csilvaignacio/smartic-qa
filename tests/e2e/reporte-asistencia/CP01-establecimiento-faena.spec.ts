import { ENV } from '@config/env';
import { test, expect } from '@fixtures';
import { MENU_ROUTES } from "@config/menu-routes"; 
import { TAB_LIST_COLLABORATOR_PROFILE } from '@config/constants';

test

test.describe('@regression Reporte Asistencia DT - Validación Establecimiento/Faena', () => {
    test('Caso feliz: dato de Establecimiento/Faena presente y coincide con Ficha Colaborador', async ({ attendanceReport, sideMenu, collaboratorProfile }) => {  
       
      await test.step('Filtrar Reporte de Asistencia por RUT y rango de fechas', async () => {
      await attendanceReport.enterRut(ENV.ruts.rutTest);
      await attendanceReport.selectStartDate('01-04-2026');
      await attendanceReport.selectEndDate('22-04-2026');
      await attendanceReport.filterPanel.search();
      await attendanceReport.waitForResults();
    });

    const estbFaenaEnReporte = await attendanceReport.getEstabFaena();

    await test.step('Validar que el Reporte DT contenga dato de Establecimiento/Faena', () => {
      expect(
        estbFaenaEnReporte,
        'ERROR DE CONFIGURACIÓN: el Reporte DT no tiene dato en Establecimiento/Faena.'
      ).not.toBe('');
    });

    await sideMenu.navigateTo(MENU_ROUTES.ASISTENCIA_ADMIN_FICHA_COLABORADOR);
    await collaboratorProfile.waitForVisible();
    await collaboratorProfile.enterIdentifier(ENV.ruts.rutTest);
    await collaboratorProfile.filterPanel.search();
    await collaboratorProfile.clickEditButton();
    await collaboratorProfile.enterTabList(TAB_LIST_COLLABORATOR_PROFILE.LOCA_ESTAB_FAENA);

    const estbFaenaEnFicha = await collaboratorProfile.getAssignedEstabFaena();

    await test.step('Cruzar datos: Establecimiento de Ficha Colaborador vs Reporte DT', () => {
      expect(
        estbFaenaEnFicha,
        `Inconsistencia: Ficha Colaborador indica '${estbFaenaEnFicha}' pero Reporte DT indica '${estbFaenaEnReporte}'`
      ).toEqual(estbFaenaEnReporte);
    });
        

    });
}); 
