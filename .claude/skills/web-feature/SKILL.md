---
name: web-feature
description: Convenciones para crear vistas, componentes, formularios y llamadas a la API en apps/web (React + Vite + TanStack Query). Úsala al construir o modificar la interfaz.
---

# Vistas y componentes web

## Estructura

```
apps/web/src/
├─ api/client.ts            fetch wrapper: base URL, JSON, convierte { error } en ApiError
├─ features/<entidad>/
│  ├─ api.ts                hooks useXxxQuery / useXxxMutation (TanStack Query)
│  ├─ components/           componentes de la feature
│  └─ pages/                rutas (ProjectListPage, ProjectDetailPage…)
├─ components/ui/           botones, modal, badge de tag, date input…
└─ routes.tsx
```

## Reglas

- Datos del servidor **solo** a través de TanStack Query. Query keys: `['projects']`, `['projects', id]`, `['projects', id, 'tasks']`, `['tags']`. Invalida las keys afectadas en `onSuccess`.
- Formularios validados con los schemas Zod de `@task-tracker/shared` (no se duplican reglas).
- Formulario de tarea:
  - Al cambiar la prioridad, muestra `suggestEndsOn(now, priority, project.end_date)` como valor por defecto si el usuario no fijó una fecha (R3).
  - El selector de tags solo ofrece `project.tag_ids` (R1).
  - El date picker tiene `max = project.end_date` (R2).
- Errores de la API: `ApiError.code` → mensaje legible; los 422 con `details` se marcan en el campo correspondiente.
- Cada página cubre los estados de carga, vacío y error.
- Accesibilidad: labels en todos los inputs; acciones destructivas con confirmación.

## Tests

- Testing Library + Vitest; `msw` para simular la API. Prueba el comportamiento (lo que ve y hace el usuario), no los detalles de implementación.
