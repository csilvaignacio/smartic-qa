import { Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";
import { TablaRegistros } from "@helpers/tabla.registros.helper";
import { estaFechaEnRango } from "@utils/fecha.util";

/** Posición de cada columna en la tabla de la Agenda. */
const COLUMNAS_AGENDA = {
  fechaInicio: 0,
  fechaTermino: 1,
  tipoAnotacion: 2,
  anotacion: 3,
} as const;

const TIPO_ANOTACION_CALENDARIO = "Calendario";

/** Pestaña AGENDA de la Ficha Colaborador. */
export class PestanaAgendaComponent extends BaseComponent {
  private readonly tabla: TablaRegistros;

  constructor(page: Page) {
    // Se ancla por un encabezado propio: todas las pestañas usan una <table> sin id
    super(page, page.locator("table").filter({ hasText: "Tipo Anotación" }));
    this.tabla = new TablaRegistros(this.contenedor);
  }

  /** Nombre de la anotación tipo "Calendario" cuya vigencia cubre la fecha (`dd-mm-aaaa`). */
  async obtenerCalendarioVigente(fecha: string): Promise<string> {
    return await test.step(`Obtener el calendario asignado en la Agenda al ${fecha}`, async () => {
      if (!(await this.tabla.tieneFilas())) {
        throw new Error("La Agenda del colaborador no tiene registros");
      }

      const calendario = await this.leerCalendarioVigente(fecha);
      if (calendario === undefined) {
        throw new Error(`La Agenda del colaborador no tiene un calendario vigente al ${fecha}`);
      }
      return calendario;
    });
  }

  /** Indica si alguna anotación tipo "Calendario" cubre la fecha (`dd-mm-aaaa`). Sin registros = `false`. */
  async tieneCalendarioVigente(fecha: string): Promise<boolean> {
    return await test.step(`Verificar si existe un calendario vigente al ${fecha}`, async () => {
      if (!(await this.tabla.tieneFilas())) return false;
      return (await this.leerCalendarioVigente(fecha)) !== undefined;
    });
  }

  private async leerCalendarioVigente(fecha: string): Promise<string | undefined> {
    const fechasInicio = await this.tabla.leerColumna(COLUMNAS_AGENDA.fechaInicio);
    const fechasTermino = await this.tabla.leerColumna(COLUMNAS_AGENDA.fechaTermino);
    const tipos = await this.tabla.leerColumna(COLUMNAS_AGENDA.tipoAnotacion);
    const anotaciones = await this.tabla.leerColumna(COLUMNAS_AGENDA.anotacion);

    const indice = fechasInicio.findIndex(
      (inicio, i) =>
        tipos[i] === TIPO_ANOTACION_CALENDARIO && estaFechaEnRango(fecha, inicio, fechasTermino[i] ?? ""),
    );
    return anotaciones[indice];
  }
}
