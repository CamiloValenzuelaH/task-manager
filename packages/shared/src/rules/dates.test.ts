import { describe, expect, it } from 'vitest';
import { assertEndsOnWithinProject, endOfDayUTC, isEndsOnWithinProject } from './dates';
import { RuleViolationError } from './errors';

describe('endOfDayUTC', () => {
  it('devuelve 23:59:59.999 UTC del día', () => {
    expect(endOfDayUTC('2026-11-30').toISOString()).toBe('2026-11-30T23:59:59.999Z');
  });

  it('funciona en el 29 de febrero de un año bisiesto', () => {
    expect(endOfDayUTC('2028-02-29').toISOString()).toBe('2028-02-29T23:59:59.999Z');
  });

  it.each(['', '2026-13-01', 'mañana'])('lanza RangeError con %j', (date) => {
    expect(() => endOfDayUTC(date)).toThrow(RangeError);
  });
});

describe('R2 ends_on límite', () => {
  const END_DATE = '2026-11-30';

  it('R2: es válido exactamente en end_date 23:59:59.999Z', () => {
    const endsOn = new Date('2026-11-30T23:59:59.999Z');

    expect(isEndsOnWithinProject(endsOn, END_DATE)).toBe(true);
    expect(() => {
      assertEndsOnWithinProject(endsOn, END_DATE);
    }).not.toThrow();
  });

  it('R2: es inválido 1 ms después del fin del día', () => {
    const endsOn = new Date('2026-12-01T00:00:00.000Z');

    expect(isEndsOnWithinProject(endsOn, END_DATE)).toBe(false);
    expect(() => {
      assertEndsOnWithinProject(endsOn, END_DATE);
    }).toThrow(RuleViolationError);
  });

  it('R2: cualquier hora del último día es válida', () => {
    expect(isEndsOnWithinProject(new Date('2026-11-30T00:00:00.000Z'), END_DATE)).toBe(true);
    expect(isEndsOnWithinProject(new Date('2026-11-30T12:00:00.000Z'), END_DATE)).toBe(true);
  });

  it('R2: una fecha anterior al proyecto no es asunto de R2', () => {
    expect(isEndsOnWithinProject(new Date('2020-01-01T00:00:00.000Z'), END_DATE)).toBe(true);
  });

  it('R2: compara en UTC aunque el instante venga de una hora con offset', () => {
    // 2026-11-30T20:00-05:00 = 2026-12-01T01:00Z → ya es el día siguiente en UTC.
    expect(isEndsOnWithinProject(new Date('2026-11-30T20:00:00-05:00'), END_DATE)).toBe(false);
    // 2026-12-01T01:00+02:00 = 2026-11-30T23:00Z → aún es el último día en UTC.
    expect(isEndsOnWithinProject(new Date('2026-12-01T01:00:00+02:00'), END_DATE)).toBe(true);
  });

  it('R2: el error lleva el código 422 y el límite en details', () => {
    const endsOn = new Date('2026-12-05T10:00:00.000Z');

    expect(() => {
      assertEndsOnWithinProject(endsOn, END_DATE);
    }).toThrow(
      expect.objectContaining({
        code: 'ENDS_ON_AFTER_PROJECT_END',
        details: {
          ends_on: '2026-12-05T10:00:00.000Z',
          max_ends_on: '2026-11-30T23:59:59.999Z',
        },
      }),
    );
  });
});
