# Task Tracker

Gestor de tareas por proyectos con prioridades y etiquetas (estilo Todoist/Trello).

## Fuente de verdad
- Producto: [vault/specs.md](vault/specs.md)
- Decisiones: [vault/decisions/](vault/decisions/) (ADRs)
- Contrato de la API: [vault/api.md](vault/api.md)
- Ante una ambigüedad del spec: **no inventar**. Revisa los ADRs y, si no la cubren, propón uno nuevo (skill `adr`) y pregunta.

## Stack y estructura
Monorepo con npm workspaces, TypeScript estricto.
- `packages/shared`: schemas Zod de Tag/Project/Task y reglas de negocio puras (`src/rules/`). Lo usan la API y el frontend.
- `apps/api`: Fastify + Prisma (SQLite) + Zod. Capas: `routes/` → `services/` → `repositories/`; `errors/` contiene el error de dominio y el plugin de errores.
- `apps/web`: React + Vite + TanStack Query + React Router.
- `vault/`: vault de Obsidian con la documentación (no es código).

## Comandos
```
npm install                     # instalar dependencias
npm run dev                     # API + web en paralelo
npm run test                    # todos los tests (unitarios + integración)
npm run test -w apps/api        # tests de un workspace
npm run lint && npm run typecheck
npm run check                   # lint + typecheck + test (obligatorio antes de terminar)
npm run db:migrate -w apps/api  # prisma migrate dev
npm run db:seed -w apps/api
```

## Reglas de negocio (implementadas en `packages/shared/src/rules/`)
- **R1 Rango de tags:** los `tag_ids` de una tarea deben estar en el `tag_ids` de su proyecto → 422.
- **R2 Límite de fecha:** `task.ends_on` ≤ final del día (23:59:59.999 UTC) de `project.end_date` → 422.
- **R3 Prioridad:** `ends_on` sugerido = `created_at` + low 4 / medium 3 / high 2 / urgent 1 días; se aplica si falta `ends_on` y se recorta a `end_date` (ADR-0002 y 0003).
- Detalle completo, decisiones y casos límite: skill `domain-rules`.

## Convenciones
- JSON de la API y columnas de la BD en **snake_case** (como el spec); variables TS en camelCase. Prisma mapea con `@map`.
- Validación con Zod en el borde (routes); los services reciben datos ya validados y **no dependen de Fastify**.
- Errores uniformes `{ error: { code, message, details } }` con 400 (formato), 404, 409 (conflicto de estado) y 422 (regla de negocio).
- El frontend no reimplementa reglas: importa las de `@task-tracker/shared`.
- IDs uuid v4; fechas en ISO 8601 (`start_date`/`end_date` son date, `created_at`/`ends_on` son datetime UTC).

## Testing
- Un hook (PostToolUse) ejecuta `vitest related` sobre cada archivo `.ts/.tsx` editado. Si falla, corrígelo antes de seguir.
- Ejecuta `/test` completo antes de dar una tarea por terminada y siempre antes de `/ship`.
- Toda regla de negocio tiene test unitario (shared) y de integración (api). Los nombres de los tests incluyen `R1`, `R2`, `R3` o `ADR-000X`.

## Git
- No se hace commit directo en `main`. Ramas `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`.
- Conventional Commits: `feat(tasks): ...`, `fix(api): ...`.
- Usa `/ship` para hacer commits. **Nunca hagas push, merge ni borres ramas sin confirmación del usuario.**

## Flujo de trabajo
spec → ADR si hace falta → `shared` (schema + regla + test) → `api` (endpoint + test de integración) → `web` → actualizar `vault/api.md` → `/test` → `/ship`.

## Skills
- `domain-rules`: reglas, decisiones y casos límite del dominio.
- `api-endpoint`: crear o modificar un endpoint de la API.
- `prisma-change`: cambiar el modelo de datos o las migraciones.
- `web-feature`: crear vistas o componentes en React.
- `adr`: registrar una decisión de diseño en el vault.
- `spec-sync`: comparar el spec con el código y los tests.
- `test` (`/test`): ejecutar y escribir tests unitarios y de integración.
- `ship` (`/ship`): revisar cambios, hacer commits estructurados y gestionar ramas.
