---
id: ADR-0002
title: ends_on opcional al crear una tarea
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0002: ends_on opcional al crear una tarea

## Contexto

La regla 3 habla de una fecha "sugerida", pero el esquema exige `ends_on`.

## Decisión

`ends_on` es opcional en `POST`. Si se omite, el servidor lo calcula con R3 (`created_at` + días según la prioridad). La respuesta siempre incluye `ends_on`.

## Consecuencias

El frontend muestra la sugerencia como valor por defecto editable.

Volver a [[specs]] · [[roadmap]].
