---
id: ADR-0011
title: Formato de color, nombre de tag y description
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0011: Formato de color, nombre de tag y description

## Contexto

El spec define `Tag.color` como "string (opcional, ej. #FF5733)", no da longitud máxima para `Tag.name` y marca `description` de Project y Task como "string (text)", aunque en [[api]] es opcional al crear.

## Decisión

- `Tag.color`: hex de 6 dígitos `#RRGGBB` (`^#[0-9A-Fa-f]{6}$`), opcional.
- `Tag.name`: se le aplica trim y debe tener entre 1 y 50 caracteres.
- `description` (Project y Task): opcional al crear; si falta, se guarda y se devuelve `""`. En la respuesta siempre es string, nunca `null`.

Un formato inválido es error de schema → 400 `VALIDATION_ERROR`.

## Consecuencias

- Schemas Zod en `packages/shared/src/schemas/` (Fase 1).
- BD: `description` es `NOT NULL DEFAULT ''`; `color` es nullable.
- UI: selector de color hex; contador de 50 caracteres en el nombre del tag.

## Alternativas descartadas

- Hex corto `#RGB` o texto libre en `color`: complica el uso directo en CSS y la comparación.
- `Tag.name` de hasta 255: una etiqueta larga no cabe en un chip de la UI.
- `description: null`: obliga al frontend a tratar dos valores vacíos.

Volver a [[specs]] · [[roadmap]].
