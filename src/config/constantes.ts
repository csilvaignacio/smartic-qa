export const TIEMPOS_ESPERA = {
  reporte: 30_000,
  notificacion: 5_000,
  busquedaSelector: 15_000,
} as const;

/** Archivos donde se guarda la sesión autenticada (storageState). */
export const RUTAS_SESION = {
  admin: "storage/admin.json",
} as const;

/** Nombres de la barra de pestañas de "Ficha Colaborador". */
export const PESTANAS_FICHA_COLABORADOR = {
  DATOS_PERSONALES: "DATOS PERSONALES",
  CONTRATO: "CONTRATO",
  SINDICATO: "SINDICATO",
  JORNADA: "JORNADA",
  MARCACION: "MARCACIÓN",
  ANALISIS_DIARIO: "ANALISIS DIARIO",
  AGENDA: "AGENDA",
  CARGO: "CARGO",
  LOCAL_ESTAB_FAENA: "LOCAL.ESTAB.FAENA",
  ZONA: "ZONA",
  ORGANIGRAMA: "ORGANIGRAMA",
  CASINO: "CASINO",
} as const;

export type PestanaFichaColaborador =
  (typeof PESTANAS_FICHA_COLABORADOR)[keyof typeof PESTANAS_FICHA_COLABORADOR];
