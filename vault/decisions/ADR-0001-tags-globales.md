---
id: ADR-0001
title: Tags globales vinculados a proyectos
status: accepted
date: 2026-10-22
supersedes:
---

# ADR-0001: Tags globales vinculados a proyectos

## Contexto

El spec dice que los tags pueden ser "globales o asociados a proyectos", pero el esquema de Tag no tiene `project_id`; la asociación se modela con `project.tag_ids`.

## Decisión

Todos los tags viven en un catálogo global. Un tag está "asociado" a un proyecto cuando su id está en `project.tag_ids`. `POST /projects/:id/tags` crea un tag y lo vincula al proyecto en una sola operación.

## Consecuencias

Tablas pivote `project_tags` y `task_tags`. Un mismo tag puede reutilizarse en varios proyectos.

Volver a [[specs]] · [[roadmap]].
