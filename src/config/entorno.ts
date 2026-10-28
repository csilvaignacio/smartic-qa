import * as dotenv from "dotenv";

/**
 * Carga las variables del archivo `.env.<AMBIENTE>` (por defecto `.env.qa`).
 * Ejemplo: `AMBIENTE=dev` carga `.env.dev`.
 */
const ambiente = process.env.AMBIENTE ?? "qa";
dotenv.config({ path: `.env.${ambiente}`, quiet: true });

function obligatoria(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) throw new Error(`Falta la variable de entorno: ${nombre} (ambiente: ${ambiente})`);
  return valor;
}

const urlBase = obligatoria("BASE_URL");

export const ENTORNO = {
  ambiente,
  urlBase,
  urlApi: `${urlBase}/backend/api/v1`,
  admin: {
    usuario: obligatoria("QA_EMAIL"),
    clave: obligatoria("QA_PASSWORD"),
  },
  empresaPorDefecto: {
    nombre: obligatoria("QA_COMPANY"),
  },
  ruts: {
    rutPrueba: obligatoria("QA_RUT_PRUEBA1"),
  },
} as const;
