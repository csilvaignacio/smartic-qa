export const TIEMPOS_ESPERA = {
  /** Respuesta del backend en reportes pesados: en QA la misma consulta varía entre 3 s y más de 80 s. */
  reporte: 120_000,
  /** Apertura de una edición (ficha, calendario, horario): con la suite en paralelo el backend supera los 10 s. */
  cargaEdicion: 30_000,
  /** Carga de listas, tablas y opciones que dependen de una búsqueda. */
  busquedaSelector: 15_000,
  /** Cada intento dentro de un `toPass`: corto para reintentar rápido. */
  intentoCorto: 3_000,
} as const;

/** Archivos donde se guarda la sesión autenticada (storageState). */
export const RUTAS_SESION = {
  admin: "storage/admin.json",
} as const;

/** Fragmentos de las URL del backend que se esperan tras una búsqueda. */
export const RUTAS_API = {
  marcasRechazadas: "/report/transaction-rejects",
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
