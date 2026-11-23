# Arquitectura

Cómo corre la suite y qué hace cada pieza. Para el paso a paso de un test nuevo, ve a [Agregar un test](guia-nuevo-test.md).

## Cómo corre la suite

```text
npm run test:qa
  │
  ├─ 1. Proyecto "setup"   tests/setup/autenticacion.setup.ts
  │       Inicia sesión, entra a la empresa y guarda la sesión en storage/admin.json
  │
  └─ 2. Proyecto "e2e"     tests/e2e/**/*.spec.ts   (espera a que termine "setup")
          Cada test abre el navegador con esa sesión: entra ya logueado
          Los specs corren en paralelo: cada caso debe valerse por sí mismo
```

Los dos proyectos están en `playwright.config.ts`, junto con el viewport fijo (1440x900), el idioma (`es-CL`), la zona horaria (`America/Santiago`) y los tiempos de espera generales.

## Las capas de un test

```text
spec             tests/e2e/        Qué se prueba: los pasos del caso y las aserciones de negocio
  │ pide páginas por nombre
fixture          src/fixtures/     Crea los page objects y se los entrega al test
  │
page object      src/pages/        Qué se puede hacer en una pantalla: navegar, llenar, leer
  │ usa
componente       src/components/   Zonas de pantalla reutilizables: menús, paneles, pestañas
helper           src/helpers/      Controles genéricos: listas, fechas, tablas, filtros, paginación
  │ leen
config y utils   src/config/       Entorno, rutas, tiempos de espera
                 src/utils/        Funciones puras (fechas, textos)
```

Cada capa usa solo las de abajo:

- El **spec** nunca toca selectores: solo llama métodos del page object.
- El **page object** no decide si el caso pasa por un dato de negocio: devuelve el dato y el spec lo compara.
- Los **utils** no usan Playwright: se pueden probar sin navegador.

## Un test real, pieza por pieza

`tests/e2e/reportes-dt/reporte-asistencia/CP02-asistencia-colaborador.spec.ts` (resumido):

```ts
test("CP02 - Asistencia SI con Ausencia vacía", async ({ reporteAsistencia }) => {
  await reporteAsistencia.navegar();
  await reporteAsistencia.filtrarPorRutYFechas(rut, fechaInicio, fechaTermino);
  await reporteAsistencia.panelFiltros.buscar();
  await reporteAsistencia.esperarResultados();

  const ausencia = await reporteAsistencia.obtenerAusenciaPrimeraAsistencia();

  await test.step("Validar que la Ausencia está vacía cuando la Asistencia es SI", () => {
    expect(
      ausencia,
      `Se esperaba Ausencia vacía cuando Asistencia = SI, pero se encontró: '${ausencia}'`,
    ).toBe("");
  });
});
```

| Pieza                                | De dónde sale                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `{ reporteAsistencia }`              | Fixture registrada en `src/fixtures/modulos/reportes.dt.fixture.ts`                              |
| `rut`, `fechaInicio`, `fechaTermino` | Bloque `cp02` de `src/data/reportes-dt/reporte.asistencia.json`                                  |
| `navegar()`                          | `BaseModuloPage`: abre el inicio y recorre el menú con `RUTAS_MENU.REPORTE_ASISTENCIA_DT`        |
| `filtrarPorRutYFechas()`             | Método de flujo de `ReporteAsistenciaPage`: usa `SelectorLista` (RUT) y `SelectorFecha` (fechas) |
| `panelFiltros.buscar()`              | Helper `PanelFiltros`, que trae `BaseReporteDTPage`                                              |
| `esperarResultados()`                | Espera de estado: la tabla del reporte terminó de cargar                                         |
| `obtenerAusenciaPrimeraAsistencia()` | Lectura: devuelve el texto de la celda, sin aserciones                                           |
| `expect(...)`                        | Aserción de negocio: vive en el spec y su mensaje dice qué se esperaba y qué se encontró         |

