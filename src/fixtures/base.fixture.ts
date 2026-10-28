import { test as base } from "@playwright/test";
import { MenuLateralComponent } from "@components/menu.lateral.comp";
import { MenuUsuarioComponent } from "@components/menu.usuario.comp";
import { InicioPage } from "@pages/inicio.page";
import { LoginPage } from "@pages/login.page";
import { SeleccionEmpresaPage } from "@pages/seleccion.empresa.page";

/**
 * Fixtures compartidas por TODOS los módulos: componentes globales y páginas transversales.
 * Los fixtures de cada módulo extienden de aquí para poder reutilizarlas.
 */
export type BaseFixtures = {
  menuLateral: MenuLateralComponent;
  menuUsuario: MenuUsuarioComponent;
  loginPage: LoginPage;
  seleccionEmpresa: SeleccionEmpresaPage;
  inicioPage: InicioPage;
};

export const test = base.extend<BaseFixtures>({
  menuLateral: async ({ page }, use) => {
    await use(new MenuLateralComponent(page));
  },
  menuUsuario: async ({ page }, use) => {
    await use(new MenuUsuarioComponent(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  seleccionEmpresa: async ({ page }, use) => {
    await use(new SeleccionEmpresaPage(page));
  },
  inicioPage: async ({ page }, use) => {
    await use(new InicioPage(page));
  },
});
