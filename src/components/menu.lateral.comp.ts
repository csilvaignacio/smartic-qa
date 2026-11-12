import { expect, Locator, Page, test } from "@playwright/test";
import { BaseComponent } from "@components/base.comp";
import { TIEMPOS_ESPERA } from "@config/constantes";

export class MenuLateralComponent extends BaseComponent {
  constructor(page: Page) {
    super(page, page.locator('nb-menu#menu[tag="menu"]'));
  }

  /** Navega por el menú expandiendo cada nivel. Ej: `['Reportes DT', 'Reporte asistencia']`. */
  async navegarA(ruta: readonly string[]): Promise<void> {
    await test.step(`Navegar por el menú lateral: ${ruta.join(" > ")}`, async () => {
      let nivel = this.contenedor;

      for (const [indice, nombreMenu] of ruta.entries()) {
        const enlace = this.enlaceDelNivel(nivel, nombreMenu);
        const esUltimoNivel = indice === ruta.length - 1;

        if (esUltimoNivel) {
          await enlace.click();
          return;
        }
        await this.expandir(enlace);
        nivel = this.itemDelNivel(nivel, nombreMenu).locator("ul.menu-items");
      }
    });
  }

  /** `li` del menú que contiene el enlace; `first()` porque hay grupos con un hijo del mismo nombre ("Carga masiva"). */
  private itemDelNivel(nivel: Locator, nombreMenu: string): Locator {
    return nivel
      .locator("li")
      .filter({ has: this.enlacePorNombre(nombreMenu) })
      .first();
  }

  private enlaceDelNivel(nivel: Locator, nombreMenu: string): Locator {
    return this.itemDelNivel(nivel, nombreMenu).getByRole("link", { name: nombreMenu, exact: true }).first();
  }

  private enlacePorNombre(nombreMenu: string): Locator {
    return this.page.getByRole("link", { name: nombreMenu, exact: true });
  }

  /**
   * Abre un grupo del menú solo si está cerrado y espera a que quede `aria-expanded="true"`.
   * Cada intento espera largo: con el equipo cargado la página demora en reaccionar, y repetir el clic
   * demasiado pronto alterna el grupo (abre y vuelve a cerrar). Solo se reintenta si de verdad no abrió.
   */
  private async expandir(enlace: Locator): Promise<void> {
    await expect(async () => {
      if ((await enlace.getAttribute("aria-expanded")) !== "true") {
        await enlace.click();
      }
      await expect(enlace).toHaveAttribute("aria-expanded", "true", {
        timeout: TIEMPOS_ESPERA.busquedaSelector,
      });
    }).toPass({ timeout: TIEMPOS_ESPERA.cargaEdicion });
  }
}
