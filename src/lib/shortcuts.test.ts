import { describe, expect, it } from 'vitest';
import { resolveShortcut, SEQUENCE_TIMEOUT_MS } from '@/lib/shortcuts';

describe('resolveShortcut', () => {
  it('maps single keys to search and help', () => {
    expect(resolveShortcut('/', null, 0)).toEqual({ action: { type: 'search' }, pending: null });
    expect(resolveShortcut('?', null, 0)).toEqual({ action: { type: 'help' }, pending: null });
    expect(resolveShortcut('x', null, 0)).toEqual({ action: null, pending: null });
  });

  it('turns g followed by a target key into navigation', () => {
    const first = resolveShortcut('g', null, 1000);
    expect(first).toEqual({ action: null, pending: 1000 });
    expect(resolveShortcut('p', first.pending, 1500).action).toEqual({ type: 'go', href: '/projects' });
    expect(resolveShortcut('h', 1000, 1100).action).toEqual({ type: 'go', href: '/' });
    expect(resolveShortcut('c', 1000, 1100).action).toEqual({ type: 'go', href: '/contact' });
  });

  it('drops a sequence after an unknown key or the timeout', () => {
    expect(resolveShortcut('z', 1000, 1100)).toEqual({ action: null, pending: null });
    expect(resolveShortcut('p', 1000, 1000 + SEQUENCE_TIMEOUT_MS + 1)).toEqual({
      action: null,
      pending: null,
    });
  });
});
