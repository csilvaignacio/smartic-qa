# QA Automation SMARTIC — Playwright + TypeScript

Framework de automatización de pruebas E2E para la plataforma SMARTIC de Vigatec.

## Stack técnico

- **Playwright** — framework de automatización E2E
- **TypeScript** — lenguaje principal
- **Allure** — reportes de resultados
- **Azure DevOps** — CI/CD (en migración)

## Estructura del proyecto

```
qa-automation-smartic/
├── src/
│   ├── config/        # Variables de entorno y constantes
│   ├── fixtures/      # Fixtures por módulo
│   └── types/         # Tipos del dominio SMARTIC
├── pages/
│   ├── BasePage.ts
│   ├── BaseReportPage.ts
│   └── modules/       # Page Objects por módulo
├── helpers/           # NgSelect, FilterPanel, Pagination, etc.
├── components/        # Componentes reutilizables de UI
├── utils/             # RUT, fechas, Excel
└── tests/
    ├── auth.setup.ts  # Login y sesión
    └── e2e/           # Tests por módulo
```

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd qa-automation-smartic

# Instalar dependencias
npm ci

# Instalar navegadores
npx playwright install
```

## Configuración

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env.qa
```

## Correr los tests

```bash
# QA con navegador visible
npm run test:headedqa

# QA sin navegador
npm run test:qa
```

## Agregar un nuevo reporte

1. Crea el Page Object en `pages/modules/<modulo>/`
2. Hereda de `BaseReportPage`
3. Agrega la fixture en `src/fixtures/<modulo>.fixture.ts`
4. Registra la fixture en `src/fixtures/index.ts`
5. Crea los tests en `tests/e2e/<modulo>/`

## Agregar un nuevo módulo

1. Crea el fixture file en `src/fixtures/<modulo>.fixture.ts`
2. Agrégalo en `src/fixtures/index.ts` con `.extend()`
3. Crea los Page Objects en `pages/modules/<modulo>/`
4. Crea los tests en `tests/e2e/<modulo>/`
```
