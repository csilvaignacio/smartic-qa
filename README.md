# QA Automation SMARTIC — Playwright + TypeScript

Framework de automatización de pruebas E2E para la plataforma SMARTIC de Vigatec.

## Stack técnico

- **Playwright** — automatización E2E
- **TypeScript** — lenguaje principal (modo estricto)
- **Allure 3** + reporte HTML de Playwright + JUnit — reportes
- **ESLint** (typescript-eslint + eslint-plugin-playwright) y **Prettier** — calidad de código
- **Husky** + **lint-staged** — validación automática antes de cada commit
- **GitHub Actions** / Azure DevOps (en migración) — CI/CD

## Estructura del proyecto

```
qa-automation-smartic/
├── src/
│   ├── config/                       # Configuración global
│   │   ├── entorno.ts                # ENTORNO: variables de .env.<ambiente>
│   │   ├── constantes.ts             # TIEMPOS_ESPERA, PESTANAS_*
│   │   └── rutas.ts                  # RUTAS_MENU, RUTAS_API, RUTAS_SESION: todas las rutas
│   ├── data/                         # Datos de prueba: un JSON por pantalla, un bloque por caso
│   │   ├── marcas.rechazadas.json
│   │   └── reporte.asistencia.json
│   ├── components/                   # Componentes de UI reutilizables (*.comp.ts)
│   │   ├── base.comp.ts
│   │   ├── menu.lateral.comp.ts
│   │   ├── menu.usuario.comp.ts
│   │   ├── busqueda.grupal.comp.ts
│   │   └── ficha-colaborador/        # Pestañas de la Ficha Colaborador
│   ├── pages/                        # Page Objects (*.page.ts)
│   │   ├── base.page.ts              # Base de todas las páginas
│   │   ├── base.modulo.page.ts       # Base de páginas abiertas desde el menú (navegar())
│   │   ├── login.page.ts
│   │   ├── seleccion.empresa.page.ts
│   │   ├── inicio.page.ts
│   │   └── modulos/
│   │       ├── asistencia/
│   │       │   ├── administracion/       # ficha colaborador, calendarios, horarios
│   │       │   └── reportes-generales/   # marcas rechazadas
│   │       └── reportes-dt/              # base de reportes DT, reporte asistencia
│   ├── fixtures/
│   │   ├── index.ts                  # Punto de entrada único: { test, expect }
│   │   ├── base.fixture.ts           # Fixtures compartidas por todos los módulos
│   │   └── modulos/                  # Un archivo de fixtures por módulo
│   │       ├── asistencia.fixture.ts
│   │       └── reportes.dt.fixture.ts
│   ├── helpers/                      # Clases de ayuda sobre controles de la UI (*.helper.ts)
│   │   ├── selector.lista.helper.ts  # ng-select
│   │   ├── selector.fecha.helper.ts  # nb-datepicker
│   │   ├── panel.filtros.helper.ts   # Buscar / Limpiar / Exportar
│   │   ├── tabla.registros.helper.ts # Lectura de tablas por columna
│   │   └── paginacion.helper.ts      # Siguiente / Anterior
│   └── utils/                        # Funciones puras, sin Playwright (*.util.ts)
│       ├── fecha.util.ts
│       └── texto.util.ts
├── tests/
│   ├── setup/autenticacion.setup.ts  # Login + selección de empresa (guarda la sesión)
│   └── e2e/                          # Specs agrupados igual que src/pages/modulos
│       ├── asistencia/marcas-rechazadas/
│       └── reportes-dt/reporte-asistencia/
├── storage/                          # (generado) sesión autenticada
└── reports/                          # (generado) TODOS los reportes y evidencias
    ├── playwright-report/
    ├── allure-results/
    ├── allure-report/
    ├── junit/
    └── test-results/                 # trazas, videos y capturas
```

## Arquitectura de fixtures

```
@playwright/test
      │
base.fixture.ts            → menuLateral, menuUsuario, loginPage, seleccionEmpresa, inicioPage
      │
      ├── modulos/asistencia.fixture.ts    → calendarios, fichaColaborador, horarios, marcasRechazadas
      └── modulos/reportes.dt.fixture.ts   → reporteAsistencia
                     │
                index.ts (mergeTests)  → test, expect
```

- Cada módulo **extiende `base.fixture.ts`**, así todas las fixtures compartidas están disponibles en cualquier módulo.
- `index.ts` combina todos los módulos con `mergeTests`. Los tests **siempre** importan desde `@fixtures`.
- Las fixtures solo **crean** el Page Object; la navegación la hace el test con `await pagina.navegar()`. Así un test puede usar varias páginas en el orden que necesite.
- El proyecto `setup` inicia sesión una vez y guarda la sesión en `storage/admin.json`; los specs la reutilizan y **no hacen login**.

## Convenciones

