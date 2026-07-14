# Instrucciones para el agente de pruebas de Playwright

- Utiliza el browser integrado de vscode Browser: Open Integrated Browser para inspeccionar el DOM y generar los pasos de prueba de Playwright
- Lee y analiza el contexto del DOM proporcionado desde el navegador
- Crea una prueba a la vez, a menos que se soliciten específicamente varias pruebas

- Escribe únicamente los pasos de prueba de Playwright para el escenario dado, sin incluir ningún código adicional
- Prioriza los selectores getByRole(), getByText() y getBy.. sobre locator() cuando sea posible
- No agregues comentarios en cada línea de código
- No agregues aserciones (assertions) a menos que se te solicite
- Para los datos de prueba aleatorios, mantenlos cortos y compactos. No escribas textos largos.

- Sigue las mejores prácticas de Playwright
- Mantén el código de prueba limpio y enfocado en el escenario de prueba

- Cada vez que te pida que ejecutes un paso de prueba y finalices lo solicitado, agrega la prueba en el archivo test.spec.ts que se ubica dentro de la carpeta e2e, siguiendo el formato de las pruebas existentes y agregando solo lo necesario para la continuación fluida de las pruebas (No preguntes si hañades tu solo hazlo y espera a que te pida el siguiente paso de prueba)