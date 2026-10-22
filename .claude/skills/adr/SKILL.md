---
name: adr
description: Registrar una decisión de arquitectura o de producto como ADR en vault/decisions/. Úsala cuando el spec sea ambiguo, cuando se elija entre alternativas o cuando cambie una decisión previa.
---

# Architecture Decision Records

## Pasos
1. Busca en `vault/decisions/` si ya existe un ADR sobre el tema. Si cambia una decisión, crea uno nuevo y marca el anterior como `superseded`.
2. Numeración: siguiente número libre con 4 dígitos → `ADR-00NN-<slug-kebab>.md`.
3. Usa la plantilla y deja el estado en `proposed` hasta que el usuario lo confirme; después pasa a `accepted`.
4. Enlázalo con wikilinks de Obsidian: añade `[[ADR-00NN-slug]]` en la sección "Decisiones" de `vault/specs.md` y actualiza la tabla de la skill `domain-rules` si afecta al dominio.

## Plantilla
```md
---
id: ADR-00NN
title: <Título>
status: proposed | accepted | superseded
date: YYYY-MM-DD
supersedes:
---

# ADR-00NN: <Título>

## Contexto
<Qué ambigüedad o problema hay. Cita el spec.>

## Decisión
<Qué se hace, de forma concreta y comprobable.>

## Consecuencias
<Impacto en la API, la BD, la UI y los tests. Códigos de error.>

## Alternativas descartadas
- <Opción>: <por qué no>
```
