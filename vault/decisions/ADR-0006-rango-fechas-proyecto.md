---
id: ADR-0006
title: Validación del rango de fechas del proyecto
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0006: Validación del rango de fechas del proyecto

## Contexto
El spec no define la relación entre `start_date` y `end_date`.

## Decisión
Se exige `start_date ≤ end_date`; si no se cumple, 422 `INVALID_DATE_RANGE`.

## Consecuencias
Se valida al crear y al actualizar el proyecto.

Volver a [[specs]].
