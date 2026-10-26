import { z } from 'zod';
import { idSchema } from './common';

// ADR-0011: nombre de 1 a 50 caracteres y color hex #RRGGBB.
export const TAG_NAME_MAX = 50;
export const tagNameSchema = z.string().trim().min(1).max(TAG_NAME_MAX);
export const tagColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hex #RRGGBB');

export const tagSchema = z.object({
  id: idSchema,
  name: tagNameSchema,
  color: tagColorSchema.optional(),
});

/** `POST /tags` y `POST /projects/:id/tags`. */
export const createTagInputSchema = z.object({
  name: tagNameSchema,
  color: tagColorSchema.optional(),
});

/** `PATCH /tags/:id`. */
export const updateTagInputSchema = createTagInputSchema.partial();

export type Tag = z.infer<typeof tagSchema>;
export type CreateTagInput = z.infer<typeof createTagInputSchema>;
export type UpdateTagInput = z.infer<typeof updateTagInputSchema>;
