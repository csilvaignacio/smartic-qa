/** Escapa los caracteres especiales para usar el texto literal dentro de un `RegExp` (p. ej. el punto de "LOCAL.ESTAB.FAENA"). */
export function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Expresión que calza el texto completo de un elemento, ignorando espacios alrededor y mayúsculas. */
export function textoExacto(texto: string): RegExp {
  return new RegExp(`^\\s*${escaparRegex(texto)}\\s*$`, "i");
}
