import { describe, expect, it } from 'vitest';
import { sharedPackage } from './index';

describe('api', () => {
  it('resuelve el workspace shared', () => {
    expect(sharedPackage).toBe('@task-tracker/shared');
  });
});
