/**
 * Último instante (23:59:59.999 UTC) de una fecha `YYYY-MM-DD`.
 * Límite de `ends_on` frente a `project.end_date` (R2, ADR-0003).
 */
export function endOfDayUTC(date: string): Date {
  const end = new Date(`${date}T23:59:59.999Z`);
  if (Number.isNaN(end.getTime())) {
    throw new RangeError(`Fecha inválida: ${date}`);
  }
  return end;
}
