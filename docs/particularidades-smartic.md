# Particularidades de SMARTIC

SMARTIC es una aplicación Angular con componentes Nebular (`nb-card`, `nb-menu`, `nb-datepicker`, `nb-toggle`), listas `ng-select` y FullCalendar. Lo que sigue explica varias decisiones del framework: antes de "simplificar" una espera o un selector, revisa si su motivo está aquí.

## Comportamientos que afectan a los tests

### Listas desplegables (`ng-select`)

- Se operan con `SelectorLista` (`@helpers/selector.lista.helper`) usando el `id` del control (`identification`, `shift`, `charge`...).
- La búsqueda de opciones es lenta y la lista se vuelve a pintar: el helper escribe y elige la opción dentro de un `toPass`, que reintenta hasta que queda una sola opción.

### Fechas (`nb-datepicker`)

- Se ingresan con `SelectorFecha`, en formato `dd-mm-aaaa`.
- `Escape` no cierra el calendario emergente y su overlay tapa el botón Buscar: el helper lo cierra con un clic en el encabezado de la tarjeta y confirma que el campo quedó con el valor.

### Backend lento en QA

- La misma consulta de un reporte puede tardar 3 s o más de 80 s.
- En reportes pesados el page object crea `new PanelFiltros(page, RUTAS_API.<reporte>)`. Así `panelFiltros.buscar()` espera la respuesta real del backend y, si el servidor falla, el error lo dice en vez de parecer "sin resultados".
- Los specs de esos reportes llevan `test.slow()` con un comentario que explica el motivo.

### Pantallas de edición

- La ficha, el calendario y el horario tardan más de 10 s en abrir cuando la suite corre en paralelo. Se esperan con `TIEMPOS_ESPERA.cargaEdicion`.

### Tablas

- Mientras cargan, o si están vacías, muestran una fila "No se encontraron registros".
- Se leen con `TablaRegistros`, que ignora esa fila. Llama a `tieneFilas()` antes de leer.

### Búsquedas por prefijo

- Buscar "1001" trae también "10010", "100101"... Por eso una fila se ubica siempre por la [celda exacta](convenciones.md#selectores).
- La Ficha Colaborador carga primero el listado completo: `buscarYEditarColaborador` abre la fila exacta y espera que la ficha termine de cargar.

### Menú lateral

- El sitio lo colapsa con ventanas pequeñas: por eso el viewport es fijo (1440x900) en `playwright.config.ts`. No cambiarlo por pantalla maximizada.
- Un segundo clic demasiado pronto cierra el grupo que se estaba abriendo: `MenuLateralComponent` solo hace clic si el grupo sigue cerrado (`aria-expanded`).

### Banner de cookies

- Puede tapar los botones del pie de página. Si bloquea un clic, se acepta en el componente correspondiente, nunca con `{ force: true }`.

### Datos compartidos

- QA es un ambiente compartido: otras personas crean y modifican datos. Si un caso deja de encontrar su dato (colaborador, marca, rango de fechas), revisa primero que siga existiendo.

## Cuando un test falla

### Cómo investigar

1. Abre el reporte: `npm run reporte:playwright`. Cada test fallido muestra captura, video y el paso (`test.step`) donde se detuvo.
2. Repite solo ese test con el navegador visible: `npx playwright test <ruta-del-spec> --headed`, o elígelo en el modo UI: `npm run test:ui`.
3. Para revisar cada acción con el DOM de ese momento, graba una traza: `npx playwright test <ruta-del-spec> --trace on`, y ábrela desde el reporte.

### Errores frecuentes

| Mensaje o síntoma                                                                          | Causa probable                                                             | Qué hacer                                                           |
| ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `Falta la variable de entorno: X (ambiente: qa)`                                           | No existe `.env.qa` o le falta esa variable                                | Copia `.env.example` a `.env.qa` y complétalo                       |
| Falla el proyecto `setup` (login o selección de empresa) y no corre ningún spec            | Credenciales o empresa incorrectas en `.env.qa`, o el ambiente no responde | Revisa `.env.qa` y abre la URL en el navegador                      |
| `La búsqueda (...) respondió con estado 500: el backend falló, no es un dato de la prueba` | Error del servidor de QA                                                   | No es un error del test: reintenta o avisa al equipo de desarrollo  |
| Timeout esperando la respuesta de una búsqueda                                             | Consulta muy pesada (rango de fechas amplio) o backend saturado            | Acota el rango de fechas en los datos de prueba                     |
| `El reporte no tiene marcas rechazadas con motivo ... Motivos encontrados: [...]`          | El dato de prueba ya no existe en QA                                       | Actualiza el JSON con un caso vigente                               |
| `... intercepts pointer events`                                                            | Algo tapa el elemento: un calendario abierto o el banner de cookies        | Cierra el overlay en el page object o componente, nunca con `force` |
| Pasa solo, pero falla con la suite completa                                                | Depende de lo que dejó otro test, o el backend se satura en paralelo       | Haz el caso independiente y usa las esperas de `TIEMPOS_ESPERA`     |
| El commit se detiene en `tsc --noEmit`                                                     | Error de tipos en cualquier archivo del proyecto, aunque no lo commitees   | Corrige el error: el typecheck revisa todo el proyecto              |
| `npm run validar` o CI fallan en `format:check`                                            | Archivos sin formatear con Prettier                                        | `npm run format` e instala las extensiones recomendadas de VS Code  |
