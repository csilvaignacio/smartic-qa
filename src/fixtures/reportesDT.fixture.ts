import { test as base } from "@playwright/test";
import { AttendanceReportPage } from "@pages/modules/reportesDT/AttendanceReportPage";
import { HomePage } from "@pages/HomePage";
import { SideMenuComponent } from "@components/SideMenuComponent"; 
import { MENU_ROUTES } from "@config/menu-routes"; 
import { CollaboratorProfilePage } from "@pages/modules/asistencia/Administracion/CollaboratorProfilePage";

type ReportesDTFixtures = {
  attendanceReport: AttendanceReportPage;
  sideMenu: SideMenuComponent; 
  collaboratorProfile: CollaboratorProfilePage;
};

export const reportesDTFixtures = base.extend<ReportesDTFixtures>({


  sideMenu: async ({ page }, use) => {
    await use(new SideMenuComponent(page));
  },

  collaboratorProfile: async ({ page }, use) => {
    await use(new CollaboratorProfilePage(page));
  },


  attendanceReport: async ({ page, sideMenu }, use, testInfo) => {
    const homePage = new HomePage(page);
    await homePage.goToBase();    
    await homePage.waitForVisible();
    
    await sideMenu.navigateTo(MENU_ROUTES.REPORTE_ASISTENCIA_DT); 

    await use(new AttendanceReportPage(page, testInfo));
  },

});