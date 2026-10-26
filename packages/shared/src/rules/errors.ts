/** Códigos de las reglas de negocio que responden 422 (ver vault/api.md). */
export type RuleViolationCode =
  'TAG_NOT_IN_PROJECT' | 'ENDS_ON_AFTER_PROJECT_END' | 'INVALID_DATE_RANGE';

/**
 * Violación de una regla de negocio. No depende de Fastify: la API la traduce
 * a 422 `{ error: { code, message, details } }` en su plugin de errores.
 */
export class RuleViolationError extends Error {
  override readonly name = 'RuleViolationError';

  constructor(
    readonly code: RuleViolationCode,
    message: string,
    readonly details: Readonly<Record<string, unknown>> = {},
  ) {
    super(message);
  }
}
