---
name: prisma-change
description: Cómo cambiar el modelo de datos (apps/api/prisma/schema.prisma), generar migraciones y mantener sincronizados los schemas Zod, el seed y el spec. Úsala al añadir o modificar modelos, campos o relaciones.
---

# Cambios en el modelo de datos

## Antes de empezar
- Compara el cambio con el "Esquema de Datos" de `vault/specs.md`. Si el spec no lo contempla, registra un ADR (skill `adr`) y confírmalo con el usuario.

## Pasos
1. Edita `apps/api/prisma/schema.prisma`:
   - Modelos en PascalCase, campos en camelCase con `@map("snake_case")`, tablas con `@@map("snake_case_plural")`.
   - IDs: `String @id @default(uuid())`.
   - Enums como `String` validados por Zod (SQLite no tiene enums nativos).
   - Pivotes `ProjectTag` y `TaskTag` con clave compuesta y `onDelete: Cascade` (ADR-0009). `Task.project` con `onDelete: Cascade` (ADR-0010).
2. `npm run db:migrate -w apps/api -- --name <descripcion_corta>`.
3. Actualiza los schemas Zod de `packages/shared/src/schemas/` y los mapeos del repository.
4. Actualiza el seed (`apps/api/prisma/seed.ts`) y las factories de tests.
5. `/test` completo.

## No hacer
- No edites migraciones ya commiteadas: crea una nueva.
- No uses `prisma db push` salvo en tests (BD temporal).
- No commitees archivos `*.db`.
