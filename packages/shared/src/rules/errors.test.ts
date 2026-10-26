import { describe, expect, it } from 'vitest';
import { RuleViolationError } from './errors';

describe('RuleViolationError', () => {
  it('expone code, message y details y es un Error', () => {
    const error = new RuleViolationError('TAG_NOT_IN_PROJECT', 'Tag fuera del proyecto', {
      tag_ids: ['x'],
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('RuleViolationError');
    expect(error.code).toBe('TAG_NOT_IN_PROJECT');
    expect(error.message).toBe('Tag fuera del proyecto');
    expect(error.details).toEqual({ tag_ids: ['x'] });
  });

  it('details es {} por defecto', () => {
    expect(new RuleViolationError('INVALID_DATE_RANGE', 'Rango inválido').details).toEqual({});
  });
});
