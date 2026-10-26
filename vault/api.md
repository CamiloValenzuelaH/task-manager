# Contrato de la API — Task Tracker

Ver también: [[specs]] · [[roadmap]]

Base: `/api` · JSON en snake_case · Errores: `{ "error": { "code", "message", "details" } }`

| Código                 | Uso                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| 400 `VALIDATION_ERROR` | Body, params o query no cumplen el schema                                                  |
| 404 `NOT_FOUND`        | El recurso no existe                                                                       |
| 409                    | Conflicto de estado (`TAG_IN_USE`, `TASKS_EXCEED_END_DATE`)                                |
| 422                    | Regla de negocio (`TAG_NOT_IN_PROJECT`, `ENDS_ON_AFTER_PROJECT_END`, `INVALID_DATE_RANGE`) |

`details` de las reglas 422: `TAG_NOT_IN_PROJECT` → `{ invalid_tag_ids }` · `ENDS_ON_AFTER_PROJECT_END` → `{ ends_on, max_ends_on }`.

## Tags

| Método | Ruta        | Body                | Respuesta                                     |
| ------ | ----------- | ------------------- | --------------------------------------------- |
| GET    | `/tags`     | —                   | 200 `Tag[]`                                   |
| POST   | `/tags`     | `{ name, color? }`  | 201 `Tag`                                     |
| PATCH  | `/tags/:id` | `{ name?, color? }` | 200 `Tag`                                     |
| DELETE | `/tags/:id` | —                   | 204 (cascada, [[ADR-0009-borrar-tag-global]]) |

## Projects

| Método | Ruta                     | Body                                                     | Respuesta / errores                         |
| ------ | ------------------------ | -------------------------------------------------------- | ------------------------------------------- |
| GET    | `/projects`              | `?status=`                                               | 200 `Project[]`                             |
| GET    | `/projects/:id`          | —                                                        | 200 `Project` · 404                         |
| POST   | `/projects`              | `{ name, description?, start_date, end_date, tag_ids? }` | 201 · 422 `INVALID_DATE_RANGE`              |
| PATCH  | `/projects/:id`          | campos parciales                                         | 200 · 422 · 409 `TASKS_EXCEED_END_DATE`     |
| DELETE | `/projects/:id`          | —                                                        | 204 (cascada, [[ADR-0010-borrar-proyecto]]) |
| PATCH  | `/projects/:id/complete` | —                                                        | 200 ([[ADR-0007-completar-proyecto]])       |
| PATCH  | `/projects/:id/reopen`   | —                                                        | 200                                         |
| PUT    | `/projects/:id/tags`     | `{ tag_ids }`                                            | 200 · 409 `TAG_IN_USE`                      |
| POST   | `/projects/:id/tags`     | `{ name, color? }`                                       | 201 `Tag` creado y vinculado                |

## Tasks

| Método | Ruta                  | Body                                                             | Respuesta / errores                                |
| ------ | --------------------- | ---------------------------------------------------------------- | -------------------------------------------------- |
| GET    | `/projects/:id/tasks` | `?status=&priority=&tag_id=`                                     | 200 `Task[]`                                       |
| POST   | `/projects/:id/tasks` | `{ title, description?, priority, status?, tag_ids?, ends_on? }` | 201 · 422 R1/R2 (`ends_on` calculado si falta: R3) |
| GET    | `/tasks/:id`          | —                                                                | 200 · 404                                          |
| PATCH  | `/tasks/:id`          | campos parciales                                                 | 200 · 422 R1/R2                                    |
| PATCH  | `/tasks/:id/status`   | `{ status }`                                                     | 200                                                |
| DELETE | `/tasks/:id`          | —                                                                | 204                                                |
