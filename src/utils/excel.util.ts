import * as ExcelJS from "exceljs";
import { Download } from "@playwright/test";

async function abrirPrimeraHoja(descarga: Download): Promise<ExcelJS.Worksheet> {
  const ruta = await descarga.path();
  const libro = new ExcelJS.Workbook();
  await libro.xlsx.readFile(ruta);
  const hoja = libro.worksheets[0];
  if (!hoja) throw new Error(`El archivo descargado '${descarga.suggestedFilename()}' no tiene hojas`);
  return hoja;
}

/** Texto de cada celda con valor (omite celdas vacías). `celda.text` resuelve fórmulas y texto enriquecido. */
function valoresFila(fila: ExcelJS.Row): string[] {
  const valores: string[] = [];
  fila.eachCell((celda) => {
    const texto = celda.text.trim();
    if (texto) valores.push(texto);
  });
  return valores;
}

/** Lee la fila 1 (encabezados) de la primera hoja del Excel descargado. */
export async function leerEncabezados(descarga: Download): Promise<string[]> {
  const hoja = await abrirPrimeraHoja(descarga);
  return valoresFila(hoja.getRow(1));
}

/** Lee todas las filas de datos (sin encabezado) de la primera hoja del Excel descargado. */
export async function leerFilas(descarga: Download): Promise<string[][]> {
  const hoja = await abrirPrimeraHoja(descarga);
  const filas: string[][] = [];
  hoja.eachRow((fila, indice) => {
    if (indice === 1) return;
    filas.push(valoresFila(fila));
  });
  return filas;
}
