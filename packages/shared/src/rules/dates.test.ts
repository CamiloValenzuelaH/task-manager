import { describe, expect, it } from 'vitest';
import { endOfDayUTC } from './dates';

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
