# QA Automation SMARTIC

Pruebas E2E de la plataforma SMARTIC de Vigatec, con **Playwright + TypeScript**.

> ¿Primera vez en el proyecto? Sigue el [inicio rápido](#inicio-rápido) y después lee [Arquitectura](docs/arquitectura.md) y [Agregar un test](docs/guia-nuevo-test.md).

## Inicio rápido

Necesitas Node 20 o superior, Git y acceso al ambiente QA de SMARTIC.

```bash
git clone <url-del-repo> qa-automation-smartic
cd qa-automation-smartic
npm ci                            # instala dependencias y activa los hooks de Git
npx playwright install chromium   # navegador que usa la suite
cp .env.example .env.qa           # completa los valores: cada variable está explicada en el archivo
npm run test:qa                   # corre toda la suite en QA
npm run reporte:playwright        # abre el reporte de la última ejecución
```

`.env.qa` tiene credenciales: está en `.gitignore` y nunca se sube al repositorio.

## Qué cubre hoy la suite

| Módulo › pantalla                          | Casos     | Qué valida                                                                                                                                                                                                    |
| ------------------------------------------ | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Asistencia › Revisión de marcas rechazadas | CP01–CP05 | Para cada motivo de rechazo (sin horario, sin calendario, sin contrato, fuera de turno, usuario inhabilitado) toma una marca del reporte y confirma el motivo en la Ficha Colaborador, Calendarios y Horarios |
| Reportes DT › Reporte asistencia           | CP01      | El Establecimiento/Faena del reporte coincide con la Ficha Colaborador                                                                                                                                        |
| Reportes DT › Reporte asistencia           | CP02      | Si la Asistencia es SI, la Ausencia está vacía                                                                                                                                                                |

## Comandos

| Comando                               | Para qué                                                         |
| ------------------------------------- | ---------------------------------------------------------------- |
| `npm run test:qa`                     | Toda la suite en QA (`.env.qa`); `npm test` hace lo mismo        |
| `npm run test:dev`                    | Toda la suite en DEV (`.env.dev`)                                |
| `npm run test:headed`                 | Con el navegador visible                                         |
| `npm run test:ui`                     | Modo UI de Playwright: elegir, ver y depurar tests               |
| `npm run test:debug`                  | Paso a paso con el inspector de Playwright                       |
| `npm run test:regresion`              | Solo el tag `@regresion` (también `test:sanity` y `test:master`) |
| `npx playwright test <ruta-del-spec>` | Un solo spec                                                     |
| `npm run reporte:playwright`          | Abre el reporte HTML                                             |
| `npm run reporte:allure`              | Genera y abre el reporte Allure                                  |
| `npm run limpiar:reportes`            | Borra la carpeta `reports/`                                      |
| `npm run validar`                     | Typecheck + lint + formato, lo mismo que revisa CI               |

## Mapa del repositorio

```text
src/
├── config/        Entorno (ENTORNO), tiempos de espera y rutas del menú y del backend
├── pages/         Page objects, uno por pantalla (los de módulo en pages/modulos/<modulo>/)
├── components/    Zonas de pantalla reutilizables: menú lateral, menú de usuario, pestañas
├── helpers/       Controles genéricos: listas ng-select, fechas, tablas, filtros, paginación
├── fixtures/      Entregan los page objects a los tests ({ test, expect } desde @fixtures)
├── data/          Datos de prueba en JSON, por módulo: data/<modulo>/<pantalla>.json
└── utils/         Funciones puras, sin Playwright (fechas, textos)
tests/
├── setup/         Login único: guarda la sesión que reutilizan todos los specs
└── e2e/           Specs por módulo y pantalla: e2e/<modulo>/<pantalla>/CPnn-*.spec.ts
docs/              Guías del proyecto
reports/           (generado) reportes, trazas, videos y capturas
storage/           (generado) sesión autenticada
```

## Documentación

| Guía                                                            | Qué encuentras                                                                  |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| [Arquitectura](docs/arquitectura.md)                            | Cómo corre la suite y cómo se conectan specs, fixtures, page objects y helpers  |
| [Agregar un test](docs/guia-nuevo-test.md)                      | Paso a paso con plantillas: un caso nuevo, una pantalla nueva o un módulo nuevo |
| [Convenciones](docs/convenciones.md)                            | Nombres, verbos, selectores, aserciones y reglas de TypeScript                  |
| [Particularidades de SMARTIC](docs/particularidades-smartic.md) | Comportamientos de la app que afectan a los tests y errores frecuentes          |
| [Flujo de trabajo](docs/flujo-de-trabajo.md)                    | Ramas, commits, hooks de Git, CI y pull requests                                |

## Stack

- **Playwright** y **TypeScript** en modo estricto.
- **Reportes:** HTML de Playwright, Allure 3 y JUnit.
- **Calidad:** ESLint (typescript-eslint + eslint-plugin-playwright), Prettier, Husky y lint-staged.
- **CI:** GitHub Actions / Azure DevOps (en migración).
