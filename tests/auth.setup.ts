import { test as setup } from "@playwright/test";
import { LoginPage } from "@pages/LoginPage";
import { OrganizationPage } from "@pages/OrganizationPage";
import { ENV } from '@config/env'

const ADMIN_STATE = "storage/admin.json";

setup("autenticar y entrar a empresa", async ({ page }) => {
  //Login
  const loginPage = new LoginPage(page);
  await page.goto(ENV.baseURL);
  await loginPage.login(ENV.admin.user, ENV.admin.pass);

  //Seleccionar empresa
  const organizationPage = new OrganizationPage(page);
  await organizationPage.selectCompany(ENV.defaultCompany.name);

  //Guardar sesión
  await page.context().storageState({ path: ADMIN_STATE });
});