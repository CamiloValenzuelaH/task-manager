---
id: ADR-0003
title: Recorte de la fecha sugerida al fin del proyecto
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0003: Recorte de la fecha sugerida al fin del proyecto

## Contexto

La fecha sugerida por R3 puede quedar después de `project.end_date`, lo que violaría R2.

## Decisión

Si el `ends_on` calculado supera `end_date`, se recorta a `end_date` 23:59:59.999 UTC. Si el cliente envía un `ends_on` explícito que supera ese límite, la respuesta es 422 `ENDS_ON_AFTER_PROJECT_END`.

## Consecuencias

Crear una tarea sin fecha nunca falla por R2.

Volver a [[specs]] · [[roadmap]].
