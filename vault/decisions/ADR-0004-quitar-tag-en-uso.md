---
id: ADR-0004
title: Quitar de un proyecto un tag en uso
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0004: Quitar de un proyecto un tag en uso

## Contexto
R1 exige que los tags de las tareas estén en su proyecto. Quitar un tag del proyecto dejaría tareas inválidas.

## Decisión
La operación se rechaza con 409 `TAG_IN_USE` y `details.task_ids`. No hay cascada silenciosa.

## Consecuencias
El usuario debe quitar primero el tag de esas tareas.

Volver a [[specs]].
