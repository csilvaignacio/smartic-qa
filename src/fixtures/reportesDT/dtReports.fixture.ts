import { AttendanceReportPage } from "@pages/modules/reportesDT/AttendanceReportPage";
import { HomePage } from "@pages/HomePage";
import { MENU_ROUTES } from "@config/menu-routes";
import { baseFixtures } from "../base.fixture";

type DTReportsFixtures = {
  attendanceReport: AttendanceReportPage;
};

export const dtReportsFixtures = baseFixtures.extend<DTReportsFixtures>({
  attendanceReport: async ({ page, sideMenu }, use, testInfo) => {
    const homePage = new HomePage(page);
    await homePage.goToBase();
    await homePage.waitForVisible();

    await sideMenu.navigateTo(MENU_ROUTES.REPORTE_ASISTENCIA_DT);

    await use(new AttendanceReportPage(page, testInfo));
  },
});
