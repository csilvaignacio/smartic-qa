# Convenciones

Reglas para que todo el código se lea igual, lo escriba quien lo escriba. TypeScript, ESLint y Prettier revisan muchas solos (`npm run validar`); aquí están también las que ninguna herramienta puede revisar.

## Idioma

Todo va en español: archivos, carpetas, clases, métodos, variables, pasos de `test.step`, mensajes de aserción, comentarios y scripts de `package.json`.

Quedan en inglés solo:

- Los identificadores de Playwright: `page`, `test`, `expect`, `use`, `testInfo`.
- Términos técnicos sin traducción natural: `fixture`, `locator`, `helper`, `spec`.

No se mezclan idiomas dentro de un nombre: `obtenerFila`, no `getFila`.

## Archivos y carpetas

| Tipo              | Ubicación y nombre                                  | Ejemplo                                      |
| ----------------- | --------------------------------------------------- | -------------------------------------------- |
| Page object       | `src/pages/modulos/<modulo>/...` → `*.page.ts`      | `ficha.colaborador.page.ts`                  |
| Componente        | `src/components/` → `*.comp.ts`                     | `menu.lateral.comp.ts`                       |
| Helper            | `src/helpers/` → `*.helper.ts`                      | `selector.fecha.helper.ts`                   |
| Util              | `src/utils/` → `*.util.ts`                          | `fecha.util.ts`                              |
| Fixture de módulo | `src/fixtures/modulos/` → `*.fixture.ts`            | `reportes.dt.fixture.ts`                     |
| Datos de prueba   | `src/data/<modulo>/` → `<pantalla>.json`            | `src/data/asistencia/marcas.rechazadas.json` |
| Spec              | `tests/e2e/<modulo>/<pantalla>/` → `CPnn-*.spec.ts` | `CP01-establecimiento-faena.spec.ts`         |

- Archivos en minúsculas y separados por puntos: `panel.filtros.helper.ts`.
- Carpetas en minúsculas y en kebab-case: `reportes-dt`, `ficha-colaborador`, `marcas-rechazadas`.
- Page objects, datos y specs se agrupan por el mismo módulo.

## Nombres en el código

| Elemento            | Formato      | Ejemplo                                 |
| ------------------- | ------------ | --------------------------------------- |
| Variables y métodos | `camelCase`  | `fechaInicio`, `obtenerHorarioDelDia()` |
| Clases y tipos      | `PascalCase` | `CalendariosPage`, `MarcaRechazada`     |
| Constantes globales | `UPPER_CASE` | `RUTAS_MENU`, `TIEMPOS_ESPERA`          |
| Parámetros sin uso  | prefijo `_`  | `_testInfo`                             |

- Sufijo según el tipo de clase: `*Page` (page objects) y `*Component` (componentes). Los helpers van sin sufijo: `PanelFiltros`, `SelectorFecha`, `TablaRegistros`.
- Las clases base llevan el prefijo `Base`: `BasePage`, `BaseModuloPage`, `BaseReporteDTPage`, `BaseComponent`.
- Los locators se nombran por **tipo de elemento + descripción**: `botonBuscar`, `campoIdentificador`, `tablaResultados`, `celdaEstablecimientoFaena`, `selectorRut`.
- Los catálogos son un objeto `as const` con su tipo derivado, como `PESTANAS_FICHA_COLABORADOR` y `PestanaFichaColaborador` en `@config/constantes`.

## Verbos de los métodos

| Tipo             | Empieza con                                                                                        | Regla                                     |
| ---------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| Acción           | `navegar`, `abrir`, `cerrar`, `ingresar`, `seleccionar`, `buscar`, `editar`, `limpiar`, `exportar` | Hace algo y no devuelve datos             |
| Lectura          | `obtener`, `leer`                                                                                  | Devuelve un valor, sin aserciones         |
| Pregunta         | `esta`, `tiene`, `...Deshabilitado`                                                                | Devuelve `boolean`                        |
| Espera de estado | `esperar`                                                                                          | Solo `expect` web-first sobre la pantalla |
| Validación       | `validar`, `verificar`                                                                             | Aserción sobre un dato que está en el DOM |
| Flujo            | El nombre del flujo: `filtrarPorRutYFechas`, `buscarYEditarColaborador`                            | Encadena métodos individuales             |

ESLint reconoce `esperar*`, `validar*` y `verificar*` como aserciones válidas dentro de un test.

## Métodos individuales y de flujo

- Cada campo o filtro tiene su método individual (`ingresarFechaInicio`, `seleccionarTurno`). Son los bloques base y se usan solos en casos que validan un campo.
- Si un formulario tiene muchos filtros, se agrega **un** método de flujo que recibe un objeto tipado (`type Filtros...`), llena los obligatorios y solo los opcionales que vengan. El `if` de cada opcional va en el page object, nunca en el spec.
- El método de flujo **no** pulsa Buscar: lo hace el spec con `await <pagina>.panelFiltros.buscar()`, para poder probar también "llenar sin buscar" o "limpiar".

## Dónde va cada aserción

| Qué se comprueba                                          | Dónde       | Cómo                                                                                 |
| --------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------ |
| Estado de la pantalla (cargó, se ve, la tabla está lista) | Page object | Método `esperar*` con `expect` web-first                                             |
| Dato de negocio (el valor mostrado es el correcto)        | Spec        | `expect` sobre lo que devuelve un `obtener*`, o `validar*` si el dato está en el DOM |

