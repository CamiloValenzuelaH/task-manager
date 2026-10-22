---
id: ADR-0007
title: Completar un proyecto con tareas abiertas
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0007: Completar un proyecto con tareas abiertas

## Contexto
El spec permite marcar proyectos como completados, pero no dice qué pasa con sus tareas.

## Decisión
Está permitido; el estado de las tareas no cambia. Un proyecto completado se puede reabrir (`PATCH /projects/:id/reopen`) y sigue siendo editable.

## Consecuencias
La UI puede avisar de cuántas tareas quedan abiertas antes de completar.

Volver a [[specs]].
