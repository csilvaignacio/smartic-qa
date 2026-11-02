# Reglas del proyecto

Framework de automatización E2E para la plataforma SMARTIC, con **Playwright + TypeScript**.

## Nomenclatura (estrictamente en español)

Todo debe estar en español: nombres de archivos, clases, métodos, variables, pasos de `test.step`, mensajes de aserción, comentarios y scripts de `package.json`.

| Tipo         | Sufijo / ubicación              | Ejemplo                            |
| ------------ | ------------------------------- | ---------------------------------- |
| Componentes  | `*.comp.ts` en `src/components` | `menu.lateral.comp.ts`             |
| Page objects | `*.page.ts` en `src/pages`      | `login.page.ts`                    |
| Utilidades   | `*.util.ts` / `*.helper.ts`     | `selector.fecha.util.ts`           |
| Fixtures     | `src/fixtures/modulos`          | `asistencia.fixture.ts`            |
| Specs        | `tests/e2e/**/*.spec.ts`        | `marcas-rechazadas.spec.ts`        |
| Scripts npm  | español, con `:` como separador | `test:regresion`, `reporte:allure` |

- Los archivos se escriben en minúsculas y separados por puntos (`panel.filtros.util.ts`).
- Los tags de tests también van en español: `@regresion`, `@sanity`, `@master`.
- No se mezclan nombres en inglés y español: si aparece un término técnico sin traducción natural (por ejemplo `fixture`, `locator`), se mantiene, pero el resto del nombre va en español.

## Normas de codificación (TypeScript)

Estas normas salen del código existente y de `tsconfig.json`, `eslint.config.mjs` y `.prettierrc.json`. Lo que ya valida el linter no es opcional: `npm run validar` debe pasar.

### Estructura y alias de importación

| Carpeta          | Contenido                                                         | Alias                      |
| ---------------- | ----------------------------------------------------------------- | -------------------------- |
| `src/config`     | `entorno.ts` (variables), `constantes.ts`, `rutas.menu.ts`        | `@config/*`                |
| `src/components` | Componentes de UI reutilizables (menús, paneles)                  | `@components/*`            |
| `src/pages`      | Page objects; los de módulo van en `pages/modulos/<modulo>/...`   | `@pages/*`                 |
| `src/helpers`    | Clases de ayuda sobre controles (`SelectorFecha`, `PanelFiltros`) | `@helpers/*`               |
| `src/utils`      | Funciones puras sin Playwright de página (`rut.util.ts`, Excel)   | `@utils/*`                 |
| `src/fixtures`   | `base.fixture.ts`, `modulos/*.fixture.ts` e `index.ts`            | `@fixtures`, `@fixtures/*` |

- Importar siempre con alias (`@pages/base.page`), **nunca con rutas relativas** (`../../`).
- Los specs importan `test` y `expect` **solo desde `@fixtures`**, nunca de `@playwright/test`. Los fixtures de módulo extienden de `@fixtures/base.fixture`.
- Para una pantalla nueva: crear el page object, registrarlo en el `*.fixture.ts` de su módulo y, si es un módulo nuevo, sumarlo a `mergeTests` en `src/fixtures/index.ts`.
- Las rutas del menú lateral viven en `RUTAS_MENU` (`as const`); no escribir rutas de menú sueltas en los page objects.

### Formato (Prettier)

- Máximo 110 columnas, 2 espacios, **comillas dobles**, punto y coma, coma final en todo (`trailingComma: "all"`), `arrowParens: "always"`, fin de línea `LF`.
- Separador numérico en números grandes: `30_000`, no `30000`.
- No formatear a mano: `npm run format` resuelve cualquier diferencia.

### Tipado estricto

- `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride` y `noUnusedLocals/Parameters` están activos.
- Todo método y función declara su tipo de retorno (`Promise<void>`, `Promise<string>`, `Promise<boolean>`).
- Usar `type` y no `interface` (`consistent-type-definitions`).
- Prohibido el operador `!` (non-null assertion). Con arrays/objetos indexados se maneja `undefined` explícitamente: `const [, valor] = texto.split(":"); return (valor ?? texto).trim();`.
- Al sobrescribir un método o propiedad de la clase base se escribe `override`.
- Constantes tipo catálogo: objeto `as const` y tipo derivado, por ejemplo `type Pestana = (typeof PESTANAS)[keyof typeof PESTANAS]`.
- Comparar siempre con `===` / `!==` (`eqeqeq`) y usar `const` salvo reasignación (`prefer-const`).
- Parámetros o variables sin uso: prefijo `_`. Evitar `console.*` (advertencia); la información se deja en `test.step` o `testInfo.attach`.

### Nombres en el código

