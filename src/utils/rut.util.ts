/** Calcula el dígito verificador de un RUT. */
export function calcularDigitoVerificador(cuerpo: number): string {
  let suma = 0;
  let multiplicador = 2;
  for (const digito of String(cuerpo).split("").reverse()) {
    suma += Number(digito) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  const resultado = 11 - (suma % 11);
  if (resultado === 11) return "0";
  if (resultado === 10) return "K";
  return String(resultado);
}

/** Genera un RUT aleatorio válido con formato `12.345.678-9`. */
export function generarRutValido(): string {
  const cuerpo = Math.floor(7_000_000 + Math.random() * 16_000_000);
  const cuerpoFormateado = cuerpo.toLocaleString("es-CL");
  return `${cuerpoFormateado}-${calcularDigitoVerificador(cuerpo)}`;
}

/** Valida si un RUT (con o sin puntos) es correcto. */
export function esRutValido(rut: string): boolean {
  const [cuerpo, digitoVerificador] = rut.replace(/\./g, "").split("-");
  if (!cuerpo || !digitoVerificador) return false;
  return calcularDigitoVerificador(Number(cuerpo)) === digitoVerificador.toUpperCase();
}
