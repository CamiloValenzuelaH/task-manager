---
id: ADR-0009
title: Borrar un tag global en uso
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0009: Borrar un tag global en uso

## Contexto
Un tag puede estar vinculado a proyectos y tareas.

## Decisión
Al borrarlo se desvincula en cascada (filas de `project_tags` y `task_tags`).

## Consecuencias
La operación es irreversible; la UI pide confirmación e indica en cuántos sitios se usa.

Volver a [[specs]].