- `camelCase` para variables, funciones, métodos y propiedades; `PascalCase` para clases y tipos; `UPPER_CASE` para constantes globales (`ENTORNO`, `RUTAS_MENU`, `TIEMPOS_ESPERA`, `RUTAS_SESION`).
- Sufijos de clase: `*Page` (page objects), `*Component` (componentes), sin sufijo en los helpers (`PanelFiltros`, `SelectorFecha`, `Paginacion`). Las clases base llevan prefijo `Base` (`BasePage`, `BaseModuloPage`, `BaseReporteDTPage`, `BaseComponent`).
- Los locators se nombran por **tipo de elemento + descripción**: `botonBuscar`, `campoIdentificador`, `enlaceBusquedaGrupal`, `tablaResultados`, `celdaEstablecimientoFaena`, `seccionFiltrosReporte`, `selectorRut`.
- Los métodos empiezan con un verbo en infinitivo que indica qué hacen:
  - Acciones: `navegar`, `abrir`, `ingresar`, `seleccionar`, `buscar`, `limpiar`, `exportar`, `iniciarSesion`.
  - Lectura de datos (devuelven un valor, **sin aserciones**): `obtener*`, `leer*`.
  - Preguntas booleanas: `esta*`, `tiene*` o `*Deshabilitado` (`estaVisible`, `tieneAnotacionCalendario`, `siguienteDeshabilitado`).
  - Esperas y comprobaciones web-first dentro del page object: **solo** con prefijo `esperar*`, `validar*` o `verificar*` (el linter los reconoce como aserciones válidas).
  - Atajos que encadenan varios pasos: nombre que describe el flujo (`filtrarPorRutYFechas`, `buscarYEditarColaborador`).

### Page objects y componentes

- Todo page object extiende `BasePage`; los que se abren desde el menú extienden `BaseModuloPage` y declaran `protected readonly rutaMenu = RUTAS_MENU.<RUTA>` para heredar `navegar()`. Los reportes DT extienden `BaseReporteDTPage`.
- Los locators son `private readonly` y se inicializan **en el constructor**. Los helpers y componentes que la prueba necesita usar (`panelFiltros`, `paginacion`, `busquedaGrupal`) se exponen como `readonly` públicos.
- Prioridad de selectores: `getByRole` / `getByLabel` / `getByText` → `id` o atributos estables → CSS. No usar clases autogeneradas de Angular (`ng-star-inserted`, `ng-tns-*`); si se ancla por texto de un encabezado, dejar un comentario que lo explique.
- Cada acción de negocio se envuelve en `test.step("...", async () => { ... })` con la descripción en español. Los pasos de bajo nivel (un `click`, un `fill`) pueden ir sin `test.step` si el método ya es un paso.
- Prohibido: `waitForTimeout`, `page.pause()`, `elementHandle`, `eval` y `{ force: true }` (advertencia). Esperar siempre una condición real (`expect(...).toBeVisible()`, `waitFor`, `toPass`).
- Los tiempos de espera propios salen de `TIEMPOS_ESPERA` en `@config/constantes`, no se escriben números sueltos.
- Si un dato esperado no existe (fila, hoja, botón deshabilitado), lanzar `throw new Error("mensaje en español con contexto")` en lugar de devolver silenciosamente un valor vacío.
- Las variables de entorno se leen solo desde `ENTORNO` (`@config/entorno`); no usar `process.env` en otros archivos. Credenciales y RUT reales van en `.env.<ambiente>`, nunca en el código.

### Async

- Toda interacción es `async` y se espera con `await`; un `await` olvidado es error de lint (`no-floating-promises`).
- Usar **`return await`** siempre que se retorne una promesa (`return await test.step(...)`), así los errores conservan la traza completa.

### Specs

- Estructura: `test.describe("<módulo> - <qué se valida>", { tag: "@regresion" }, () => { test("<caso>", async ({ fixtures }) => { ... }) })`. Un tag por suite (`@regresion`, `@sanity`, `@master`).
- Los datos de prueba van en un objeto `datosPrueba` (`as const`) arriba del spec; no repetir literales dentro del test.
- El test usa solo los métodos del page object: no tocar `page.locator(...)` ni selectores en el spec.
- Los pasos de verificación del spec se agrupan en `test.step("Validar ...", ...)` cuando conviene que se vean en el reporte.
- Sin lógica condicional en el test (`no-conditional-in-test`), sin `test.only` (error), sin `test.skip` salvo con motivo (advertencia) y sin `page.pause()`.
- Preferir aserciones web-first (`await expect(locator).toBeVisible()`) sobre extraer el valor y comparar, cuando el dato está en el DOM.

### Comentarios y documentación

- Comentarios en español. Usar JSDoc `/** ... */` en clases base, helpers y métodos públicos cuya intención no sea evidente por el nombre; comentario de una línea `//` para explicar un **porqué** (una decisión de selector, una espera, un workaround).
- No comentar lo obvio ni dejar código comentado.

## Reglas de Git

- **Prohibido hacer commits directos en `main`.** Siempre se trabaja en una rama descriptiva.
- Prefijos de rama: `feat/`, `fix/`, `refactor/`, `test/`, `chore/` (por ejemplo `test/aserciones-marcas-rechazadas`).
- Usar **Conventional Commits en español**: `tipo(alcance): descripción en minúsculas`, por ejemplo `refactor(pom): migrar componentes a convención en español`.
- **Commits atómicos**: cada commit tiene un solo propósito y se puede revisar por separado.
- Los cambios llegan a `main` solo mediante Pull Request.

## Husky y calidad de código

El hook `pre-commit` ejecuta `lint-staged` (ESLint + Prettier sobre los archivos en staging) y `npm run typecheck` (`tsc --noEmit`).

- Respetar siempre estas validaciones. **No usar `--no-verify`** ni saltarse el hook.
- Si el hook falla, corregir la causa y volver a commitear.
- Antes de subir cambios se puede correr todo junto con `npm run validar`.

## Tests

- Todo test debe tener una aserción real. No se aceptan aserciones vacías como `expect(true).toBe(true)`.
- La lógica de la página va en el page object; la aserción va en el spec.
- Los mensajes de las aserciones deben indicar qué se esperaba y qué se encontró.
