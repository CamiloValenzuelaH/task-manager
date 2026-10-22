---
title: Ramas de Git
tags: [git, flujo, ship]
updated: 2026-10-22
---

# Ramas de Git — Task Tracker

Modelo de ramas del proyecto. La skill **`/ship`** (`.claude/skills/ship/SKILL.md`) aplica estas reglas en cada commit e integración.

Relacionado: [[roadmap]] · [[specs]] · [[api]]

## Ramas permanentes

| Rama      | Propósito                                                        | Quién escribe                              |
| --------- | ---------------------------------------------------------------- | ------------------------------------------ |
| `main`    | Versión estable o "publicable". Cada merge es una release.       | Solo merges desde `develop` (o `hotfix/*`) |
| `develop` | Rama de desarrollo: integra todo el trabajo terminado y probado. | Merges desde las ramas de trabajo          |

Nunca se hace commit directo en `main` ni en `develop`.

## Ramas de trabajo (temporales)

Salen de `develop` y vuelven a `develop`:

| Prefijo     | Uso                                      | Ejemplo                      |
| ----------- | ---------------------------------------- | ---------------------------- |
| `feat/`     | Funcionalidad nueva                      | `feat/task-priority-ends-on` |
| `fix/`      | Corrección de un error                   | `fix/r2-end-of-day-utc`      |
| `chore/`    | Configuración, dependencias, tooling     | `chore/workspaces`           |
| `docs/`     | Documentación y vault                    | `docs/git-branches`          |
| `refactor/` | Reestructurar sin cambiar comportamiento | `refactor/task-service`      |
| `test/`     | Solo tests                               | `test/projects-integration`  |

Excepción: `hotfix/<slug>` sale de `main` para un error urgente en producción y se integra en `main` **y** en `develop`.

Nombres en kebab-case. Si la rama corresponde a una fase o regla, inclúyelo (`feat/fase1-shared-rules`).

## Flujo con /ship

```
develop ──┬──────────────●────────────●──── (merge --no-ff)
          │             ╱            ╱
          └─ feat/x ──●──●   fix/y ─●
main ─────●──────────────────────────────●  (release: develop → main)
```

1. `git switch develop && git switch -c feat/<slug>`
2. Trabajo y commits con [Conventional Commits](https://www.conventionalcommits.org/): `<tipo>(<scope>): <resumen>`
3. `/ship` → revisa los cambios, ejecuta `npm run check`, hace el commit y **pregunta** antes de integrar.
4. Integración: `git switch develop && git merge --no-ff feat/<slug>`. Después, borrar la rama (con confirmación).
5. Release: cuando una o varias fases del [[roadmap]] estén completas y en verde → `git switch main && git merge --no-ff develop` y una etiqueta `vX.Y.Z` (con confirmación).

## Reglas

- Antes de cualquier merge a `develop` o `main`, `npm run check` debe pasar.
- `merge --no-ff` para conservar en el historial qué entró en cada rama.
- Nada de `push --force`, `reset --hard` ni rebase sobre `develop` o `main`.
- Push, merge, tag y borrado de ramas siempre con confirmación del usuario.
- Remoto (GitHub): todavía sin configurar. Cuando exista, `main` y `develop` se protegen (PR obligatorio + checks de CI) y las ramas de trabajo se integran por Pull Request contra `develop`.

## Estado actual

- `main`: bootstrap inicial (`641bdb6`). Release pendiente: se hará al cerrar la Fase 1 (Fases 0 + 1).
- `develop`: Fase 0 completa (`cdd60a9`): `chore/workspaces` y `docs/git-branches` integradas y borradas.
- Ramas de trabajo abiertas:

| Rama                      | Sale de   | Objetivo                                                       |
| ------------------------- | --------- | -------------------------------------------------------------- |
| `feat/fase1-shared-rules` | `develop` | Fase 1 del [[roadmap]]: schemas Zod de Tag/Project/Task, R1–R3 |
