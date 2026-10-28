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
│   ├── config/                     # Configuración global
│   │   ├── entorno.ts              # ENTORNO: variables de .env.<ambiente>
│   │   ├── constantes.ts           # TIEMPOS_ESPERA, RUTAS_SESION, PESTANAS_*
│   │   └── rutas.menu.ts           # RUTAS_MENU: rutas del menú lateral
│   ├── data/                       # Datos de prueba por módulo
│   │   └── reportes-dt/
│   ├── components/                 # Componentes de UI reutilizables (*.component.ts)
│   │   ├── base.component.ts
│   │   ├── menu.lateral.component.ts
│   │   └── menu.usuario.component.ts
│   ├── pages/                      # Page Objects (*.page.ts)
│   │   ├── base.page.ts            # Base de todas las páginas
│   │   ├── base.modulo.page.ts     # Base de páginas abiertas desde el menú (abrir())
│   │   ├── login.page.ts
│   │   ├── seleccion.empresa.page.ts
│   │   ├── inicio.page.ts
│   │   └── modulos/
│   │       ├── asistencia/administracion/
│   │       └── reportes-dt/
│   ├── fixtures/
│   │   ├── index.ts                # Punto de entrada único: { test, expect }
│   │   ├── base.fixture.ts         # Fixtures compartidas por todos los módulos
│   │   └── modulos/                # Un archivo de fixtures por módulo
│   │       ├── asistencia.fixture.ts
│   │       └── reportes-dt.fixture.ts
│   ├── helpers/                    # Utilidades ligadas a Playwright (evidencias, etc.)
│   └── utils/                      # Utilidades: RUT, Excel y ayudas para controles Angular
│       ├── selector.lista.util.ts    # ng-select
│       ├── selector.fecha.util.ts    # nb-datepicker
│       ├── panel.filtros.util.ts     # Buscar / Limpiar / Exportar
│       └── paginacion.util.ts        # Siguiente / Anterior
├── tests/
│   ├── setup/autenticacion.setup.ts  # Login + selección de empresa (guarda la sesión)
│   └── e2e/                          # Tests por módulo
└── reports/                        # (generado) TODOS los reportes y evidencias
    ├── playwright-report/
    ├── allure-results/
    ├── allure-report/
    ├── junit/
    └── test-results/               # trazas, videos y capturas
```

## Arquitectura de fixtures

```
@playwright/test
      │
base.fixture.ts            → menuLateral, menuUsuario, loginPage, seleccionEmpresa, inicioPage
      │
      ├── modulos/asistencia.fixture.ts    → fichaColaboradorPage
      └── modulos/reportes-dt.fixture.ts   → reporteAsistenciaPage
                     │
                index.ts (mergeTests)  → test, expect
```

- Cada módulo **extiende `base.fixture.ts`**, así todas las fixtures compartidas están disponibles en cualquier módulo.
- `index.ts` combina todos los módulos con `mergeTests`. Los tests **siempre** importan desde `@fixtures`.
- Las fixtures solo **crean** el Page Object; la navegación la hace el test con `await pagina.abrir()`. Así un test puede usar varias páginas en el orden que necesite.

## Convenciones

| Elemento                        | Convención                                        | Ejemplo                                        |
| ------------------------------- | ------------------------------------------------- | ---------------------------------------------- |
| Archivos                        | `nombre.en.español.<tipo>.ts`                     | `ficha.colaborador.page.ts`                    |
| Clases                          | PascalCase en español + sufijo de tipo            | `FichaColaboradorPage`, `MenuLateralComponent` |
| Métodos / atributos / variables | camelCase en español, verbos en infinitivo        | `ingresarRut()`, `botonBuscar`                 |
| Constantes                      | UPPER_CASE en español                             | `RUTAS_MENU`, `TIEMPOS_ESPERA`                 |
| Fixtures                        | camelCase + sufijo `Page` / nombre del componente | `reporteAsistenciaPage`, `menuLateral`         |
| Carpetas de dominio             | kebab-case en español                             | `reportes-dt`, `asistencia/administracion`     |
| Tags de tests                   | `{ tag: "@regresion" }`                           | `@regresion`, `@sanity`, `@master`             |

- Métodos que **validan** algo empiezan con `esperar…`, `validar…` o `verificar…` (ESLint los reconoce como aserciones).
- Los identificadores propios de Playwright (`page`, `test`, `expect`, `use`, `testInfo`) se mantienen en inglés.
- Los selectores van como atributos `private readonly` del Page Object, nunca en el test.

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

1. Crea `src/pages/modulos/<modulo>/<nombre>.page.ts` heredando de `BaseModuloPage` (o `BaseReporteDTPage` si es un reporte DT).
2. Declara `protected readonly rutaMenu = RUTAS_MENU.<RUTA>;` . Sobrescribe `esperarVisible()` solo si la pantalla necesita una espera propia (por defecto espera la carga).
3. Registra la fixture en `src/fixtures/modulos/<modulo>.fixture.ts`.
4. Crea los tests en `tests/e2e/<modulo>/` importando `{ test, expect } from "@fixtures"`.

## Agregar un módulo nuevo

1. Crea `src/fixtures/modulos/<modulo>.fixture.ts` extendiendo `test` de `@fixtures/base.fixture`.
2. Súmalo a `mergeTests(...)` en `src/fixtures/index.ts`.
3. Crea los Page Objects en `src/pages/modulos/<modulo>/` y los datos en `src/data/<modulo>/`.
4. Crea los tests en `tests/e2e/<modulo>/`.
