---
name: domain-rules
description: Reglas de negocio del Task Tracker (tags por proyecto, límite de fecha, prioridad → fecha sugerida) y decisiones de los ADRs. Úsala siempre que crees o modifiques código o tests que toquen proyectos, tareas o tags.
---

# Reglas de dominio

Fuente: `vault/specs.md` y `vault/decisions/`. Si este archivo y el vault no coinciden, manda el vault: actualiza este archivo.

## Reglas del spec

| Id  | Regla                                                         | Implementación                                                             | Error                                             |
| --- | ------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- |
| R1  | `task.tag_ids ⊆ project.tag_ids`                              | `packages/shared/src/rules/tags.ts` → `assertTagsInProject`                | 422 `TAG_NOT_IN_PROJECT` (details: ids inválidos) |
| R2  | `task.ends_on ≤ endOfDayUTC(project.end_date)`                | `packages/shared/src/rules/dates.ts` → `assertEndsOnWithinProject`         | 422 `ENDS_ON_AFTER_PROJECT_END`                   |
| R3  | Sugerencia de `ends_on` = `created_at` + días según prioridad | `packages/shared/src/rules/priority.ts` → `PRIORITY_DAYS`, `suggestEndsOn` | —                                                 |

`PRIORITY_DAYS = { low: 4, medium: 3, high: 2, urgent: 1 }`

Las reglas lanzan `RuleViolationError(code, message, details)` (`packages/shared/src/rules/errors.ts`), sin dependencia de Fastify; el plugin de errores de la API lo traduce a 422. Cada `assert*` tiene una variante booleana (`isEndsOnWithinProject`) para la UI y para comprobaciones de servicio como ADR-0005.

## Decisiones (ADRs)

| ADR  | Decisión                                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------- |
| 0001 | Tags globales (catálogo). "Asociado a un proyecto" = está en `project.tag_ids`. `POST /projects/:id/tags` crea y vincula. |
| 0002 | `ends_on` es opcional al crear; si falta se aplica R3.                                                                    |
| 0003 | Si el valor sugerido supera `end_date`, se recorta a `end_date` 23:59:59.999 UTC. Si es explícito y lo supera → 422 (R2). |
| 0004 | Quitar del proyecto un tag usado por tareas → 409 `TAG_IN_USE` con los ids de las tareas.                                 |
| 0005 | Adelantar `end_date` por debajo de algún `ends_on` → 409 `TASKS_EXCEED_END_DATE`.                                         |
| 0006 | `start_date ≤ end_date` → si no, 422 `INVALID_DATE_RANGE`.                                                                |
| 0007 | Se puede completar un proyecto con tareas abiertas; las tareas no cambian; se puede reabrir y sigue editable.             |
| 0008 | Cambiar `priority` no recalcula `ends_on`.                                                                                |
| 0009 | Borrar un tag global lo desvincula de proyectos y tareas (cascada en las tablas pivote).                                  |
| 0010 | Borrar un proyecto borra sus tareas (cascada).                                                                            |
| 0011 | `Tag.color` hex `#RRGGBB`; `Tag.name` 1–50 (trim); `description` opcional al crear → `""` (nunca `null`).                 |

## Casos límite que los tests deben cubrir

- R1: lista vacía (válida); un tag válido y uno no; tag inexistente; tag que existe pero no está en el proyecto.
- R2: `ends_on` exactamente en `end_date` 23:59:59.999Z (válido) y 1 ms después (inválido); edición de `ends_on` en un PATCH; mover la tarea a otro proyecto, si se permite.
- R3: las 4 prioridades; recorte cuando `created_at + días > end_date`; `ends_on` explícito con prioridad (no se sobrescribe).
- Las funciones de `rules/` son puras: reciben `now` o `created_at` como parámetro (nunca `new Date()` dentro), para tests deterministas.
