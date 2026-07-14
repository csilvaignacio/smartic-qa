//calcula el dígito verificador de un RUT 
export function computeDv(body: number): string {
  let sum = 0, mul = 2;
  for (const d of String(body).split("").reverse()) {
    sum += Number(d) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  return res === 11 ? "0" : res === 10 ? "K" : String(res);
}

//genera un RUT aleatorio válido
export function generateValidRut(): string {
  const body = Math.floor(7_000_000 + Math.random() * 16_000_000);
  const formatted = body.toLocaleString("es-CL");
  return `${formatted}-${computeDv(body)}`;
}

//valida si un RUT es correcto
export function isValidRut(rut: string): boolean {
  const [body, dv] = rut.replace(/\./g, "").split("-");
  return computeDv(Number(body)) === dv.toUpperCase();
}