import { describe, expect, it } from 'vitest';
import { createTagInputSchema, tagSchema, updateTagInputSchema } from './tag';

const TAG_ID = '3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f';

describe('tagSchema', () => {
  it('acepta un tag completo', () => {
    const tag = { id: TAG_ID, name: 'backend', color: '#FF5733' };

    expect(tagSchema.parse(tag)).toEqual(tag);
  });

  it('acepta un tag sin color', () => {
    expect(tagSchema.parse({ id: TAG_ID, name: 'backend' })).toEqual({
      id: TAG_ID,
      name: 'backend',
    });
  });

  it('rechaza un id que no es uuid v4', () => {
    expect(tagSchema.safeParse({ id: 'abc', name: 'backend' }).success).toBe(false);
  });
});

describe('ADR-0011 nombre y color del tag', () => {
  it('quita los espacios del nombre', () => {
    expect(createTagInputSchema.parse({ name: '  ui  ' })).toEqual({ name: 'ui' });
  });

  it('rechaza un nombre vacío o solo con espacios', () => {
    expect(createTagInputSchema.safeParse({ name: '' }).success).toBe(false);
    expect(createTagInputSchema.safeParse({ name: '   ' }).success).toBe(false);
  });

  it('acepta 50 caracteres y rechaza 51', () => {
    expect(createTagInputSchema.safeParse({ name: 'a'.repeat(50) }).success).toBe(true);
    expect(createTagInputSchema.safeParse({ name: 'a'.repeat(51) }).success).toBe(false);
  });

  it.each(['#FF5733', '#ff5733', '#000000'])('acepta el color %s', (color) => {
    expect(createTagInputSchema.safeParse({ name: 'ui', color }).success).toBe(true);
  });

  it.each(['FF5733', '#F53', '#FF57331', '#GG5733', 'red', ''])('rechaza el color %j', (color) => {
    expect(createTagInputSchema.safeParse({ name: 'ui', color }).success).toBe(false);
  });
});

describe('updateTagInputSchema', () => {
  it('acepta un body vacío y campos sueltos', () => {
    expect(updateTagInputSchema.parse({})).toEqual({});
    expect(updateTagInputSchema.parse({ color: '#00FF00' })).toEqual({ color: '#00FF00' });
  });

  it('valida los campos presentes', () => {
    expect(updateTagInputSchema.safeParse({ name: '' }).success).toBe(false);
  });
});
