import { z } from 'zod';

/** Identificador uuid v4 de cualquier entidad. */
export const idSchema = z.uuidv4();

/** Fecha ISO 8601 sin hora (`YYYY-MM-DD`): `start_date`, `end_date`. */
export const isoDateSchema = z.iso.date();

/** Fecha y hora ISO 8601 en UTC (sufijo `Z`): `created_at`, `ends_on`. */
export const isoDateTimeSchema = z.iso.datetime();

export const tagIdsSchema = z.array(idSchema);

/** Texto largo opcional; en la respuesta siempre es string (ADR-0011). */
export const descriptionSchema = z.string();

/** Nombre o título de hasta 255 caracteres (spec: `max 255`). */
export const titleSchema = z.string().trim().min(1).max(255);
