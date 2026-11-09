import { Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";
import { TIEMPOS_ESPERA } from "@config/constantes";
import { TablaRegistros } from "@helpers/tabla.registros.util";
import { estaFechaEnRango } from "@utils/fecha.util";

/** Pestaña AGENDA de la Ficha Colaborador. */
export class PestanaAgendaComponent extends BaseComponent {
  protected override readonly contenedor: Locator;
  private readonly tabla: TablaRegistros;

  constructor(page: Page) {
    const contenedor = page.locator("table").filter({ hasText: "Tipo Anotación" });
    super(page, contenedor);
    this.contenedor = contenedor;
    this.tabla = new TablaRegistros(contenedor);
  }

  /** Nombre de la anotación tipo "Calendario" cuya vigencia cubre la fecha (`dd-mm-aaaa`). */
  async obtenerCalendarioVigente(fecha: string): Promise<string> {
    return await test.step(`Obtener el calendario asignado en la Agenda al ${fecha}`, async () => {
      if (!(await this.tabla.tieneFilas())) {
        throw new Error("La Agenda del colaborador no tiene registros");
      }

      const calendario = await this.buscarCalendarioVigente(fecha);
      if (!calendario) {
        throw new Error(`La Agenda del colaborador no tiene un calendario vigente al ${fecha}`);
      }
      return calendario;
    });
  }

  /** Indica si alguna anotación tipo "Calendario" cubre la fecha (`dd-mm-aaaa`). Sin registros = `false`. */
  async tieneCalendarioVigente(fecha: string): Promise<boolean> {
    return await test.step(`Verificar si existe un calendario vigente al ${fecha}`, async () => {
      if (!(await this.tabla.tieneFilas())) return false;
      return (await this.buscarCalendarioVigente(fecha)) !== undefined;
    });
  }

  private async buscarCalendarioVigente(fecha: string): Promise<string | undefined> {
    const fechasInicio = await this.tabla.leerColumna(0);
    const fechasTermino = await this.tabla.leerColumna(1);
    const tipos = await this.tabla.leerColumna(2);
    const anotaciones = await this.tabla.leerColumna(3);

    const indice = fechasInicio.findIndex(
      (inicio, i) => tipos[i] === "Calendario" && estaFechaEnRango(fecha, inicio, fechasTermino[i] ?? ""),
    );
    return anotaciones[indice];
  }

  async tieneAnotacionCalendario(): Promise<boolean> {
    return await test.step('Verificar si existe una anotación tipo "Calendario" en la Agenda', async () => {
      const indiceColumnaAnotacion = 2;

      const filaObjetivo = this.contenedor.locator("tbody tr").filter({
        has: this.page.locator("td").nth(indiceColumnaAnotacion).filter({ hasText: "Calendario" }),
      });
      try {
        await filaObjetivo.first().waitFor({ state: "attached", timeout: TIEMPOS_ESPERA.busquedaSelector });
        return true;
      } catch {
        return false;
      }
    });
  }
}
