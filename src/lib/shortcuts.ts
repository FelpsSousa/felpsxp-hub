/**
 * Keyboard shortcuts. Single-key shortcuts (`/`, `?`, `g` sequences) can be
 * turned off, as WCAG 2.1.4 (Character Key Shortcuts) requires, because they
 * can clash with screen readers and speech input. The choice is stored in
 * localStorage only, under SHORTCUTS_STORAGE_KEY, and only when it is "off".
 * Ctrl+K and Cmd+K use a modifier and always work.
 */

export const SHORTCUTS_STORAGE_KEY = 'shortcuts';

/** Window event the search dialog listens to, so other components can open it. */
export const OPEN_SEARCH_EVENT = 'felpsxp:open-search';

const SHORTCUTS_CHANGE_EVENT = 'shortcutschange';

/** How long `g` waits for its second key. */
export const SEQUENCE_TIMEOUT_MS = 1500;

export type ShortcutAction =
  | { type: 'search' }
  | { type: 'help' }
  | { type: 'go'; href: '/' | '/projects' | '/contact' };

/** The `g` sequences, as listed in the help dialog. */
export const goTargets = { h: '/', p: '/projects', c: '/contact' } as const;

/** Time `g` was pressed, while waiting for the second key; null otherwise. */
export type SequenceState = number | null;

/**
 * The action for a key press without modifiers, and the new sequence state.
 * Pure, so the sequence logic is tested without a browser.
 */
export function resolveShortcut(
  key: string,
  pendingSince: SequenceState,
  now: number,
): { action: ShortcutAction | null; pending: SequenceState } {
  if (pendingSince !== null && now - pendingSince <= SEQUENCE_TIMEOUT_MS) {
    const href = goTargets[key as keyof typeof goTargets];
    return { action: href ? { type: 'go', href } : null, pending: null };
  }
  if (key === 'g') return { action: null, pending: now };
  if (key === '/') return { action: { type: 'search' }, pending: null };
  if (key === '?') return { action: { type: 'help' }, pending: null };
  return { action: null, pending: null };
}

/** True when a key press is text entry, which shortcuts must never steal. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || typeof (target as Element).closest !== 'function') return false;
  const element = target as HTMLElement;
  return (
    element.isContentEditable ||
    element.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]') !==
      null
  );
}

export function readShortcutsEnabled(): boolean {
  try {
    return window.localStorage.getItem(SHORTCUTS_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function writeShortcutsEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      window.localStorage.removeItem(SHORTCUTS_STORAGE_KEY);
    } else {
      window.localStorage.setItem(SHORTCUTS_STORAGE_KEY, 'off');
    }
  } catch {
    // Storage blocked: the choice lasts until the page is reloaded.
  }
  window.dispatchEvent(new CustomEvent(SHORTCUTS_CHANGE_EVENT, { detail: enabled }));
}

/** For useSyncExternalStore: changes in this tab and in other tabs. */
export function subscribeToShortcutsEnabled(onChange: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SHORTCUTS_STORAGE_KEY) onChange();
  };
  window.addEventListener(SHORTCUTS_CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SHORTCUTS_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
