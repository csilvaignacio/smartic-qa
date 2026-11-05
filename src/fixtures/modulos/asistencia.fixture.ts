import { test as base } from "@fixtures/base.fixture";
import { CalendariosPage } from "@pages/modulos/asistencia/administracion/calendarios.page";
import { FichaColaboradorPage } from "@pages/modulos/asistencia/administracion/ficha.colaborador.page";
import { MarcasRechazadasPage } from "@pages/modulos/asistencia/reportes.generales/marcas.rechazadas.page";

export type AsistenciaFixtures = {
  calendarios: CalendariosPage;
  fichaColaborador: FichaColaboradorPage;
  marcasRechazadas: MarcasRechazadasPage;
};

export const test = base.extend<AsistenciaFixtures>({
  calendarios: async ({ page }, use) => {
    await use(new CalendariosPage(page));
  },
  fichaColaborador: async ({ page }, use) => {
    await use(new FichaColaboradorPage(page));
  },
  marcasRechazadas: async ({ page }, use) => {
    await use(new MarcasRechazadasPage(page));
  },
});
