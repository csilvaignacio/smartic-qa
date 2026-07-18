import * as ExcelJS from "exceljs";
import { Download } from "@playwright/test";

export async function readHeaders(download: Download): Promise<string[]> {
  const path = await download.path();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path!);
  const row = wb.worksheets[0].getRow(1);
  return (row.values as string[]).filter(Boolean).map(v => String(v).trim());
}

export async function readRows(download: Download): Promise<string[][]> {
  const path = await download.path();
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path!);
  const rows: string[][] = [];
  wb.worksheets[0].eachRow((row, index) => {
    if (index === 1) return;
    rows.push((row.values as string[]).filter(Boolean).map(v => String(v).trim()));
  });
  return rows;
}