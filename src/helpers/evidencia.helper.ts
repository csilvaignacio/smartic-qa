import { Page, TestInfo } from "@playwright/test";

/** Adjunta una captura de pantalla al reporte (Playwright HTML y Allure). */
export async function adjuntarCaptura(page: Page, testInfo: TestInfo, etiqueta: string): Promise<void> {
  const captura = await page.screenshot({ fullPage: true });
  await testInfo.attach(etiqueta, { body: captura, contentType: "image/png" });
}
