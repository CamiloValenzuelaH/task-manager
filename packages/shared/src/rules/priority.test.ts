import { describe, expect, it } from 'vitest';
import { PRIORITY_DAYS, suggestEndsOn } from './priority';

const createdAt = new Date('2026-10-22T10:30:15.123Z');
const FAR_END_DATE = '2026-12-31';

describe('R3 PRIORITY_DAYS', () => {
  it('low 4, medium 3, high 2, urgent 1', () => {
    expect(PRIORITY_DAYS).toEqual({ low: 4, medium: 3, high: 2, urgent: 1 });
  });
});

describe('R3 suggestEndsOn', () => {
  it.each([
    ['low', '2026-10-26T10:30:15.123Z'],
    ['medium', '2026-10-25T10:30:15.123Z'],
    ['high', '2026-10-24T10:30:15.123Z'],
    ['urgent', '2026-10-23T10:30:15.123Z'],
  ] as const)('R3: prioridad %s → created_at + días (%s)', (priority, expected) => {
    const endsOn = suggestEndsOn({ createdAt, priority, projectEndDate: FAR_END_DATE });

    expect(endsOn.toISOString()).toBe(expected);
  });

  it('R3: cuenta días de 24 h en UTC aunque cambie de mes y de año', () => {
    const endsOn = suggestEndsOn({
      createdAt: new Date('2026-12-30T22:00:00.000Z'),
      priority: 'medium',
      projectEndDate: '2027-01-31',
    });

    expect(endsOn.toISOString()).toBe('2027-01-02T22:00:00.000Z');
  });

  it('R3: no modifica la fecha createdAt recibida', () => {
    const input = new Date(createdAt);

    suggestEndsOn({ createdAt: input, priority: 'low', projectEndDate: FAR_END_DATE });

    expect(input.toISOString()).toBe(createdAt.toISOString());
  });
});

describe('ADR-0003 recorte de la fecha sugerida', () => {
  it('ADR-0003: recorta a end_date 23:59:59.999 UTC si la sugerencia lo supera', () => {
    const endsOn = suggestEndsOn({ createdAt, priority: 'low', projectEndDate: '2026-10-24' });

    expect(endsOn.toISOString()).toBe('2026-10-24T23:59:59.999Z');
  });

  it('ADR-0003: no recorta si la sugerencia cae dentro del último día', () => {
    const endsOn = suggestEndsOn({ createdAt, priority: 'urgent', projectEndDate: '2026-10-23' });

    expect(endsOn.toISOString()).toBe('2026-10-23T10:30:15.123Z');
  });

  it('ADR-0003: una sugerencia exactamente en el límite se mantiene', () => {
    const endsOn = suggestEndsOn({
      createdAt: new Date('2026-10-22T23:59:59.999Z'),
      priority: 'urgent',
      projectEndDate: '2026-10-23',
    });

    expect(endsOn.toISOString()).toBe('2026-10-23T23:59:59.999Z');
  });

  it('ADR-0003: 1 ms después del límite se recorta', () => {
    const endsOn = suggestEndsOn({
      createdAt: new Date('2026-10-23T00:00:00.000Z'),
      priority: 'urgent',
      projectEndDate: '2026-10-23',
    });

    expect(endsOn.toISOString()).toBe('2026-10-23T23:59:59.999Z');
  });

  it('ADR-0003: si la tarea se crea el último día del proyecto, vence ese mismo día', () => {
    const endsOn = suggestEndsOn({ createdAt, priority: 'high', projectEndDate: '2026-10-22' });

    expect(endsOn.toISOString()).toBe('2026-10-22T23:59:59.999Z');
  });
});
