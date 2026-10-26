import { RuleViolationError } from './errors';

/**
 * R1: ids de `taskTagIds` que no están en `projectTagIds`, sin duplicados y
 * en el orden recibido. Un tag inexistente tampoco está en el proyecto.
 */
export function findTagsNotInProject(
  taskTagIds: readonly string[],
  projectTagIds: readonly string[],
): string[] {
  const allowed = new Set(projectTagIds);
  return [...new Set(taskTagIds)].filter((id) => !allowed.has(id));
}

/** R1: `taskTagIds ⊆ projectTagIds`. */
export function isTagsInProject(
  taskTagIds: readonly string[],
  projectTagIds: readonly string[],
): boolean {
  return findTagsNotInProject(taskTagIds, projectTagIds).length === 0;
}

/**
 * R1: lanza `TAG_NOT_IN_PROJECT` (422) si algún tag de la tarea no está en el
 * proyecto, con los ids inválidos en `details.invalid_tag_ids`.
 */
export function assertTagsInProject(
  taskTagIds: readonly string[],
  projectTagIds: readonly string[],
): void {
  const invalidTagIds = findTagsNotInProject(taskTagIds, projectTagIds);
  if (invalidTagIds.length > 0) {
    throw new RuleViolationError(
      'TAG_NOT_IN_PROJECT',
      'Algunos tags de la tarea no están asociados al proyecto',
      { invalid_tag_ids: invalidTagIds },
    );
  }
}
