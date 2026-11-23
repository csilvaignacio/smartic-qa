import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { BusquedaGrupalComponent } from "@components/busqueda.grupal.comp";
import { PanelFiltros } from "@helpers/panel.filtros.helper";
import { SelectorFecha } from "@helpers/selector.fecha.helper";
import { TablaRegistros } from "@helpers/tabla.registros.helper";
import { RUTAS_API, RUTAS_MENU } from "@config/rutas";

/** Posición de cada columna en la tabla del reporte. */
const COLUMNAS_REPORTE = {
  fechaMarca: 3,
  identificador: 6,
  motivoRechazo: 9,
} as const;

export type MarcaRechazada = {
  identificador: string;
  fechaMarca: string;
  horaMarca: string;
  motivoRechazo: string;
};

export class MarcasRechazadasPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_MARCAS_RECHAZADAS;

  readonly panelFiltros: PanelFiltros;
  readonly busquedaGrupal: BusquedaGrupalComponent;
  private readonly campoFechaInicio: SelectorFecha;
  private readonly campoFechaFin: SelectorFecha;
  private readonly enlaceBusquedaGrupal: Locator;
  private readonly tablaResultados: Locator;
  private readonly registros: TablaRegistros;

  constructor(page: Page) {
    super(page);
    // Con la ruta del backend, `panelFiltros.buscar()` espera la respuesta (en QA supera el minuto)
    this.panelFiltros = new PanelFiltros(page, RUTAS_API.reportes.marcasRechazadas);
    this.busquedaGrupal = new BusquedaGrupalComponent(page);
    this.campoFechaInicio = new SelectorFecha(page, "startDate");
    this.campoFechaFin = new SelectorFecha(page, "endDate");
    this.enlaceBusquedaGrupal = page.getByText("Búsqueda grupal", { exact: true });
    this.tablaResultados = page.locator("ngx-transaction-reject table");
    this.registros = new TablaRegistros(this.tablaResultados);
  }

  async abrirBusquedaGrupal(): Promise<void> {
    await test.step("Abrir la búsqueda grupal", async () => {
      await this.enlaceBusquedaGrupal.click();
      await this.busquedaGrupal.esperarVisible();
    });
  }

  /** Elige al colaborador desde el panel "Búsqueda grupal". */
  async seleccionarColaborador(identificador: string): Promise<void> {
    await test.step(`Seleccionar el colaborador ${identificador} en la búsqueda grupal`, async () => {
      await this.abrirBusquedaGrupal();
      await this.busquedaGrupal.buscar(identificador);
      await this.busquedaGrupal.seleccionarColaborador();
      await this.busquedaGrupal.cerrar();
    });
  }

  async ingresarFechaInicio(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de inicio ${fecha}`, async () => {
      await this.campoFechaInicio.ingresarFecha(fecha);
    });
  }

  async ingresarFechaFin(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de fin ${fecha}`, async () => {
      await this.campoFechaFin.ingresarFecha(fecha);
    });
  }

  /** Atajo: elige al colaborador y el rango de fechas. No pulsa Buscar: eso lo hace el spec. */
  async filtrarPorColaboradorYFechas(
    identificador: string,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<void> {
    await test.step(`Filtrar por el colaborador ${identificador} entre ${fechaInicio} y ${fechaFin}`, async () => {
      await this.seleccionarColaborador(identificador);
      await this.ingresarFechaInicio(fechaInicio);
      await this.ingresarFechaFin(fechaFin);
    });
  }

  async validarMarcaRechazada(identificador: string): Promise<void> {
    await test.step(`Validar que exista una marca rechazada del colaborador ${identificador}`, async () => {
      await expect(
        this.filaDelColaborador(identificador).first(),
        `Se esperaba al menos una marca rechazada del colaborador ${identificador} en el reporte`,
      ).toBeVisible();
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

  /** Lee la primera marca del reporte cuyo motivo de rechazo coincide exactamente con el indicado. */
  async obtenerMarcaRechazadaPorMotivo(motivoRechazo: string): Promise<MarcaRechazada> {
    return await test.step(`Obtener la primera marca rechazada con motivo '${motivoRechazo}'`, async () => {
      if (!(await this.registros.tieneFilas())) {
        throw new Error("El reporte de marcas rechazadas no tiene registros en el rango buscado");
      }

      const motivos = await this.registros.leerColumna(COLUMNAS_REPORTE.motivoRechazo);
      const indiceFila = motivos.indexOf(motivoRechazo);
      if (indiceFila === -1) {
        const motivosEncontrados = [...new Set(motivos)].join(", ");
        throw new Error(
          `El reporte no tiene marcas rechazadas con motivo '${motivoRechazo}' en el rango buscado. Motivos encontrados: [${motivosEncontrados}]`,
        );
      }

      const fechaYHora = await this.registros.leerCelda(indiceFila, COLUMNAS_REPORTE.fechaMarca);
      const [fechaMarca, horaMarca] = fechaYHora.split(" ");
      if (!fechaMarca || !horaMarca) {
        throw new Error(`La fecha de la marca '${fechaYHora}' no tiene el formato 'dd-mm-aaaa hh:mm:ss'`);
      }

      return {
        identificador: await this.registros.leerCelda(indiceFila, COLUMNAS_REPORTE.identificador),
        fechaMarca,
        horaMarca,
        motivoRechazo,
      };
    });
  }

  /** Filas del colaborador: se compara la celda completa para no confundir "100101" con "1001010". */
  private filaDelColaborador(identificador: string): Locator {
    return this.tablaResultados
      .locator("tbody tr")
      .filter({ has: this.page.getByRole("cell", { name: identificador, exact: true }) });
  }
}
