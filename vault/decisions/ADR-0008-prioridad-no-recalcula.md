---
id: ADR-0008
title: Cambiar la prioridad no recalcula ends_on
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0008: Cambiar la prioridad no recalcula ends_on

## Contexto
R3 define la sugerencia "desde su creación".

## Decisión
La sugerencia solo se aplica al crear la tarea. Un `PATCH` de `priority` no modifica `ends_on`.

## Consecuencias
El formulario de edición puede mostrar la nueva sugerencia sin aplicarla automáticamente.

Volver a [[specs]].
