---
name: api-endpoint
description: Pasos y plantillas para crear o modificar un endpoint REST en apps/api (Fastify + Zod + Prisma). Úsala al añadir o cambiar rutas, services o repositories.
---

# Crear o modificar un endpoint

## Pasos (en este orden)

1. **Contrato:** añade o ajusta la entrada en `vault/api.md` (método, ruta, body, respuestas, errores).
2. **Schema:** en `packages/shared/src/schemas/<entidad>.ts` define `Create<X>Input`, `Update<X>Input` y `<X>` con Zod. Exporta también los tipos (`z.infer`).
3. **Repository** (`apps/api/src/repositories/<entidad>.repository.ts`): solo acceso a Prisma. Convierte filas ↔ DTO snake_case (`tag_ids` desde las tablas pivote).
4. **Service** (`apps/api/src/services/<entidad>.service.ts`): orquesta y aplica las reglas de `@task-tracker/shared/rules` (ver skill `domain-rules`). Lanza `DomainError(code, status, message, details?)`. Las operaciones de varios pasos van en `prisma.$transaction`.
5. **Route** (`apps/api/src/routes/<entidad>.routes.ts`): valida `params`/`body`/`query` con Zod, llama al service y responde. Sin lógica de negocio.
6. **Test de integración** (`apps/api/test/integration/<entidad>.test.ts`) con `app.inject`: caso feliz, 400, 404 y cada regla aplicable (422/409). Ver skill `test`.
7. Ejecuta `/test api`.

## Plantilla de route

```ts
export async function taskRoutes(app: FastifyInstance) {
  app.post('/projects/:projectId/tasks', async (req, reply) => {
    const { projectId } = ProjectParams.parse(req.params);
    const input = CreateTaskInput.parse(req.body);
    const task = await app.services.tasks.create(projectId, input);
    return reply.code(201).send(task);
  });
}
```

## Respuestas

- 200 GET/PATCH/PUT, 201 POST, 204 DELETE.
- Los errores los formatea el plugin `errors/error-handler.ts`: `ZodError` → 400 `VALIDATION_ERROR`; `DomainError` → su status; Prisma `P2025` → 404 `NOT_FOUND`.
