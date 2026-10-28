import { test as base } from "@fixtures/base.fixture";
import { FichaColaboradorPage } from "@pages/modulos/asistencia/administracion/ficha.colaborador.page";
import { MarcasRechazadasPage } from "@pages/modulos/asistencia/reportes.generales/marcas.rechazadas.page";

export type AsistenciaFixtures = {
  fichaColaborador: FichaColaboradorPage;
  marcasRechazadas: MarcasRechazadasPage;
};

export const test = base.extend<AsistenciaFixtures>({
  fichaColaborador: async ({ page }, use) => {
    await use(new FichaColaboradorPage(page));
  },
  marcasRechazadas: async ({ page }, use) => {
    await use(new MarcasRechazadasPage(page));
  },
});
