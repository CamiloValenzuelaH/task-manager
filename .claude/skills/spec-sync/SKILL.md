---
name: spec-sync
description: Auditar la coherencia entre vault/specs.md, los ADRs, vault/api.md, el código y los tests. Úsala al terminar una feature, cuando cambie el spec o cuando el usuario pida revisar qué falta.
---

# Sincronización entre el spec y el código

Solo lectura: informa, no corrige sin permiso.

## Checklist

1. **Historias de usuario** (`vault/specs.md`): por cada una, localiza el endpoint (`apps/api/src/routes`) y la UI (`apps/web/src/features`). Marca ✅ / ⚠️ parcial / ❌.
2. **Reglas R1–R3 y ADRs aceptados:** existe implementación en `packages/shared/src/rules` o en los services **y** tests con ese id (`grep -rn "R1\|ADR-0004" --include=*.test.ts`).
3. **Esquema de datos:** campos y tipos del spec frente a `schema.prisma` y los schemas Zod (nombres snake_case, longitudes máximas de 255, enums).
4. **Contrato:** las rutas registradas en Fastify frente a `vault/api.md`.
5. **ADRs `proposed`** pendientes de confirmar.
6. **Roadmap** (`vault/roadmap.md`): las casillas `[x]` y el estado de cada fase coinciden con lo que existe en el código.

## Formato del informe

```
## Spec sync — <fecha>
| Elemento | Estado | Evidencia | Acción sugerida |
```

Termina con una lista priorizada de pasos siguientes.
