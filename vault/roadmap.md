---
title: Roadmap
tags: [roadmap, fases]
updated: 2026-10-22
---

# Roadmap — Task Tracker

Fases de trabajo derivadas de [[specs]]. Marca cada tarea con `[x]` al completarla y actualiza el estado de la fase.

**Estado:** ✅ completada · 🚧 en curso · ⏳ pendiente

| Fase | Nombre                                  | Estado |
| ---- | --------------------------------------- | ------ |
| 0    | [[#Fase 0 — Bootstrap]]                 | ✅     |
| 1    | [[#Fase 1 — Shared (schemas y reglas)]] | 🚧     |
| 2    | [[#Fase 2 — API base y Tags]]           | ⏳     |
| 3    | [[#Fase 3 — Projects]]                  | ⏳     |
| 4    | [[#Fase 4 — Tasks]]                     | ⏳     |
| 5    | [[#Fase 5 — Frontend web]]              | ⏳     |
| 6    | [[#Fase 6 — Pulido]]                    | ⏳     |

---

## Fase 0 — Bootstrap

Estado: ✅

- [x] Repositorio git (`main`), `.gitignore`, `.gitattributes`
- [x] `CLAUDE.md` y skills de `.claude/skills/`
- [x] Hook de tests con cada cambio (`scripts/test-changed.mjs`)
- [x] Decisiones ADR-0001 a ADR-0010 (ver [[specs#Decisiones]])
- [x] Contrato inicial de la API: [[api]]
- [x] npm workspaces (`packages/shared`, `apps/api`, `apps/web`)
- [x] TypeScript estricto, ESLint y Prettier
- [x] Vitest en los workspaces y scripts `test`, `lint`, `typecheck`, `check`

## Fase 1 — Shared (schemas y reglas)

Estado: 🚧 (rama `feat/fase1-shared-rules`)

- [x] Schemas Zod de Tag, Project y Task (`packages/shared/src/schemas/`, [[ADR-0011-formato-campos-texto]])
- [x] `suggestEndsOn` y `PRIORITY_DAYS` (R3, [[ADR-0002-ends-on-opcional]], [[ADR-0003-recorte-fecha-sugerida]])
- [ ] `assertEndsOnWithinProject` (R2)
- [ ] `assertTagsInProject` (R1)
- [ ] Tests unitarios de las reglas (límites de fecha, zonas horarias)

## Fase 2 — API base y Tags

Estado: ⏳

- [ ] Fastify + `buildApp()` y plugin de errores
- [ ] Prisma schema (Project, Task, Tag, ProjectTag, TaskTag) y primera migración
- [ ] CRUD `/tags` con borrado en cascada ([[ADR-0009-borrar-tag-global]])
- [ ] Infraestructura de tests de integración (BD temporal y factories)

## Fase 3 — Projects

Estado: ⏳

- [ ] CRUD `/projects` y validación de fechas ([[ADR-0006-rango-fechas-proyecto]])
- [ ] Completar y reabrir ([[ADR-0007-completar-proyecto]])
- [ ] Gestión de `tag_ids`, `POST /projects/:id/tags` ([[ADR-0001-tags-globales]], [[ADR-0004-quitar-tag-en-uso]])
- [ ] Bloquear el adelanto de `end_date` ([[ADR-0005-adelantar-end-date]])
- [ ] Borrado en cascada de las tareas ([[ADR-0010-borrar-proyecto]])
- [ ] Tests de integración

## Fase 4 — Tasks

Estado: ⏳

- [ ] CRUD de tareas y `PATCH /tasks/:id/status`
- [ ] Aplicar R1, R2 y R3 en los services ([[ADR-0008-prioridad-no-recalcula]])
- [ ] Filtros por estado, prioridad y tag
- [ ] Tests de integración nombrados R1/R2/R3

## Fase 5 — Frontend web

Estado: ⏳

- [ ] Vite + React + TanStack Query + Router y cliente de la API
- [ ] Lista y detalle de proyectos (crear, editar, completar, borrar)
- [ ] Formulario de tarea con fecha sugerida, selector de tags del proyecto y fecha máxima
- [ ] Gestor de tags global
- [ ] Estados de carga, vacío y error; tests con Testing Library + msw

## Fase 6 — Pulido

Estado: ⏳

- [ ] Seed de datos demo
- [ ] [[api]] sincronizado con las rutas reales
- [ ] README
- [ ] `npm run check` en verde y `/spec-sync` sin diferencias

---

Relacionado: [[specs]] · [[api]] · [[git-branches]] · ADRs en `decisions/`
