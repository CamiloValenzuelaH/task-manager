import { z } from 'zod';
import {
  descriptionSchema,
  idSchema,
  isoDateSchema,
  isoDateTimeSchema,
  tagIdsSchema,
  titleSchema,
} from './common';

export const PROJECT_STATUSES = ['pending', 'completed'] as const;
export const projectStatusSchema = z.enum(PROJECT_STATUSES);

export const projectSchema = z.object({
  id: idSchema,
  name: titleSchema,
  description: descriptionSchema,
  status: projectStatusSchema,
  start_date: isoDateSchema,
  end_date: isoDateSchema,
  tag_ids: tagIdsSchema,
  created_at: isoDateTimeSchema,
});

// Campos editables, sin valores por defecto: la base del PATCH no debe rellenar nada.
// `status` solo cambia con /complete y /reopen (ADR-0007).
// `start_date ≤ end_date` es regla de negocio (422, ADR-0006), no de formato.
const projectFieldsSchema = z.object({
  name: titleSchema,
  description: descriptionSchema,
  start_date: isoDateSchema,
  end_date: isoDateSchema,
  tag_ids: tagIdsSchema,
});

/** `POST /projects`. */
export const createProjectInputSchema = projectFieldsSchema.extend({
  description: descriptionSchema.default(''),
  tag_ids: tagIdsSchema.default([]),
});

/** `PATCH /projects/:id`. */
export const updateProjectInputSchema = projectFieldsSchema.partial();

/** `PUT /projects/:id/tags`. */
export const setProjectTagsInputSchema = z.object({ tag_ids: tagIdsSchema });

/** `GET /projects?status=`. */
export const projectListQuerySchema = z.object({ status: projectStatusSchema.optional() });

export type ProjectStatus = z.infer<typeof projectStatusSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;
export type SetProjectTagsInput = z.infer<typeof setProjectTagsInputSchema>;
export type ProjectListQuery = z.infer<typeof projectListQuerySchema>;
