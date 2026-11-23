# Flujo de trabajo

## Ramas

- Una rama por funcionalidad, con prefijo y nombre descriptivo en español, en minúsculas y con guiones:

| Prefijo     | Para                                                     | Ejemplo                          |
| ----------- | -------------------------------------------------------- | -------------------------------- |
| `test/`     | Casos de prueba nuevos o cambios en specs                | `test/rechazo-marca-sin-horario` |
| `feat/`     | Page objects, helpers o capacidades nuevas del framework | `feat/page-object-calendarios`   |
| `fix/`      | Corregir un test o una pieza del framework que falla     | `fix/selector-fecha-reporte-dt`  |
| `refactor/` | Reordenar código sin cambiar lo que hace                 | `refactor/legibilidad-proyecto`  |
| `docs/`     | Solo documentación                                       | `docs/guia-nuevo-test`           |
| `chore/`    | Configuración, dependencias y herramientas               | `chore/actualizar-playwright`    |

## Commits

[Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/) en español: `tipo(alcance): descripción en minúsculas`, en imperativo y sin punto final.

```text
test(marcas-rechazadas): agregar cp02 a cp05 y mover datos de prueba a src/data
fix(helpers): evitar clics repetidos en el menú lateral y opciones obsoletas en ng-select
refactor(config): reunir RUTAS_MENU, RUTAS_API y RUTAS_SESION en rutas.ts
```

- **Commits atómicos:** un solo propósito por commit, para revisarlos (y revertirlos) por separado.
- **Tipos:** `feat`, `fix`, `test`, `refactor`, `docs`, `style`, `chore`, `ci`.
- **Alcance:** la pantalla o el módulo (`marcas-rechazadas`, `reporte-asistencia`, `ficha-colaborador`) o la capa (`pom`, `helpers`, `utils`, `fixtures`, `config`, `data`).

## Hooks de Git

Husky se activa solo con `npm ci` y, en cada `git commit`, corre:

1. `lint-staged`: ESLint y Prettier sobre los archivos en staging (corrigen solos lo que pueden).
2. `npm run typecheck`: revisa los tipos de **todo** el proyecto, también los archivos que no estás commiteando.

Si el hook falla, corrige la causa y vuelve a commitear. No uses `--no-verify`.

## Antes de abrir el PR

```bash
npm run validar     # typecheck + lint + formato: lo mismo que revisa CI
```

Al abrir el PR en GitHub, la descripción se llena con la plantilla de `.github/pull_request_template.md`: completa qué cambia, cómo lo probaste y el checklist.

## CI (GitHub Actions)

`.github/workflows/playwright.yml` corre en cada push y en cada PR hacia `main`:

| Job       | Qué hace                                                         |
| --------- | ---------------------------------------------------------------- |
| `calidad` | `npm run validar`                                                |
| `test`    | Instala Chromium y corre la suite en QA (solo si `calidad` pasó) |

- Las credenciales salen de los secrets del entorno `qa` de GitHub (Settings → Environments).
- Los reportes quedan como artefacto `reports` durante 30 días.
- En CI la suite corre con 2 reintentos, 1 worker y `test.only` prohibido.

## Editor

VS Code con las extensiones recomendadas del repo (`.vscode/extensions.json`): Playwright Test, ESLint, Prettier y EditorConfig. La configuración compartida formatea con Prettier y aplica ESLint al guardar.

> TypeScript está fijado en 6.x porque typescript-eslint aún no soporta la versión 7.
