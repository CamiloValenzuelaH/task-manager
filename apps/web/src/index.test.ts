import { describe, expect, it } from 'vitest';
import { sharedPackage } from './index';

describe('web', () => {
  it('resuelve el workspace shared', () => {
    expect(sharedPackage).toBe('@task-tracker/shared');
  });
});
