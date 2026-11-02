import { expect, Locator, Page, test } from "@playwright/test";
import { BaseModuloPage } from "@pages/base.modulo.page";
import { PanelFiltros } from "@helpers/panel.filtros.util";
import { RUTAS_MENU } from "@config/rutas.menu";
import { PestanaFichaColaborador, TIEMPOS_ESPERA } from "@config/constantes";
import { estaFechaEnRango } from "@utils/fecha.util";

export class FichaColaboradorPage extends BaseModuloPage {
  protected readonly rutaMenu = RUTAS_MENU.ASISTENCIA_ADMIN_FICHA_COLABORADOR;

  readonly panelFiltros: PanelFiltros;
  private readonly contenedor: Locator;
  private readonly campoIdentificador: Locator;
  private readonly botonEditar: Locator;

  constructor(page: Page) {
    super(page);
    this.panelFiltros = new PanelFiltros(page);
    this.contenedor = page.locator("nb-card-body");
    this.campoIdentificador = page.getByRole("textbox", { name: "Identificador" });
    this.botonEditar = page.getByRole("button", { name: "editar" });
  }

  override async esperarVisible(): Promise<void> {
    await test.step("Esperar que la Ficha Colaborador sea visible", async () => {
      await expect(this.contenedor.first()).toBeVisible();
      await expect(this.campoIdentificador).toBeVisible();
    });
  }

  async ingresarIdentificador(identificador: string): Promise<void> {
    await test.step(`Ingresar identificador: ${identificador}`, async () => {
      await this.campoIdentificador.fill(identificador);
    });
  }

  async editarColaborador(): Promise<void> {
    await test.step("Clic en el botón Editar", async () => {
      await this.botonEditar.click();
    });
  }

  /** Atajo: busca al colaborador por identificador y abre su ficha en modo edición. */
  async buscarYEditarColaborador(identificador: string): Promise<void> {
    await this.ingresarIdentificador(identificador);
    await this.panelFiltros.buscar();
    await this.editarColaborador();
  }

  async abrirPestana(nombre: PestanaFichaColaborador): Promise<void> {
    await test.step(`Abrir la pestaña: ${nombre}`, async () => {
      // Coincidencia exacta: "CONTRATO" también calza con el enlace del menú "Tipos de contrato"
      await this.page.getByRole("link", { name: new RegExp(`^${nombre}$`, "i") }).click();
    });
  }

  /** Texto de cada celda de una columna de la tabla (por posición, desde 0). */
  private async leerColumna(tabla: Locator, indiceColumna: number): Promise<string[]> {
    const celdas = await tabla.locator(`tbody tr td:nth-child(${indiceColumna + 1})`).allInnerTexts();
    return celdas.map((celda) => celda.trim());
  }

  /** Espera la primera fila con datos; devuelve `false` si la tabla no tiene registros. */
  private async tieneFilas(tabla: Locator): Promise<boolean> {
    // Mientras carga (o si está vacía) la tabla muestra una fila con este mensaje, que no es un registro
    return await tabla
      .locator("tbody tr")
      .filter({ hasNotText: "No se encontraron registros" })
      .first()
      .waitFor({ state: "visible", timeout: TIEMPOS_ESPERA.busquedaSelector })
      .then(
        () => true,
        () => false,
      );
  }

  // ---- Pestaña CONTRATO ----

  /** Indica si algún contrato del colaborador cubre la fecha (`dd-mm-aaaa`). Sin fecha de término = vigente. */
  async tieneContratoVigente(fecha: string): Promise<boolean> {
    return await test.step(`Verificar si existe un contrato vigente al ${fecha}`, async () => {
      const tabla = this.page.locator("table").filter({ hasText: "Tipo de Contrato" });
      if (!(await this.tieneFilas(tabla))) return false;

      const fechasInicio = await this.leerColumna(tabla, 0);
      const fechasTermino = await this.leerColumna(tabla, 1);
      return fechasInicio.some((inicio, indice) =>
        estaFechaEnRango(fecha, inicio, fechasTermino[indice] ?? ""),
      );
    });
  }

  // ---- Pestaña LOCAL.ESTAB.FAENA ----

  async obtenerEstablecimientoFaenaAsignado(): Promise<string> {
    return await test.step("Obtener el Establecimiento/Faena asignado", async () => {
      const tabla = this.page.locator("table").filter({ hasText: "Est. Faena" });
      const celda = tabla.locator("tbody tr").first().locator("td").nth(2);
      return (await celda.innerText()).trim();
    });
  }

  // ---- Pestaña AGENDA ----

  /** Nombre de la anotación tipo "Calendario" cuya vigencia cubre la fecha (`dd-mm-aaaa`). */
  async obtenerCalendarioVigente(fecha: string): Promise<string> {
    return await test.step(`Obtener el calendario asignado en la Agenda al ${fecha}`, async () => {
      const tabla = this.page.locator("table").filter({ hasText: "Tipo Anotación" });
      if (!(await this.tieneFilas(tabla))) {
        throw new Error("La Agenda del colaborador no tiene registros");
      }

      const fechasInicio = await this.leerColumna(tabla, 0);
      const fechasTermino = await this.leerColumna(tabla, 1);
      const tipos = await this.leerColumna(tabla, 2);
      const anotaciones = await this.leerColumna(tabla, 3);

      const indice = fechasInicio.findIndex(
        (inicio, i) => tipos[i] === "Calendario" && estaFechaEnRango(fecha, inicio, fechasTermino[i] ?? ""),
      );
      const calendario = anotaciones[indice];
      if (!calendario) {
        throw new Error(`La Agenda del colaborador no tiene un calendario vigente al ${fecha}`);
      }
      return calendario;
    });
  }

  async tieneAnotacionCalendario(): Promise<boolean> {
    return await test.step('Verificar si existe una anotación tipo "Calendario" en la Agenda', async () => {
      const tabla = this.page.locator("table").filter({ hasText: "Tipo Anotación" });
      const indiceColumnaAnotacion = 2;

      const filaObjetivo = tabla.locator("tbody tr").filter({
        has: this.page.locator("td").nth(indiceColumnaAnotacion).filter({ hasText: "Calendario" }),
      });
      try {
        await filaObjetivo.first().waitFor({ state: "attached", timeout: 10_000 });
        return true;
      } catch {
        return false;
      }
    });
  }
}
