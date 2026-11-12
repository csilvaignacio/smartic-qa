import { Download, Locator, Page, test } from "@playwright/test";
import { TIEMPOS_ESPERA } from "@config/constantes";

/** Ayuda para la botonera de filtros común en listados y reportes (Buscar / Limpiar / Exportar). */
export class PanelFiltros {
  private readonly botonBuscar: Locator;
  private readonly botonLimpiar: Locator;
  private readonly botonExportar: Locator;
  // Clase de Bootstrap del menú de formatos: el dropdown no expone un rol accesible
  private readonly opcionesExportar: Locator;

  /**
   * @param rutaApiBusqueda Fragmento de la URL del backend que responde la búsqueda (ver `RUTAS_API`).
   * Si se indica, `buscar()` espera esa respuesta: úsalo en reportes lentos.
   */
  constructor(
    private readonly page: Page,
    private readonly rutaApiBusqueda?: string,
  ) {
    // `exact`: el panel de búsqueda grupal tiene su propio botón "Buscar"
    this.botonBuscar = page.getByRole("button", { name: "Buscar", exact: true });
    this.botonLimpiar = page.getByRole("button", { name: "Limpiar", exact: true });
    this.botonExportar = page.getByRole("button", { name: "Exportar", exact: true });
    this.opcionesExportar = page.locator(".dropdown-item");
  }

  /** Pulsa Buscar. Si la pantalla declaró su ruta de backend, espera además la respuesta. */
  async buscar(): Promise<void> {
    await test.step("Panel de filtros: clic en Buscar", async () => {
      if (this.rutaApiBusqueda === undefined) {
        await this.botonBuscar.click();
        return;
      }
      await this.buscarYEsperarRespuesta(this.rutaApiBusqueda);
    });
  }

  async limpiar(): Promise<void> {
    await test.step("Panel de filtros: clic en Limpiar", async () => {
      await this.botonLimpiar.click();
    });
  }

  async exportar(formato: string): Promise<Download> {
    return await test.step(`Panel de filtros: exportar en formato ${formato}`, async () => {
      await this.botonExportar.click();
      const [descarga] = await Promise.all([
        this.page.waitForEvent("download"),
        this.opcionesExportar.filter({ hasText: formato }).click(),
      ]);
      return descarga;
    });
  }

  /**
   * Esperar la respuesta evita leer la tabla antes de tiempo o con datos viejos,
   * y un error del servidor se informa como tal en vez de parecer "sin resultados".
   */
  private async buscarYEsperarRespuesta(rutaApi: string): Promise<void> {
    const [respuesta] = await Promise.all([
      this.page.waitForResponse(
        (respuesta) => respuesta.url().includes(rutaApi) && respuesta.request().method() === "GET",
        { timeout: TIEMPOS_ESPERA.reporte },
      ),
      this.botonBuscar.click(),
    ]);
    if (!respuesta.ok()) {
      throw new Error(
        `La búsqueda (${rutaApi}) respondió con estado ${respuesta.status()}: el backend falló, no es un dato de la prueba`,
      );
    }
  }
}
