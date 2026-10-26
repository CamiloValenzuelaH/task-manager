import type { TaskPriority } from '../schemas/task';
import { endOfDayUTC } from './dates';

const DAY_MS = 24 * 60 * 60 * 1000;

/** R3: días desde `created_at` hasta el `ends_on` sugerido. */
export const PRIORITY_DAYS: Readonly<Record<TaskPriority, number>> = {
  low: 4,
  medium: 3,
  high: 2,
  urgent: 1,
};

export interface SuggestEndsOnParams {
  createdAt: Date;
  priority: TaskPriority;
  /** `project.end_date` en formato `YYYY-MM-DD`. */
  projectEndDate: string;
}

/**
 * R3: `ends_on` sugerido = `createdAt` + `PRIORITY_DAYS[priority]` días.
 * Si supera el fin del día de `projectEndDate`, se recorta a ese límite (ADR-0003).
 * Solo se usa al crear una tarea sin `ends_on` (ADR-0002, ADR-0008).
 */
export function suggestEndsOn({ createdAt, priority, projectEndDate }: SuggestEndsOnParams): Date {
  const suggested = createdAt.getTime() + PRIORITY_DAYS[priority] * DAY_MS;
  const limit = endOfDayUTC(projectEndDate).getTime();
  return new Date(Math.min(suggested, limit));
}
