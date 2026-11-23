# Agregar un test

Tres situaciones, de la más común a la menos común:

- [A. Un caso nuevo en una pantalla que ya está automatizada](#a-un-caso-nuevo-en-una-pantalla-existente)
- [B. Una pantalla nueva en un módulo existente](#b-una-pantalla-nueva)
- [C. Un módulo nuevo](#c-un-módulo-nuevo)

Antes de empezar:

1. Corre la suite una vez (`npm run test:qa`) para confirmar que tu `.env.qa` funciona.
2. Crea una rama para tu trabajo (ver [Flujo de trabajo](flujo-de-trabajo.md)).
3. Ten a mano las [Convenciones](convenciones.md): nombres, verbos y dónde va cada aserción.

## A. Un caso nuevo en una pantalla existente

Ejemplo: un `CP03` para el Reporte asistencia de Reportes DT.

**1. Datos.** Agrega un bloque `cp03` al JSON de la pantalla, `src/data/reportes-dt/reporte.asistencia.json`:

```json
"cp03": {
  "rangoFechas": { "fechaInicio": "01-11-2026", "fechaTermino": "16-11-2026" },
  "identificadorColaborador": "10016494"
}
```

**2. Spec.** Crea `tests/e2e/reportes-dt/reporte-asistencia/CP03-<descripcion>.spec.ts`:

```ts
import datos from "@data/reportes-dt/reporte.asistencia.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp03;

test.describe("Reporte Asistencia DT - <qué se valida>", { tag: "@regresion" }, () => {
  test("CP03 - <caso>", async ({ reporteAsistencia }) => {
    await reporteAsistencia.navegar();
    await reporteAsistencia.filtrarPorRutYFechas(
      datosPrueba.identificadorColaborador,
      datosPrueba.rangoFechas.fechaInicio,
      datosPrueba.rangoFechas.fechaTermino,
    );
    await reporteAsistencia.panelFiltros.buscar();
    await reporteAsistencia.esperarResultados();

    const valor = await reporteAsistencia.obtenerEstablecimientoFaena();

    await test.step("Validar <qué>", () => {
      expect(valor, `Se esperaba <esto>, pero se encontró '${valor}'`).toBe("<esperado>");
    });
  });
});
```

**3. ¿Falta un método?** Agrégalo al page object respetando los [verbos](convenciones.md#verbos-de-los-métodos). Si necesita un selector nuevo, va como locator `private readonly` creado en el constructor.

**4. Córrelo** solo y con el navegador visible, y después con la suite completa (los specs corren en paralelo):

```bash
npx playwright test tests/e2e/reportes-dt/reporte-asistencia/CP03-<descripcion>.spec.ts --headed
npm run test:qa
```

**5. Valida** antes de commitear: `npm run validar`.

## B. Una pantalla nueva

Ejemplo: el **Reporte jornada diaria** de Reportes DT, que todavía no está automatizado. Los `id`, columnas y valores son ilustrativos: confírmalos en el HTML de la pantalla (DevTools o `npx playwright codegen`).

**1. Ruta del menú.** Si no existe, agrégala a `RUTAS_MENU` en `src/config/rutas.ts`, con el texto exacto de cada enlace del menú. Esta ya existe:

```ts
REPORTE_JORNADA_DIARIA_DT: ["Reportes DT", "Reporte jornada diaria"],
```

**2. Page object.** Elige la clase base:

| La pantalla...                                   | Extiende                                                    |
| ------------------------------------------------ | ----------------------------------------------------------- |
| Se abre desde el menú lateral                    | `BaseModuloPage`                                            |
| Es un reporte del módulo Reportes DT             | `BaseReporteDTPage` (ya trae `panelFiltros` y `paginacion`) |
| No está en el menú (login, selección de empresa) | `BasePage`                                                  |

Crea `src/pages/modulos/reportes-dt/reporte.jornada.diaria.page.ts`:

```ts
import { Page, test } from "@playwright/test";
import { BaseReporteDTPage } from "@pages/modulos/reportes-dt/base.reporte.dt.page";
import { SelectorFecha } from "@helpers/selector.fecha.helper";
import { SelectorLista } from "@helpers/selector.lista.helper";
import { TablaRegistros } from "@helpers/tabla.registros.helper";
import { RUTAS_MENU } from "@config/rutas";

/** Posición de cada columna en la tabla del reporte (desde 0). */
const COLUMNAS_REPORTE = {
  fecha: 0,
  horasTrabajadas: 4,
} as const;

/** Filtros del reporte. El turno es opcional. */
export type FiltrosJornadaDiaria = {
  rut: string;
  fechaInicio: string;
  fechaTermino: string;
  turno?: string;
};

export class ReporteJornadaDiariaPage extends BaseReporteDTPage {
  protected readonly rutaMenu = RUTAS_MENU.REPORTE_JORNADA_DIARIA_DT;

  private readonly selectorRut: SelectorLista;
  private readonly selectorTurno: SelectorLista;
  private readonly campoFechaInicio: SelectorFecha;
  private readonly campoFechaTermino: SelectorFecha;
  private readonly registros: TablaRegistros;

  constructor(page: Page) {
    super(page);
    // Los id salen del HTML de la pantalla (DevTools o `npx playwright codegen`)
    this.selectorRut = new SelectorLista(page, "identification");
    this.selectorTurno = new SelectorLista(page, "shift");
    this.campoFechaInicio = new SelectorFecha(page, "startDate");
    this.campoFechaTermino = new SelectorFecha(page, "endDate");
    this.registros = new TablaRegistros(page.locator("table"));
  }

  async ingresarRut(rut: string): Promise<void> {
    await test.step(`Ingresar RUT ${rut}`, async () => {
      await this.selectorRut.seleccionarPorTexto(rut);
    });
  }

  async seleccionarTurno(turno: string): Promise<void> {
    await test.step(`Seleccionar turno ${turno}`, async () => {
      await this.selectorTurno.seleccionarPorTexto(turno);
    });
  }

  async ingresarFechaInicio(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de inicio ${fecha}`, async () => {
      await this.campoFechaInicio.ingresarFecha(fecha);
    });
  }

  async ingresarFechaTermino(fecha: string): Promise<void> {
    await test.step(`Ingresar fecha de término ${fecha}`, async () => {
      await this.campoFechaTermino.ingresarFecha(fecha);
    });
  }

  /** Llena los filtros obligatorios y los opcionales que vengan. No pulsa Buscar: eso lo hace el spec. */
  async filtrar(filtros: FiltrosJornadaDiaria): Promise<void> {
    await test.step("Filtrar el reporte de jornada diaria", async () => {
      await this.ingresarRut(filtros.rut);
      await this.ingresarFechaInicio(filtros.fechaInicio);
      await this.ingresarFechaTermino(filtros.fechaTermino);
      if (filtros.turno !== undefined) {
        await this.seleccionarTurno(filtros.turno);
      }
    });
  }

  /** Horas trabajadas del día indicado (`dd-mm-aaaa`). */
  async obtenerHorasTrabajadas(fecha: string): Promise<string> {
    return await test.step(`Obtener las horas trabajadas del ${fecha}`, async () => {
      if (!(await this.registros.tieneFilas())) {
        throw new Error("El reporte de jornada diaria no tiene registros en el rango buscado");
      }
      const fechas = await this.registros.leerColumna(COLUMNAS_REPORTE.fecha);
      const indiceFila = fechas.indexOf(fecha);
      if (indiceFila === -1) {
        throw new Error(
          `El reporte no tiene una fila del ${fecha}. Fechas encontradas: [${fechas.join(", ")}]`,
        );
      }
      return await this.registros.leerCelda(indiceFila, COLUMNAS_REPORTE.horasTrabajadas);
    });
  }
}
```

Fíjate en:

- `rutaMenu` es lo único que hace falta para heredar `navegar()`.
- Cada filtro tiene su método individual y `filtrar()` los encadena; el `if` del opcional vive aquí, no en el spec.
- `obtenerHorasTrabajadas()` no tiene aserciones: devuelve el dato, y si no lo encuentra lanza un error que dice qué sí había.
- Si la pantalla consulta un reporte pesado, pásale la ruta del backend a `PanelFiltros` como hace `MarcasRechazadasPage` (`new PanelFiltros(page, RUTAS_API.<reporte>)`) y agrega esa ruta a `RUTAS_API`.

**3. Fixture.** Regístralo en el fixture de su módulo, `src/fixtures/modulos/reportes.dt.fixture.ts`:

```ts
import { test as base } from "@fixtures/base.fixture";
import { ReporteAsistenciaPage } from "@pages/modulos/reportes-dt/reporte.asistencia.page";
import { ReporteJornadaDiariaPage } from "@pages/modulos/reportes-dt/reporte.jornada.diaria.page";

/** Páginas del módulo "Reportes DT". Agrega aquí cada nuevo reporte del módulo. */
export type ReportesDTFixtures = {
  reporteAsistencia: ReporteAsistenciaPage;
  reporteJornadaDiaria: ReporteJornadaDiariaPage;
};

export const test = base.extend<ReportesDTFixtures>({
  reporteAsistencia: async ({ page }, use) => {
    await use(new ReporteAsistenciaPage(page));
  },
  reporteJornadaDiaria: async ({ page }, use) => {
    await use(new ReporteJornadaDiariaPage(page));
  },
});
```

El nombre de la propiedad (`reporteJornadaDiaria`) es el que pedirá el test entre llaves.

**4. Datos.** Crea `src/data/reportes-dt/reporte.jornada.diaria.json`, con un bloque por caso:

```json
{
  "cp01": {
    "filtros": {
      "rut": "12345678",
      "fechaInicio": "03-11-2026",
      "fechaTermino": "07-11-2026"
    },
    "fecha": "04-11-2026",
    "horasEsperadas": "09:00"
  }
}
```

**5. Spec.** Crea `tests/e2e/reportes-dt/reporte-jornada-diaria/CP01-horas-trabajadas.spec.ts`:

```ts
import datos from "@data/reportes-dt/reporte.jornada.diaria.json";
import { expect, test } from "@fixtures";

const datosPrueba = datos.cp01;

test.describe("Reporte Jornada Diaria DT - Horas trabajadas", { tag: "@regresion" }, () => {
  test("CP01 - Las horas trabajadas del día coinciden con la jornada", async ({ reporteJornadaDiaria }) => {
    await reporteJornadaDiaria.navegar();
    await reporteJornadaDiaria.filtrar(datosPrueba.filtros);
    await reporteJornadaDiaria.panelFiltros.buscar();

    const horas = await reporteJornadaDiaria.obtenerHorasTrabajadas(datosPrueba.fecha);

    await test.step("Validar las horas trabajadas del día", () => {
      expect(
        horas,
        `Se esperaban ${datosPrueba.horasEsperadas} horas trabajadas el ${datosPrueba.fecha}, pero el reporte muestra ${horas}`,
      ).toBe(datosPrueba.horasEsperadas);
    });
  });
});
```

**6. Córrelo y valida**, como en los pasos 4 y 5 de la sección A.

## C. Un módulo nuevo

Ejemplo: el módulo **Operaciones**, con la pantalla "Órdenes de venta" (`RUTAS_MENU.OPERACIONES_ORDENES_VENTA`).

**1. Carpetas.** Crea las tres con el mismo nombre de módulo:

```text
src/pages/modulos/operaciones/
src/data/operaciones/
tests/e2e/operaciones/ordenes-venta/
```

**2. Fixture del módulo.** Crea `src/fixtures/modulos/operaciones.fixture.ts`:

```ts
import { test as base } from "@fixtures/base.fixture";
import { OrdenesVentaPage } from "@pages/modulos/operaciones/ordenes.venta.page";

/** Páginas del módulo "Operaciones". */
export type OperacionesFixtures = {
  ordenesVenta: OrdenesVentaPage;
};

export const test = base.extend<OperacionesFixtures>({
  ordenesVenta: async ({ page }, use) => {
    await use(new OrdenesVentaPage(page));
  },
});
```

**3. Súmalo a `mergeTests`** en `src/fixtures/index.ts`, sin quitar los módulos que ya están:

```ts
import { test as operacionesTest } from "@fixtures/modulos/operaciones.fixture";

export const test = mergeTests(asistenciaTest, reportesDTTest, operacionesTest);
```

**4. Sigue los pasos de la sección B** para la página, los datos y el spec.

## Checklist antes de abrir el PR

- [ ] `npm run validar` pasa.
- [ ] El spec pasa solo y también con la suite completa.
- [ ] Archivo `CPnn-descripcion.spec.ts`, título `CPnn - ...` y un tag en el `describe`.
- [ ] Datos en `src/data/<modulo>/<pantalla>.json`, sin credenciales ni datos sensibles.
- [ ] Sin selectores en el spec, sin `waitForTimeout`, `force` ni `test.only`.
- [ ] Cada aserción dice qué se esperaba y qué se encontró.
- [ ] Si agregaste una pantalla, su page object está registrado en el fixture del módulo.
