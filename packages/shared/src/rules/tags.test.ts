import { describe, expect, it } from 'vitest';
import { RuleViolationError } from './errors';
import { assertTagsInProject, findTagsNotInProject, isTagsInProject } from './tags';

const TAG_A = '6f1c2a3e-1b2c-4d5e-8f90-a1b2c3d4e5f6';
const TAG_B = '0a9b8c7d-6e5f-4a3b-9c2d-1e0f9a8b7c6d';
const TAG_OTHER = 'c3d4e5f6-a7b8-4c9d-8e0f-1a2b3c4d5e6f';
const TAG_UNKNOWN = 'ffffffff-ffff-4fff-bfff-ffffffffffff';
const PROJECT_TAGS = [TAG_A, TAG_B];

describe('R1 tags de la tarea dentro del proyecto', () => {
  it('R1: una lista vacía es válida', () => {
    expect(isTagsInProject([], PROJECT_TAGS)).toBe(true);
    expect(() => {
      assertTagsInProject([], PROJECT_TAGS);
    }).not.toThrow();
  });

  it('R1: es válido si todos los tags están en el proyecto', () => {
    expect(isTagsInProject([TAG_B, TAG_A], PROJECT_TAGS)).toBe(true);
  });

  it('R1: es inválido si un tag es válido y otro no', () => {
    expect(isTagsInProject([TAG_A, TAG_OTHER], PROJECT_TAGS)).toBe(false);
    expect(() => {
      assertTagsInProject([TAG_A, TAG_OTHER], PROJECT_TAGS);
    }).toThrow(RuleViolationError);
  });

  it('R1: un tag inexistente o de otro proyecto es inválido', () => {
    expect(findTagsNotInProject([TAG_UNKNOWN, TAG_OTHER], PROJECT_TAGS)).toEqual([
      TAG_UNKNOWN,
      TAG_OTHER,
    ]);
  });

  it('R1: en un proyecto sin tags solo vale la lista vacía', () => {
    expect(isTagsInProject([], [])).toBe(true);
    expect(isTagsInProject([TAG_A], [])).toBe(false);
  });

  it('R1: los ids inválidos se devuelven sin duplicados y en orden', () => {
    expect(findTagsNotInProject([TAG_OTHER, TAG_A, TAG_UNKNOWN, TAG_OTHER], PROJECT_TAGS)).toEqual([
      TAG_OTHER,
      TAG_UNKNOWN,
    ]);
  });

  it('R1: el error lleva el código 422 y los ids inválidos en details', () => {
    expect(() => {
      assertTagsInProject([TAG_A, TAG_OTHER], PROJECT_TAGS);
    }).toThrow(
      expect.objectContaining({
        code: 'TAG_NOT_IN_PROJECT',
        details: { invalid_tag_ids: [TAG_OTHER] },
      }),
    );
  });
});
