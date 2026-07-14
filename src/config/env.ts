// src/config/env.ts
import * as dotenv from "dotenv";

const env = process.env.NODE_ENV ?? "qa";
dotenv.config({ path: `.env.${env}` });

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno: ${name}`);
  return value;
}

export const ENV = {
  baseURL: required("BASE_URL"),
  admin: {
    user: required("QA_EMAIL"),
    pass: required("QA_PASSWORD"),
  },
  defaultCompany: {
    name: required("QA_COMPANY"),
  },
  ruts: {
    rutTest: required("QA_RUT_PRUEBA1"),
  }
} as const;