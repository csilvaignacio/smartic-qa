export const RUTAS_MENU = {
  // ---- Módulos Principales (1 Nivel) ----
  INICIO: ["Inicio"],
  DOCUMENTACION: ["Documentación"],
  SELECCION_EMPRESA: ["Selección de empresa"],
  OPERACIONES: ["Operaciones"],
  REPORTES_DT: ["Reportes DT"],
  ASISTENCIA: ["Asistencia"],
  CASINO: ["Casino"],
  MANTENEDOR_AVISOS: ["Mantenedor de avisos"],
  EVENT_TRACKER: ["Event Tracker"],
  MANTENEDOR_DOCUMENTACION: ["Mantenedor de documentación"],

  // ---- Módulo Operaciones (2 Niveles) ----
  OPERACIONES_ORDENES_VENTA: ["Operaciones", "Órdenes de venta"],
  OPERACIONES_HISTORIAL_VENTA: ["Operaciones", "Reporte historial de órdenes de venta"],
  OPERACIONES_CANTIDAD_TRABAJADORES: ["Operaciones", "Reporte de cantidad de trabajadores con marcación"],

  // ---- Módulo Reportes DT (2 Niveles) ----
  REPORTE_ASISTENCIA_DT: ["Reportes DT", "Reporte asistencia"],
  REPORTE_JORNADA_DIARIA_DT: ["Reportes DT", "Reporte jornada diaria"],
  REPORTE_DOMINGOS_FESTIVOS_DT: ["Reportes DT", "Reporte de días domingo y/o días festivos"],
  REPORTE_MODIFICACIONES_TURNOS_DT: ["Reportes DT", "Reporte de modificaciones y/o alteraciones de turnos"],
  REPORTE_DIARIO_DT: ["Reportes DT", "Reporte Diario"],
  REPORTE_ENTIDADES_EMPLEADORAS_DT: ["Reportes DT", "Reporte de entidades empleadoras"],

  // Asistencia -> DVM
  ASISTENCIA_DVM_ALERTAS: ["Asistencia", "DVM", "Alertas"],
  ASISTENCIA_DVM_VISUALIZADOR: ["Asistencia", "DVM", "Visualizador"],
  ASISTENCIA_DVM_CONFIG_ALERTAS: ["Asistencia", "DVM", "Configuración de alertas"],

  // Asistencia -> Administración
  ASISTENCIA_ADMIN_EMPRESA: ["Asistencia", "Administración", "Empresa"],
  ASISTENCIA_ADMIN_CARGOS: ["Asistencia", "Administración", "Cargos"],
  ASISTENCIA_ADMIN_TIPOS_CONTRATO: ["Asistencia", "Administración", "Tipos de contrato"],
  ASISTENCIA_ADMIN_SINDICATO: ["Asistencia", "Administración", "Sindicato"],
  ASISTENCIA_ADMIN_LOCAL_FAENA: ["Asistencia", "Administración", "Local, establecimiento o faena"],
  ASISTENCIA_ADMIN_ORGANIGRAMA: ["Asistencia", "Administración", "Organigrama"],
  ASISTENCIA_ADMIN_PERFILES: ["Asistencia", "Administración", "Administración de perfiles"],
  ASISTENCIA_ADMIN_FICHA_COLABORADOR: ["Asistencia", "Administración", "Ficha colaborador"],
  ASISTENCIA_ADMIN_COLAB_BLOQUEADOS: ["Asistencia", "Administración", "Colaboradores bloqueados"],
  ASISTENCIA_ADMIN_MANTENEDOR_CORREO: ["Asistencia", "Administración", "Mantenedor de correo"],
  ASISTENCIA_ADMIN_CONTADORES: ["Asistencia", "Administración", "Contadores"],
  ASISTENCIA_ADMIN_HORARIOS: ["Asistencia", "Administración", "Horarios"],
  ASISTENCIA_ADMIN_GRUPOS_HORARIOS: ["Asistencia", "Administración", "Grupos de Horarios"],
  ASISTENCIA_ADMIN_CALENDARIOS: ["Asistencia", "Administración", "Calendarios"],
  ASISTENCIA_ADMIN_INCIDENTES: ["Asistencia", "Administración", "Incidentes o justificaciones"],
  ASISTENCIA_ADMIN_ZONAS_MOVIL: ["Asistencia", "Administración", "Zonas de marca móvil"],

  // Asistencia -> Aprobaciones
  ASISTENCIA_APROB_FUERA_ZONA: ["Asistencia", "Aprobaciones", "Marcas fuera de zona"],
  ASISTENCIA_APROB_SOLICITUDES_COLAB: ["Asistencia", "Aprobaciones", "Solicitudes por colaborador"],
  ASISTENCIA_APROB_MIS_SOLICITUDES: ["Asistencia", "Aprobaciones", "Mis solicitudes"],
  ASISTENCIA_APROB_WORKFLOW: ["Asistencia", "Aprobaciones", "Workflow de aprobación"],
  ASISTENCIA_APROB_REVISION_RECHAZADAS: ["Asistencia", "Aprobaciones", "Revisión de marcas rechazadas"],
  ASISTENCIA_APROB_REPORTE_FINAL: ["Asistencia", "Aprobaciones", "Reporte aprobación final"],

  // Asistencia -> Reportes generales

  ASISTENCIA_DIARIO_ASISTENCIA: ["Asistencia", "Reportes generales", "Diario asistencia"],
  ASISTENCIA_MARCAS_RECHAZADAS: ["Asistencia", "Reportes generales", "Revisión de marcas rechazadas"],

  // Asistencia -> Reportes Personalizados
  ASISTENCIA_REPORTES_TEMPLATE: [
    "Asistencia",
    "Reportes Personalizados",
    "Mantenedor de template de reportes",
  ],
  ASISTENCIA_REPORTES_CONSULTA: ["Asistencia", "Reportes Personalizados", "Consulta reportes"],
} as const;
export type RutaMenu = (typeof RUTAS_MENU)[keyof typeof RUTAS_MENU];
