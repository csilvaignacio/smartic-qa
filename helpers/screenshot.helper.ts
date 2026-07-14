import { Page, TestInfo } from '@playwright/test';

export async function attachScreenshot(page: Page,testInfo: TestInfo,label: string): Promise<void> {
  
    const foto = await page.screenshot();
  await testInfo.attach(label, {
    body: foto,
    contentType: 'image/png',

  });
}