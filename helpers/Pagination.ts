import { Page } from "@playwright/test";

export class Pagination {
  constructor(private page: Page) {}

  async siguiente(): Promise<void> {
    try{
      const btn = this.page.getByRole("button", { name: "Siguiente" });
      if(await btn.isDisabled()){
        throw new Error("Pagination: el boton siguiente esta deshabilitado, no se puede avanzar a la siguiente pagina");
      }
      await btn.click();
      await this.page.waitForLoadState('domcontentloaded');
    }catch(e){
      throw e;
    }
    
  }

  async anterior(): Promise<void> {
    try{
      const btn = await this.page.getByRole("button", { name: "Anterior" });
      if(await btn.isDisabled()){
        throw new Error("Pagination: el boton anterior esta deshabilitado, no se puede retroceder a la pagina anterior");
      }
      await btn.click();
      await this.page.waitForLoadState('domcontentloaded');
    }catch(e){
      throw e;
    }
  }

  async isNextDisabled(): Promise<boolean> {
    return await this.page
      .getByRole("button", { name: "Siguiente" })
      .isDisabled();
  }

  async isPreviousDisabled(): Promise<boolean> {
    return await this.page
      .getByRole("button", { name: "Anterior" })
      .isDisabled();
  }
}