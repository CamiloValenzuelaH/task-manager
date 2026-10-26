import { RuleViolationError } from './errors';

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

/** R2: `endsOn ≤ endOfDayUTC(projectEndDate)`. */
export function isEndsOnWithinProject(endsOn: Date, projectEndDate: string): boolean {
  return endsOn.getTime() <= endOfDayUTC(projectEndDate).getTime();
}

/**
 * R2: lanza `ENDS_ON_AFTER_PROJECT_END` (422) si `endsOn` es posterior al
 * fin del día de `projectEndDate`. Aplica a un `ends_on` explícito (ADR-0003).
 */
export function assertEndsOnWithinProject(endsOn: Date, projectEndDate: string): void {
  if (!isEndsOnWithinProject(endsOn, projectEndDate)) {
    throw new RuleViolationError(
      'ENDS_ON_AFTER_PROJECT_END',
      'La fecha de fin de la tarea supera la fecha de fin del proyecto',
      {
        ends_on: endsOn.toISOString(),
        max_ends_on: endOfDayUTC(projectEndDate).toISOString(),
      },
    );
  }
}
