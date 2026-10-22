---
id: ADR-0005
title: Adelantar la fecha de fin del proyecto
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0005: Adelantar la fecha de fin del proyecto

## Contexto
Adelantar `end_date` puede dejar tareas con `ends_on` posterior, lo que viola R2.

## Decisión
Se rechaza con 409 `TASKS_EXCEED_END_DATE` y `details.task_ids`.

## Consecuencias
El usuario ajusta antes las tareas afectadas.

Volver a [[specs]].
