import { describe, expect, it } from 'vitest';
import {
  createTaskInputSchema,
  taskListQuerySchema,
  taskSchema,
  updateTaskInputSchema,
  updateTaskStatusInputSchema,
} from './task';

const TASK_ID = '5c6d7e8f-9a0b-4c1d-8e2f-3a4b5c6d7e8f';
const PROJECT_ID = '9b2e7c1d-4a5f-4e8b-a3c6-7d8e9f0a1b2c';
const TAG_ID = '3f1c2a4e-8b7d-4c6a-9e2f-1a2b3c4d5e6f';

const task = {
  id: TASK_ID,
  project_id: PROJECT_ID,
  title: 'Escribir el README',
  description: 'Instalación y comandos',
  status: 'in_progress',
  priority: 'high',
  tag_ids: [TAG_ID],
  created_at: '2026-10-22T10:00:00.000Z',
  ends_on: '2026-10-24T10:00:00.000Z',
};

describe('taskSchema', () => {
  it('acepta una tarea completa', () => {
    expect(taskSchema.parse(task)).toEqual(task);
  });

  it.each(['pending', 'in_progress', 'completed'])('acepta el estado %s', (status) => {
    expect(taskSchema.safeParse({ ...task, status }).success).toBe(true);
  });

  it.each(['low', 'medium', 'high', 'urgent'])('acepta la prioridad %s', (priority) => {
    expect(taskSchema.safeParse({ ...task, priority }).success).toBe(true);
  });

  it('rechaza estados y prioridades desconocidos', () => {
    expect(taskSchema.safeParse({ ...task, status: 'done' }).success).toBe(false);
    expect(taskSchema.safeParse({ ...task, priority: 'critical' }).success).toBe(false);
  });

  it('en la respuesta ends_on es obligatorio (ADR-0002)', () => {
    const { ends_on: _omitted, ...withoutEndsOn } = task;

    expect(taskSchema.safeParse(withoutEndsOn).success).toBe(false);
  });

  it('rechaza ends_on sin zona UTC o con offset', () => {
    expect(taskSchema.safeParse({ ...task, ends_on: '2026-10-24T10:00:00' }).success).toBe(false);
    expect(taskSchema.safeParse({ ...task, ends_on: '2026-10-24T10:00:00+02:00' }).success).toBe(
      false,
    );
  });
});

describe('createTaskInputSchema', () => {
  const input = { title: 'Escribir el README', priority: 'medium' };

  it('ADR-0002: ends_on es opcional y no se rellena (lo calcula R3 en el service)', () => {
    const parsed = createTaskInputSchema.parse(input);

    expect(parsed.ends_on).toBeUndefined();
    expect('ends_on' in parsed).toBe(false);
  });

  it('ADR-0011: description es "", status es pending y tag_ids es [] si faltan', () => {
    expect(createTaskInputSchema.parse(input)).toEqual({
      ...input,
      description: '',
      status: 'pending',
      tag_ids: [],
    });
  });

  it('exige priority', () => {
    expect(createTaskInputSchema.safeParse({ title: 'x' }).success).toBe(false);
  });

  it('conserva un ends_on explícito', () => {
    const endsOn = '2026-10-30T23:59:59.999Z';

    expect(createTaskInputSchema.parse({ ...input, ends_on: endsOn }).ends_on).toBe(endsOn);
  });

  it('acepta un title de 255 caracteres y rechaza 256', () => {
    expect(createTaskInputSchema.safeParse({ ...input, title: 'a'.repeat(255) }).success).toBe(
      true,
    );
    expect(createTaskInputSchema.safeParse({ ...input, title: 'a'.repeat(256) }).success).toBe(
      false,
    );
  });
});

describe('updateTaskInputSchema', () => {
  it('ADR-0008: un PATCH de priority no añade ends_on', () => {
    expect(updateTaskInputSchema.parse({ priority: 'urgent' })).toEqual({ priority: 'urgent' });
  });

  it('no permite cambiar project_id', () => {
    expect(updateTaskInputSchema.parse({ project_id: PROJECT_ID })).toEqual({});
  });
});

describe('updateTaskStatusInputSchema y taskListQuerySchema', () => {
  it('PATCH /tasks/:id/status exige un estado válido', () => {
    expect(updateTaskStatusInputSchema.parse({ status: 'completed' })).toEqual({
      status: 'completed',
    });
    expect(updateTaskStatusInputSchema.safeParse({}).success).toBe(false);
  });

  it('los filtros son opcionales y se validan', () => {
    expect(taskListQuerySchema.parse({})).toEqual({});
    expect(taskListQuerySchema.parse({ priority: 'low', tag_id: TAG_ID })).toEqual({
      priority: 'low',
      tag_id: TAG_ID,
    });
    expect(taskListQuerySchema.safeParse({ tag_id: 'x' }).success).toBe(false);
  });
});