| Elemento                        | Convención                                       | Ejemplo                                        |
| ------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| Archivos                        | minúsculas, separados por puntos + sufijo        | `ficha.colaborador.page.ts`                    |
| Sufijos de archivo              | `.page`, `.comp`, `.helper`, `.util`, `.fixture` | `panel.filtros.helper.ts`                      |
| Carpetas                        | kebab-case en español                            | `reportes-dt`, `ficha-colaborador`             |
| Specs                           | `CPnn-descripcion.spec.ts`                       | `CP01-establecimiento-faena.spec.ts`           |
| Clases                          | PascalCase en español + sufijo de tipo           | `FichaColaboradorPage`, `MenuLateralComponent` |
| Métodos / atributos / variables | camelCase en español, verbos en infinitivo       | `ingresarRut()`, `botonBuscar`                 |
| Constantes                      | UPPER_CASE en español                            | `RUTAS_MENU`, `TIEMPOS_ESPERA`                 |
| Tags de tests                   | `{ tag: "@regresion" }`                          | `@regresion`, `@sanity`, `@master`             |

- Métodos que **validan** algo empiezan con `esperar…`, `validar…` o `verificar…` (ESLint los reconoce como aserciones).
- Los identificadores propios de Playwright (`page`, `test`, `expect`, `use`, `testInfo`) se mantienen en inglés.
- Los selectores van como atributos `private readonly` del Page Object, nunca en el test.
- Las importaciones usan siempre alias (`@pages/...`, `@helpers/...`), nunca rutas relativas.

## Estabilidad de las pruebas

El ambiente QA es lento y variable: la misma consulta de un reporte puede tardar 3 s o más de 80 s. Para que eso no produzca fallos intermitentes:

- **Reportes pesados:** el Page Object crea `new PanelFiltros(page, RUTAS_API.<reporte>)`. Con eso `panelFiltros.buscar()` espera la respuesta real del backend y, si el servidor falla, el error lo dice en vez de parecer "sin resultados". Sus specs llevan `test.slow()`.
- **Filas de resultados:** se ubican por la celda exacta, porque las búsquedas de SMARTIC son por prefijo.
- **Tablas:** se leen con `TablaRegistros`, que ignora la fila "No se encontraron registros" que aparece mientras cargan.
- **Fechas:** `SelectorFecha` cierra el calendario emergente y confirma que el valor quedó escrito.
- **Tiempos de espera:** salen de `TIEMPOS_ESPERA`; no se usan esperas fijas (`waitForTimeout`).

## Instalación

```bash
git clone <url-del-repo>
cd qa-automation-smartic
npm ci                    # instala dependencias y activa los hooks de Husky
npx playwright install    # instala navegadores
cp .env.example .env.qa   # completa los valores
```

## Ejecutar tests

```bash
npm run test:qa            # ambiente QA (carga .env.qa)
npm run test:dev           # ambiente DEV (carga .env.dev)
npm run test:qa:headed     # QA con navegador visible
npm run test:ui            # modo UI de Playwright
npm run test:regresion     # solo tests con tag @regresion

# un solo spec
npx playwright test tests/e2e/asistencia/marcas-rechazadas/CP01-rechazo-marca-sin-horario.spec.ts
```

## Reportes

Todos los reportes quedan en `reports/`.

```bash
npm run reporte:playwright   # abre el reporte HTML de Playwright
npm run reporte:allure       # genera y abre el reporte Allure
npm run limpiar:reportes     # borra la carpeta reports/
```

## Calidad de código

```bash
npm run typecheck      # tsc sin emitir
npm run lint           # ESLint
npm run lint:fix       # ESLint con autocorrección
npm run format         # Prettier
npm run validar        # typecheck + lint + formato (lo mismo que corre en CI)
```

En cada `git commit`, Husky ejecuta `lint-staged` (ESLint + Prettier sobre los archivos modificados) y el typecheck.

> **Nota:** se usa TypeScript 6.0 porque typescript-eslint aún no soporta TypeScript 7.

## Agregar una página nueva a un módulo existente

1. Crea `src/pages/modulos/<modulo>/<submodulo>/<nombre>.page.ts` heredando de `BaseModuloPage` (o `BaseReporteDTPage` si es un reporte DT).
2. Declara `protected readonly rutaMenu = RUTAS_MENU.<RUTA>;` . Sobrescribe `esperarVisible()` solo si la pantalla necesita una espera propia (por defecto espera la carga).
3. Registra la fixture en `src/fixtures/modulos/<modulo>.fixture.ts`.
4. Agrega los datos de prueba en `src/data/<pantalla>.json` (un bloque por caso: `cp01`, `cp02`).
5. Crea los tests en `tests/e2e/<modulo>/<pantalla>/` importando `{ test, expect } from "@fixtures"`.

## Agregar un módulo nuevo

1. Crea `src/fixtures/modulos/<modulo>.fixture.ts` extendiendo `test` de `@fixtures/base.fixture`.
2. Súmalo a `mergeTests(...)` en `src/fixtures/index.ts`.
3. Crea los Page Objects en `src/pages/modulos/<modulo>/` y los datos en `src/data/<pantalla>.json`.
4. Crea los tests en `tests/e2e/<modulo>/<pantalla>/`.
