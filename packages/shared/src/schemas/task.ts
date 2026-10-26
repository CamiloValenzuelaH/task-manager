import { z } from 'zod';
import {
  descriptionSchema,
  idSchema,
  isoDateTimeSchema,
  tagIdsSchema,
  titleSchema,
} from './common';

export const TASK_STATUSES = ['pending', 'in_progress', 'completed'] as const;
export const taskStatusSchema = z.enum(TASK_STATUSES);

export const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const taskPrioritySchema = z.enum(TASK_PRIORITIES);

export const taskSchema = z.object({
  id: idSchema,
  project_id: idSchema,
  title: titleSchema,
  description: descriptionSchema,
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  tag_ids: tagIdsSchema,
  created_at: isoDateTimeSchema,
  ends_on: isoDateTimeSchema,
});

// Campos editables, sin valores por defecto (base del PATCH).
// R1 (tags del proyecto) y R2 (límite de fecha) se validan en las reglas, no aquí.
const taskFieldsSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  status: taskStatusSchema,
  priority: taskPrioritySchema,
  tag_ids: tagIdsSchema,
  ends_on: isoDateTimeSchema,
});

/** `POST /projects/:id/tasks`. Sin `ends_on`, el service lo calcula con R3 (ADR-0002). */
export const createTaskInputSchema = taskFieldsSchema.extend({
  description: descriptionSchema.default(''),
  status: taskStatusSchema.default('pending'),
  tag_ids: tagIdsSchema.default([]),
  ends_on: isoDateTimeSchema.optional(),
});

/** `PATCH /tasks/:id`. Cambiar `priority` no recalcula `ends_on` (ADR-0008). */
export const updateTaskInputSchema = taskFieldsSchema.partial();

/** `PATCH /tasks/:id/status`. */
export const updateTaskStatusInputSchema = z.object({ status: taskStatusSchema });

/** `GET /projects/:id/tasks?status=&priority=&tag_id=`. */
export const taskListQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  tag_id: idSchema.optional(),
});

export type TaskStatus = z.infer<typeof taskStatusSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type Task = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskInputSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskInputSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusInputSchema>;
export type TaskListQuery = z.infer<typeof taskListQuerySchema>;
