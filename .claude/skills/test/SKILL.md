---
name: test
description: Ejecuta los tests unitarios y de integración del proyecto y define cómo escribir tests nuevos. Úsala tras cada cambio de código, antes de /ship y cuando el usuario pida probar algo.
argument-hint: "[unit | integration | shared | api | web | <ruta>]"
---

# /test

## Ejecutar
Según el argumento (`$ARGUMENTS`):
| Argumento | Comando |
|---|---|
| (vacío) | `npm run test` (todos los workspaces) |
| `unit` | `npm run test -w packages/shared && npm run test:unit -w apps/api && npm run test -w apps/web` |
| `integration` | `npm run test:integration -w apps/api` |
| `shared` / `api` / `web` | `npm run test -w packages/shared` / `-w apps/api` / `-w apps/web` |
| `<ruta>` | `npx vitest run <ruta>` dentro del workspace que la contiene |

Después de ejecutarlo:
- **Si todo pasa:** informa en una línea (n.º de tests y duración).
- **Si algo falla:** muestra un resumen de los fallos (test, assert, archivo:línea), diagnostica la causa y propón o aplica la corrección. **No des la tarea por terminada con tests en rojo.** No borres ni marques `.skip` un test para que pase sin acuerdo del usuario.
- Si el cambio tocó reglas o endpoints y no hay test que lo cubra, escríbelo (ver abajo).

## Escribir tests
**Ubicación**
- Unitarios: `*.test.ts(x)` junto al archivo (`packages/shared/src/rules/priority.test.ts`).
- Integración de la API: `apps/api/test/integration/<entidad>.test.ts`.

**Convenciones**
- Nombre: `describe('R2 ends_on límite', ...)` o `it('ADR-0004: 409 al quitar un tag en uso', ...)` para trazar reglas.
- Patrón Arrange / Act / Assert; un comportamiento por `it`.
- Fechas deterministas: pasa `now` explícito o `vi.setSystemTime`. Nada de `new Date()` sin fijar.
- Datos con las factories de `apps/api/test/factories.ts` (`makeProject`, `makeTask`, `makeTag`) con overrides.
- Integración: `buildApp()` + `app.inject(...)`; cada suite usa una BD SQLite temporal (`DATABASE_URL=file:./test-<uuid>.db`, `prisma db push` en `beforeAll`, borrar en `afterAll`). Limpia las tablas en `beforeEach`.
- Por endpoint: caso feliz, 400 (validación), 404 y cada regla o ADR aplicable (422/409).
- Web: Testing Library + `msw`; consultas por rol o label.

## Automatización
El hook PostToolUse (`scripts/test-changed.mjs`) ya ejecuta `vitest related` sobre cada archivo editado. Esta skill es para la ejecución completa o dirigida.