## Fixtures

```text
@playwright/test
      │
base.fixture.ts                       menuLateral, menuUsuario, loginPage, seleccionEmpresa, inicioPage
      │
      ├── modulos/api.fixture.ts            loginClient, apiAutenticada (token por worker)
      ├── modulos/asistencia.fixture.ts     calendarios, fichaColaborador, horarios, marcasRechazadas
      └── modulos/reportes.dt.fixture.ts    reporteAsistencia
                    │
             index.ts (mergeTests)         { test, expect } que importan todos los specs
```

- Una fixture solo **crea** el page object. La navegación la hace el test (`await pagina.navegar()`), así un caso puede usar varias pantallas en el orden que necesite.
- Cada módulo extiende `base.fixture.ts` e `index.ts` los une con `mergeTests`. Por eso los specs importan siempre `import { expect, test } from "@fixtures"`.

## Herencia de page objects y componentes

```text
BasePage                     esperarVisible() (por defecto espera la carga de la página)
├── LoginPage, SeleccionEmpresaPage, InicioPage
└── BaseModuloPage           + navegar(): cada hija declara su rutaMenu
    ├── FichaColaboradorPage, CalendariosPage, HorariosPage, MarcasRechazadasPage
    └── BaseReporteDTPage    + panelFiltros y paginacion
        └── ReporteAsistenciaPage

BaseComponent                contenedor, estaVisible(), esperarVisible()
├── MenuLateralComponent, MenuUsuarioComponent, BusquedaGrupalComponent
└── PestanaContratoComponent, PestanaAgendaComponent, PestanaLocalEstabFaenaComponent
```

## ¿Page object, componente, helper o util?

| Si es...                                                                 | Va en                                                     | Ejemplo                                       |
| ------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------- |
| Una pantalla que se abre desde el menú                                   | `src/pages/modulos/<modulo>/` (`*.page.ts`)               | `FichaColaboradorPage`                        |
| Una zona de pantalla con contenedor propio (se repite o tiene su lógica) | `src/components/` (`*.comp.ts`, extiende `BaseComponent`) | Pestaña AGENDA de la Ficha Colaborador        |
| Un control que aparece igual en muchas pantallas y se ubica por `id`/rol | `src/helpers/` (`*.helper.ts`)                            | Lista `ng-select`, calendario de fecha, tabla |
| Una función que no necesita navegador                                    | `src/utils/` (`*.util.ts`)                                | Saber si una hora cae dentro de un rango      |

## Configuración

| Archivo                    | Qué tiene                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/config/entorno.ts`    | `ENTORNO`: lee `.env.<ambiente>` y falla con un mensaje claro si falta una variable. El código lee el entorno solo de aquí |
| `src/config/rutas.ts`      | `RUTAS_MENU` (caminos del menú lateral), `RUTAS_API` (URL del backend que se esperan) y `RUTAS_SESION` (archivo de sesión) |
| `src/config/constantes.ts` | `TIEMPOS_ESPERA` y catálogos de la UI, como las pestañas de la Ficha Colaborador                                           |

El ambiente se elige con la variable `AMBIENTE` (por defecto `qa`): `npm run test:dev` carga `.env.dev`.

## Reportes y evidencias

Todo queda en `reports/` (se borra con `npm run limpiar:reportes`):

| Carpeta                                      | Contenido                                                         |
| -------------------------------------------- | ----------------------------------------------------------------- |
| `reports/playwright-report/`                 | Reporte HTML (`npm run reporte:playwright`)                       |
| `reports/allure-results/` y `allure-report/` | Allure (`npm run reporte:allure`)                                 |
| `reports/junit/`                             | `resultados.xml` para CI                                          |
| `reports/test-results/`                      | Por cada test fallido: captura, video y, si hubo reintento, traza |

En CI la suite corre con 2 reintentos y 1 worker; en local, sin reintentos y en paralelo.
