# QA Automation Smartic

Framework de automatización de pruebas E2E para la plataforma Smartic de Vigatec, construido con Playwright y TypeScript.

## Stack técnico

- Playwright — motor de automatización E2E
- TypeScript — lenguaje del framework
- Allure — generación de reportes de resultados


## Estructura del proyecto

Todo el código fuente vive bajo `src/`, organizado por módulo. La convención de nombres se mantiene en dos idiomas según el propósito:

- Carpetas de módulos (`pages/modules/`, `fixtures/`) reflejan literalmente la jerarquía del menú real de Smartic, en español (ej. `asistencia/administracion/fichaColaborador/`), sin traducir.
- Clases y archivos de código (Page Objects, Components, fixtures) van en inglés (ej. `AttendanceReportPage`, `SideMenuComponent`), salvo términos de negocio sin traducción natural que ya usa el propio equipo (ej. `EstabFaena`).
- Archivos de test (`*.spec.ts`) y sus descripciones se mantienen en español, ya que reflejan el lenguaje de negocio y los casos de prueba definidos en el documento de QA de referencia.

```
qa-automation-smartic/
├── src/
│   ├── config/                 # Variables de entorno, rutas de menú, constantes
│   ├── fixtures/                # Fixtures organizados por módulo (mergeTests en index.ts)
│   │   ├── base.fixture.ts      # Fixtures transversales (ej. menú lateral)
│   │   ├── reportesDT/          # Fixtures del módulo Reportes DT
│   │   └── asistencia/          # Fixtures del módulo Asistencia
│   ├── pages/
│   │   ├── BasePage.ts
│   │   └── modules/             # Page Objects organizados por módulo, espejando el menú real
│   ├── components/               # Componentes de UI reutilizables (menú, modales, etc.)
│   ├── helpers/                  # NgSelect, FilterPanel, NbDatepicker, Pagination, screenshots
│   └── utils/                    # RUT, Excel
└── tests/
    ├── auth.setup.ts             # Login y guardado de sesión (storageState)
    └── e2e/                      # Casos de prueba, organizados por módulo
        └── reporte-asistencia/
```

### Páginas con secciones internas (tabs)

Cuando una página tiene múltiples pestañas con lógica propia (ej. Ficha Colaborador), cada pestaña se modela como un Component independiente que hereda de `BaseComponent`, no como parte de la página principal. La página conserva solo lo que le pertenece (búsqueda, edición, cambio de pestaña) y expone una instancia de cada tab como propiedad:

```
src/pages/modules/asistencia/administracion/fichaColaborador/
├── CollaboratorProfilePage.ts
└── tabs/
    ├── AgendaTabComponent.ts
    ├── DailyAnalysisTabComponent.ts
    └── LocalEstabFaenaTabComponent.ts
```

## Casos de prueba actuales

- `CP01-establecimiento-faena.spec.ts` — valida que el dato de Establecimiento/Faena del Reporte de Asistencia coincida con el asignado en la Ficha del Colaborador.
- `CP02-asistencia-colaborador.spec.ts` — valida las reglas de negocio de "Asistencia colaborador": cuando `Asistencia = SI`, la columna Ausencia debe estar vacía, debe existir un calendario asignado en Agenda, y debe existir al menos una marca registrada en Análisis Diario para la fecha correspondiente.

## Instalación

```bash
git clone <url-del-repo>
cd qa-automation-smartic
npm ci
npx playwright install
```

## Configuración de ambiente

Copia el archivo de ejemplo y completa los valores según el ambiente:

```bash
cp .env.example .env.qa
```

Variables requeridas (ver `src/config/env.ts`):

| Variable | Descripción |
|---|---|
| `NODE_ENV` | Ambiente a cargar (`qa`, `dev`) |
| `BASE_URL` | URL base del ambiente Smartic a probar |
| `QA_EMAIL` / `QA_PASSWORD` | Credenciales de la cuenta de pruebas |
| `QA_COMPANY` | Nombre de la empresa a seleccionar tras el login |
| `QA_RUT_PRUEBA1` | RUT de un colaborador de prueba con datos configurados |

## Ejecutar los tests

```bash
# Suite completa, headless, contra QA
npm run test:qa

# Suite completa, con navegador visible
npm run test:headedqa

# Un archivo específico
npx playwright test tests/e2e/reporte-asistencia/CP01-establecimiento-faena.spec.ts --headed --workers=1

# Filtrando por nombre de test
npx playwright test -g "nombre del test" --headed --workers=1
```

`--workers=1` fuerza que los tests corran de a uno, útil para seguir la ejecución paso a paso en modo headed. Por defecto, fuera de CI, Playwright decide automáticamente cuántos workers usar según los núcleos disponibles.

## Reportes

```bash
npm run allure:report
```

Genera y abre el reporte de Allure con el detalle de cada `test.step`, capturas de pantalla en fallas, y video de la ejecución.

## Convenciones al agregar trabajo nuevo

### Nuevo reporte dentro de un módulo existente

1. Crear el Page Object en `src/pages/modules/<modulo>/`, heredando de `BaseReportPage` si corresponde.
2. Si el módulo ya tiene un archivo de fixtures, agregar el fixture ahí; si no, crear `src/fixtures/<modulo>/<nombre>.fixture.ts`.
3. Registrar el fixture en `src/fixtures/index.ts` mediante `mergeTests`.
4. Crear el test en `tests/e2e/<modulo>/`, con nombre y descripción en español, siguiendo la convención `CPxx-nombre-de-la-regla.spec.ts`.

### Página con pestañas propias

Seguir el patrón descrito en "Páginas con secciones internas" — un Component por pestaña, dentro de una carpeta `tabs/` anidada bajo la carpeta de la página, no bajo el módulo padre.

## Estado del pipeline de CI

El workflow de GitHub Actions (`.github/workflows/playwright.yml`) está definido pero aún no tiene configuradas las credenciales de `.env.qa` como secrets del repositorio, por lo que las ejecuciones automáticas en pull requests fallarán hasta que se complete esa configuración.
