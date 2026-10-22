import { describe, expect, it } from 'vitest';
import { PACKAGE_NAME } from './index';

describe('shared', () => {
  it('exporta el nombre del paquete', () => {
    expect(PACKAGE_NAME).toBe('@task-tracker/shared');
  });
});
