# Task Tracker

Gestor de tareas por proyectos con prioridades y etiquetas (estilo Todoist/Trello).

> **Estado:** en desarrollo. Fase 0 (bootstrap) completa; Fase 1 (`packages/shared`) en curso. Ver el [roadmap](vault/roadmap.md).

## Qué hace

- Crear, editar, borrar y completar **proyectos** y **tareas**.
- **Tags** globales que se asocian a proyectos; las tareas solo pueden usar los tags de su proyecto.
- **Prioridad** (`low`, `medium`, `high`, `urgent`) que sugiere la fecha límite de la tarea.

### Reglas de negocio

| Regla | Descripción                                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------- |
| R1    | Los `tag_ids` de una tarea deben estar en los `tag_ids` de su proyecto (422).                                 |
| R2    | `task.ends_on` no puede superar el final del día (23:59:59.999 UTC) de `project.end_date` (422).              |
| R3    | Si falta `ends_on`: `created_at` + 4 / 3 / 2 / 1 días (low / medium / high / urgent), recortado a `end_date`. |

## Stack

Monorepo con npm workspaces y TypeScript estricto.

| Workspace         | Contenido                                                   |
| ----------------- | ----------------------------------------------------------- |
| `packages/shared` | Schemas Zod y reglas de negocio puras, usados por API y web |
| `apps/api`        | Fastify + Prisma (SQLite) + Zod                             |
| `apps/web`        | React + Vite + TanStack Query + React Router                |
| `vault/`          | Documentación (vault de Obsidian): spec, ADRs, API, roadmap |

## Requisitos e instalación

- Node.js ≥ 20

```bash
git clone https://github.com/CamiloValenzuelaH/task-manager.git
cd task-manager
npm install
```

## Comandos

```bash
npm run test          # tests de todos los workspaces
npm run lint          # ESLint (typescript-eslint strictTypeChecked)
npm run format:check  # Prettier
npm run typecheck     # tsc en todos los workspaces
npm run check         # lint + format:check + typecheck + test
```

`npm run dev` y los scripts de base de datos llegarán con las fases 2 y 5.

## Documentación

- [Especificaciones](vault/specs.md) · [Contrato de la API](vault/api.md) · [Roadmap](vault/roadmap.md)
- [Decisiones de diseño (ADRs)](vault/decisions/)
- [Modelo de ramas de Git](vault/git-branches.md)

## Flujo de trabajo

`main` es la versión estable y `develop` integra el trabajo. Las ramas `feat/`, `fix/`, `chore/` y `docs/` salen de `develop`, usan [Conventional Commits](https://www.conventionalcommits.org/) y se integran con `merge --no-ff`. Detalles en [vault/git-branches.md](vault/git-branches.md).
