import { describe, expect, it } from 'vitest';
import { isActivePath } from '@/lib/navigation';

describe('isActivePath', () => {
  it('matches the page itself and its children', () => {
    expect(isActivePath('/projects', '/projects')).toBe(true);
    expect(isActivePath('/projects/felpsxp-hub', '/projects')).toBe(true);
  });

  it('does not match a different page that shares a prefix', () => {
    expect(isActivePath('/projects-archive', '/projects')).toBe(false);
  });

  it('matches home only on the root path', () => {
    expect(isActivePath('/', '/')).toBe(true);
    expect(isActivePath('/projects', '/')).toBe(false);
  });
});
