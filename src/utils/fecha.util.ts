type PartesFecha = { dia: string; mes: string; anio: string };

function separarFecha(fecha: string): PartesFecha {
  // La hora, si viene (`24-10-2026 08:32:00`), se descarta: solo importan los 10 primeros caracteres
  const [dia, mes, anio] = fecha.trim().slice(0, 10).split("-");
  if (!dia || !mes || !anio) throw new Error(`La fecha '${fecha}' no tiene el formato dd-mm-aaaa`);
  return { dia, mes, anio };
}

function convertirHoraAMinutos(hora: string): number {
  const [horas, minutos] = hora.trim().split(":");
  if (!horas || !minutos) throw new Error(`La hora '${hora}' no tiene el formato hh:mm`);
  return Number(horas) * 60 + Number(minutos);
}

/** Convierte `dd-mm-aaaa` a `aaaa-mm-dd`, formato que además se puede comparar como texto. */
export function convertirFechaAIso(fecha: string): string {
  const { dia, mes, anio } = separarFecha(fecha);
  return `${anio}-${mes}-${dia}`;
}

/** Indica si la fecha cae entre inicio y término (ambos inclusive). Un término vacío es vigencia abierta. */
export function estaFechaEnRango(fecha: string, inicio: string, termino: string): boolean {
  const fechaIso = convertirFechaAIso(fecha);
  const desdeInicio = fechaIso >= convertirFechaAIso(inicio);
  const hastaTermino = termino.trim() === "" || fechaIso <= convertirFechaAIso(termino);
  return desdeInicio && hastaTermino;
}

/** Indica si la hora (`hh:mm` o `hh:mm:ss`) está dentro de alguno de los horarios `hh:mm-hh:mm`. */
export function estaHoraEnAlgunHorario(hora: string, horarios: readonly string[]): boolean {
  const minutosMarca = convertirHoraAMinutos(hora);
  return horarios.some((horario) => {
    const [desde, hasta] = horario.split("-");
    if (!desde || !hasta) throw new Error(`El horario '${horario}' no tiene el formato hh:mm-hh:mm`);
    return minutosMarca >= convertirHoraAMinutos(desde) && minutosMarca <= convertirHoraAMinutos(hasta);
  });
}
