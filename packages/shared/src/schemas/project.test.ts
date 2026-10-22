import { describe, expect, it } from 'vitest';
import {
  createProjectInputSchema,
  projectListQuerySchema,
  projectSchema,
  setProjectTagsInputSchema,
  updateProjectInputSchema,
} from './project';

const PROJECT_ID = '9b2e7c1d-4a5f-4e8b-a3c6-7d8e9f0a1b2c';
const TAG_ID = '3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f';

const project = {
  id: PROJECT_ID,
  name: 'Lanzamiento',
  description: '',
  status: 'pending',
  start_date: '2026-11-01',
  end_date: '2026-11-30',
  tag_ids: [TAG_ID],
  created_at: '2026-10-22T10:00:00.000Z',
};

describe('projectSchema', () => {
  it('acepta un proyecto completo', () => {
    expect(projectSchema.parse(project)).toEqual(project);
  });

  it.each(['pending', 'completed'])('acepta el estado %s', (status) => {
    expect(projectSchema.safeParse({ ...project, status }).success).toBe(true);
  });

  it('rechaza un estado desconocido', () => {
    expect(projectSchema.safeParse({ ...project, status: 'in_progress' }).success).toBe(false);
  });

  it('rechaza fechas con hora en start_date y end_date', () => {
    expect(projectSchema.safeParse({ ...project, end_date: '2026-11-30T00:00:00Z' }).success).toBe(
      false,
    );
  });

  it('rechaza created_at sin zona UTC', () => {
    expect(projectSchema.safeParse({ ...project, created_at: '2026-10-22T10:00:00' }).success).toBe(
      false,
    );
  });
});

describe('createProjectInputSchema', () => {
  const input = { name: 'Lanzamiento', start_date: '2026-11-01', end_date: '2026-11-30' };

  it('ADR-0011: description es "" y tag_ids es [] si faltan', () => {
    expect(createProjectInputSchema.parse(input)).toEqual({
      ...input,
      description: '',
      tag_ids: [],
    });
  });

  it('acepta un name de 255 caracteres y rechaza 256', () => {
    expect(createProjectInputSchema.safeParse({ ...input, name: 'a'.repeat(255) }).success).toBe(
      true,
    );
    expect(createProjectInputSchema.safeParse({ ...input, name: 'a'.repeat(256) }).success).toBe(
      false,
    );
  });

  it('rechaza un name vacío', () => {
    expect(createProjectInputSchema.safeParse({ ...input, name: ' ' }).success).toBe(false);
  });

  it('exige start_date y end_date', () => {
    expect(createProjectInputSchema.safeParse({ name: 'Lanzamiento' }).success).toBe(false);
  });

  it('rechaza una fecha inexistente', () => {
    expect(createProjectInputSchema.safeParse({ ...input, end_date: '2026-02-30' }).success).toBe(
      false,
    );
  });

  it('ADR-0006: start_date > end_date no es error de formato (se valida como regla, 422)', () => {
    expect(createProjectInputSchema.safeParse({ ...input, start_date: '2026-12-01' }).success).toBe(
      true,
    );
  });

  it('rechaza tag_ids que no son uuid', () => {
    expect(createProjectInputSchema.safeParse({ ...input, tag_ids: ['x'] }).success).toBe(false);
  });
});

describe('updateProjectInputSchema', () => {
  it('no rellena valores por defecto en un PATCH parcial', () => {
    expect(updateProjectInputSchema.parse({ name: 'Nuevo' })).toEqual({ name: 'Nuevo' });
  });

  it('ADR-0007: ignora status (solo cambia con /complete y /reopen)', () => {
    expect(updateProjectInputSchema.parse({ status: 'completed' })).toEqual({});
  });
});

describe('setProjectTagsInputSchema y projectListQuerySchema', () => {
  it('PUT /projects/:id/tags exige tag_ids', () => {
    expect(setProjectTagsInputSchema.safeParse({}).success).toBe(false);
    expect(setProjectTagsInputSchema.parse({ tag_ids: [] })).toEqual({ tag_ids: [] });
  });

  it('el filtro status es opcional y se valida', () => {
    expect(projectListQuerySchema.parse({})).toEqual({});
    expect(projectListQuerySchema.safeParse({ status: 'x' }).success).toBe(false);
  });
});
