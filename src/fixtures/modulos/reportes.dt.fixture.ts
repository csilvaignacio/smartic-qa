import { test as base } from "@fixtures/base.fixture";
import { ReporteAsistenciaPage } from "@pages/modulos/reportes-dt/reporte.asistencia.page";

/** Páginas del módulo "Reportes DT". Agrega aquí cada nuevo reporte del módulo. */
export type ReportesDTFixtures = {
  reporteAsistencia: ReporteAsistenciaPage;
};

export const test = base.extend<ReportesDTFixtures>({
  reporteAsistencia: async ({ page }, use) => {
    await use(new ReporteAsistenciaPage(page));
  },
});