- Todo test tiene al menos una aserción real (nada de `expect(true).toBe(true)`).
- Cada aserción lleva un mensaje que dice **qué se esperaba y qué se encontró**:

  ```ts
  expect(
    tieneContratoVigente,
    `Se esperaba un contrato vigente al ${marca.fechaMarca} para el colaborador ${marca.identificador}, pero no existe`,
  ).toBe(true);
  ```

- Si un dato que debería existir no está (una fila, una pestaña, un botón habilitado), el page object lanza un error con contexto en vez de devolver vacío. El mensaje incluye lo que sí encontró:

  ```ts
  throw new Error(
    `El reporte no tiene marcas con motivo '${motivo}'. Motivos encontrados: [${motivos.join(", ")}]`,
  );
  ```

## Selectores

Orden de preferencia:

1. `getByRole`, `getByLabel`, `getByText`.
2. `id` u otros atributos estables (`name`, `formcontrolname`).
3. CSS, como último recurso.

Además:

- Nunca clases autogeneradas de Angular (`ng-star-inserted`, `ng-tns-*`): cambian solas. Las clases propias de una librería (`.ng-value-label` de ng-select, `.fc-next-button` de FullCalendar) sí son estables; deja un comentario que lo diga.
- Si un locator se ancla por el texto de un encabezado, un comentario explica por qué.
- Una fila de resultados se ubica por la **celda exacta**, no por `hasText`, porque las búsquedas de SMARTIC son por prefijo:

  ```ts
  this.filasResultados.filter({ has: this.page.getByRole("cell", { name: identificador, exact: true }) });
  ```

- Los locators son `private readonly` y se crean en el constructor. Los helpers y componentes que el spec necesita (`panelFiltros`, `paginacion`, `busquedaGrupal`) son `readonly` públicos.
- Los componentes le pasan su contenedor a `super(page, contenedor)` y anclan sus locators a él.

## Esperas

- Siempre se espera una condición real: `expect(...).toBeVisible()`, `waitFor`, `waitForResponse` o `toPass`.
- Prohibidos: `waitForTimeout`, `page.pause()`, `elementHandle`, `eval` y `{ force: true }`.
- Los tiempos propios salen de `TIEMPOS_ESPERA` (`@config/constantes`), nunca de números sueltos.

## Specs

```ts
import datos from "@data/<modulo>/<pantalla>.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp01;

test.describe("<Pantalla> - <qué se valida>", { tag: "@regresion" }, () => {
  test("CP01 - <caso>", async ({ miPantalla }) => {
    // pasos con métodos del page object y aserciones con mensaje
  });
});
```

- Un tag por `describe`: `@regresion`, `@sanity` o `@master`.
- El título del test empieza con el código del caso (`CP01 - ...`), igual que el archivo.
- Los datos vienen del JSON (`datosPrueba`, un bloque por caso); no se repiten literales dentro del test.
- Nada de credenciales ni datos sensibles en los JSON: van en `.env.<ambiente>` y se leen con `ENTORNO`.
- El test solo llama métodos de page objects: sin `page.locator(...)` ni selectores.
- Sin lógica condicional (`if`, `? :`), sin `test.only` y sin `page.pause()`. `test.skip` solo con el motivo escrito.
- Los specs de reportes pesados llevan `test.slow()` con un comentario que explica por qué.
- Las verificaciones van dentro de `test.step("Validar ...", ...)` para que se lean en el reporte.
- Si el dato está en el DOM, mejor una aserción web-first (`await expect(locator).toBeVisible()`) que extraer el valor y compararlo.

## TypeScript

- Todo método declara su tipo de retorno.
- `type` en vez de `interface`.
- Prohibido el operador `!`: el `undefined` se maneja de forma explícita.

  ```ts
  const [, valor] = texto.split(":");
  return (valor ?? texto).trim();
  ```

- `override` al sobrescribir un método de la clase base.
- Toda interacción lleva `await`, y al retornar una promesa se usa `return await` (deja trazas completas en el reporte).
- Números grandes con separador: `30_000`.
- Sin `console.*`: la información va en `test.step` o en `testInfo.attach`.

## Importaciones

Siempre con alias, nunca con rutas relativas (`../../`):

| Alias                       | Carpeta           |
| --------------------------- | ----------------- |
| `@config/*`                 | `src/config/`     |
| `@pages/*`                  | `src/pages/`      |
| `@components/*`             | `src/components/` |
| `@helpers/*`                | `src/helpers/`    |
| `@utils/*`                  | `src/utils/`      |
| `@data/*`                   | `src/data/`       |
| `@fixtures` y `@fixtures/*` | `src/fixtures/`   |
| `@api/*`                    | `src/api/`        |

- Los specs importan `test` y `expect` **solo** desde `@fixtures`, nunca desde `@playwright/test`.
- Page objects, componentes y helpers sí importan desde `@playwright/test`.

## Comentarios

- En español.
- JSDoc (`/** ... */`) en clases base, helpers y métodos públicos cuya intención no se entiende por el nombre.
- `//` de una línea para explicar un **porqué**: una decisión de selector, una espera, un workaround.
- No se comenta lo obvio ni se deja código comentado.
