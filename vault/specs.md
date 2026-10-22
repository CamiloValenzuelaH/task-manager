# Especificaciones del Producto: Task Tracker

## Resumen

Plataforma de gestión de tareas por proyectos con asignación de prioridades y etiquetas (estilo Todoist/Trello).

## Historias de Usuario

Como usuario puedo:

- Crear, editar, eliminar y marcar proyectos como completados.
- Crear, editar, eliminar y completar tareas dentro de un proyecto.
- Crear etiquetas (tags) globales o asociadas a proyectos.
- Asignar etiquetas disponibles en un proyecto a sus respectivas tareas.

## Reglas de Negocio

1. **Rango de Tags:** Una tarea solo puede usar tags que hayan sido previamente asignados al proyecto al que pertenece.
2. **Límite de Fecha:** La fecha de finalización de una tarea (`ends_on`) no puede ser posterior a la fecha de término del proyecto (`end_date`).
3. **Cálculo de Prioridad:** La prioridad determina la fecha límite estimada sugerida para la tarea desde su creación:
   - `low` (Baja): 4 días
   - `medium` (Media): 3 días
   - `high` (Alta): 2 días
   - `urgent` (Urgente): 1 día

---

## Esquema de Datos

### 1. Tag

```json
{
  "id": "string (uuid)",
  "name": "string",
  "color": "string (opcional, ej. #FF5733)"
}
```

### Proyecto (Project)

```json
{
  "id": "string (uuid)",
  "name": "string (max 255)",
  "description": "string (text)",
  "status": "pending | completed",
  "start_date": "string (ISO 8601 date)",
  "end_date": "string (ISO 8601 date)",
  "tag_ids": ["string (uuid)"],
  "created_at": "string (ISO 8601 datetime)"
}
```

### Tarea (Task)

```json
{
  "id": "string (uuid)",
  "project_id": "string (uuid)",
  "title": "string (max 255)",
  "description": "string (text)",
  "status": "pending | in_progress | completed",
  "priority": "low | medium | high | urgent",
  "tag_ids": ["string (uuid)"],
  "created_at": "string (ISO 8601 datetime)",
  "ends_on": "string (ISO 8601 datetime)"
}
```

---

## Decisiones

Resolución de ambigüedades del spec (ver `vault/decisions/`):

- [[ADR-0001-tags-globales]] · [[ADR-0002-ends-on-opcional]] · [[ADR-0003-recorte-fecha-sugerida]]
- [[ADR-0004-quitar-tag-en-uso]] · [[ADR-0005-adelantar-end-date]] · [[ADR-0006-rango-fechas-proyecto]]
- [[ADR-0007-completar-proyecto]] · [[ADR-0008-prioridad-no-recalcula]] · [[ADR-0009-borrar-tag-global]] · [[ADR-0010-borrar-proyecto]]
- [[ADR-0011-formato-campos-texto]]

Contrato de la API: [[api]] · Fases y progreso: [[roadmap]] · Ramas de Git: [[git-branches]]
