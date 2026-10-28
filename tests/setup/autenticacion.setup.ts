import { test as setup } from "@fixtures";
import { ENTORNO } from "@config/entorno";
import { RUTAS_SESION } from "@config/constantes";

setup("autenticar y entrar a la empresa", async ({ page, loginPage, seleccionEmpresa, menuLateral }) => {
  await page.goto(ENTORNO.urlBase);
  await loginPage.esperarVisible();
  await loginPage.iniciarSesion(ENTORNO.admin.usuario, ENTORNO.admin.clave);

  await seleccionEmpresa.esperarVisible();
  await seleccionEmpresa.seleccionarEmpresa(ENTORNO.empresaPorDefecto.nombre);
  // Con el menú lateral visible la sesión ya quedó dentro de la empresa
  await menuLateral.esperarVisible();

  await page.context().storageState({ path: RUTAS_SESION.admin });
});
