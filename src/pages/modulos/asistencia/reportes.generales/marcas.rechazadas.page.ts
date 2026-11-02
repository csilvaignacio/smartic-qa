import { TIEMPOS_ESPERA } from "@config/constantes";
import { RUTAS_MENU } from "@config/rutas.menu";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { expect, Locator, Page, test } from "@playwright/test";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { SelectorFecha } from "@helpers/selector.fecha.util";
import { BusquedaGrupalComponent } from "@components/busqueda.grupal.comp";

/** Posición de cada columna en la tabla del reporte. */
const COLUMNAS_REPORTE = {
  fechaMarca: 3,
  identificador: 6,
  motivoRechazo: 9,
} as const;

export type MarcaRechazada = {
  identificador: string;
  /** Fecha de la marca con formato `dd-mm-aaaa`. */
  fechaMarca: string;
  /** Hora de la marca con formato `hh:mm:ss`. */
  horaMarca: string;
  motivoRechazo: string;
};

export class MarcasRechazadasPage extends BaseModuloPage {
  protected override rutaMenu = RUTAS_MENU.ASISTENCIA_MARCAS_RECHAZADAS;

  private readonly contenedor: Locator;
  readonly panelFiltros: PanelFiltros;
  readonly busquedaGrupal: BusquedaGrupalComponent;
  private readonly campoFechaInicio: SelectorFecha;
  private readonly campoFechaFin: SelectorFecha;
  private readonly enlaceBusquedaGrupal: Locator;
  private readonly tablaResultados: Locator;

  constructor(page: Page) {
    super(page);
    this.contenedor = page.locator("ngx-transaction-reject");
    this.panelFiltros = new PanelFiltros(page);
    this.busquedaGrupal = new BusquedaGrupalComponent(page);
    this.campoFechaInicio = new SelectorFecha(page, "startDate");
    this.campoFechaFin = new SelectorFecha(page, "endDate");
    this.enlaceBusquedaGrupal = page.getByText("Búsqueda grupal", { exact: true });
    this.tablaResultados = this.contenedor.locator("table");
  }

  /** Fila de la tabla de resultados que corresponde al colaborador con ese identificador. */
  private filaDelColaborador(identificador: string): Locator {
    return this.tablaResultados.locator("tbody tr").filter({ hasText: identificador });
  }

  async abrirBusquedaGrupal(): Promise<void> {
    await this.enlaceBusquedaGrupal.click();
  }

  async seleccionarRangoFechas(fechaInicio: string, fechaFin: string): Promise<void> {
    await this.campoFechaInicio.ingresarFecha(fechaInicio);
    await this.campoFechaFin.ingresarFecha(fechaFin);
    await this.contenedor.click();
  }

  async validarMarcaRechazada(identificador: string): Promise<void> {
    await test.step(`Validar que exista una marca rechazada del colaborador ${identificador}`, async () => {
      await expect(this.filaDelColaborador(identificador).first()).toBeVisible();
    });
  }

  async obtenerMotivoRechazo(identificador: string): Promise<string> {
    return await test.step(`Obtener el motivo de rechazo del colaborador ${identificador}`, async () => {
      const celda = this.filaDelColaborador(identificador)
        .first()
        .locator("td")
        .nth(COLUMNAS_REPORTE.motivoRechazo);
      return (await celda.innerText()).trim();
    });
  }

  /** Lee la primera marca del reporte cuyo motivo de rechazo coincide con el indicado. */
  async obtenerMarcaRechazadaPorMotivo(motivoRechazo: string): Promise<MarcaRechazada> {
    return await test.step(`Obtener la primera marca rechazada con motivo '${motivoRechazo}'`, async () => {
      const fila = this.tablaResultados
        .locator("tbody tr")
        .filter({
          has: this.page.locator("td").nth(COLUMNAS_REPORTE.motivoRechazo).filter({ hasText: motivoRechazo }),
        })
        .first();

      const hayFila = await fila.waitFor({ state: "visible", timeout: TIEMPOS_ESPERA.reporte }).then(
        () => true,
        () => false,
      );
      if (!hayFila) {
        throw new Error(
          `El reporte no tiene marcas rechazadas con motivo '${motivoRechazo}' en el rango buscado`,
        );
      }

      const celdas = fila.locator("td");
      const [fechaMarca, horaMarca] = (await celdas.nth(COLUMNAS_REPORTE.fechaMarca).innerText())
        .trim()
        .split(" ");
      if (!fechaMarca || !horaMarca) {
        throw new Error(`La fecha de la marca no tiene el formato 'dd-mm-aaaa hh:mm:ss'`);
      }

      return {
        identificador: (await celdas.nth(COLUMNAS_REPORTE.identificador).innerText()).trim(),
        fechaMarca,
        horaMarca,
        motivoRechazo,
      };
    });
  }
}
