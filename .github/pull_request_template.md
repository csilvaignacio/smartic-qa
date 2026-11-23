## Qué cambia

<!-- Una o dos líneas: qué caso, pantalla o mejora trae este PR. -->

## Cómo se probó

<!-- Comandos que corriste y su resultado, por ejemplo: npx playwright test tests/e2e/<modulo>/<pantalla>/ -->

## Checklist

- [ ] `npm run validar` pasa
- [ ] Los specs nuevos o modificados pasan solos y con la suite completa
- [ ] Specs con archivo `CPnn-descripcion.spec.ts`, título `CPnn - ...` y un tag por `describe`
- [ ] Datos de prueba en `src/data/<modulo>/`, sin credenciales ni datos sensibles
- [ ] Sin selectores en los specs y sin `waitForTimeout`, `force` ni `test.only`
- [ ] Las aserciones dicen qué se esperaba y qué se encontró
- [ ] Si se agregó una pantalla, su page object está registrado en el fixture del módulo
