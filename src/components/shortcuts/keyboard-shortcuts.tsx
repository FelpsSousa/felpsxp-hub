'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useId, useRef, useSyncExternalStore } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  isTypingTarget,
  OPEN_SEARCH_EVENT,
  readShortcutsEnabled,
  resolveShortcut,
  subscribeToShortcutsEnabled,
  writeShortcutsEnabled,
  type SequenceState,
} from '@/lib/shortcuts';

/** Static pages cannot know the stored choice, so the server renders "on". */
const getServerSnapshot = () => true;

const rows = [
  { keys: ['Ctrl', 'K'], action: 'search', combo: true },
  { keys: ['/'], action: 'search' },
  { keys: ['g', 'h'], action: 'home' },
  { keys: ['g', 'p'], action: 'projects' },
  { keys: ['g', 'c'], action: 'contact' },
  { keys: ['?'], action: 'help' },
] as const;

/**
 * Listens for the single-key shortcuts and renders the footer button that
 * opens the shortcuts dialog, where they can be turned off (WCAG 2.1.4).
 */
export function KeyboardShortcuts() {
  const t = useTranslations('shortcuts');
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pending = useRef<SequenceState>(null);
  const toggleId = useId();
  const enabled = useSyncExternalStore(
    subscribeToShortcutsEnabled,
    readShortcutsEnabled,
    getServerSnapshot,
  );

  function openHelp() {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!enabled || event.defaultPrevented) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (isTypingTarget(event.target) || dialogRef.current?.open) return;
    if (document.querySelector('dialog[open]')) return;

    const { action, pending: next } = resolveShortcut(event.key, pending.current, Date.now());
    pending.current = next;
    if (!action) return;

    event.preventDefault();
    if (action.type === 'search') window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
    else if (action.type === 'help') openHelp();
    else router.push(action.href);
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={openHelp}
        aria-keyshortcuts="Shift+?"
        className="inline-block py-1 underline underline-offset-4 hover:text-fg"
      >
        {t('open')}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${toggleId}-title`}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="mx-auto mt-[12vh] w-[min(28rem,calc(100%-2rem))] rounded-lg border border-border bg-canvas p-6 font-sans text-sm text-fg shadow-xl backdrop:bg-black/60"
      >
        <div className="flex flex-col gap-5">
          <h2 id={`${toggleId}-title`} className="text-lg font-semibold">
            {t('title')}
          </h2>

          <table className="w-full text-left">
            <thead className="sr-only">
              <tr>
                <th scope="col">{t('keysHeading')}</th>
                <th scope="col">{t('actionHeading')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.keys.join('-')} className="border-b border-border last:border-0">
                  <td className="py-2 pr-4">
                    {row.keys.map((key, index) => (
                      <span key={key}>
                        {index > 0 && (
                          <span className="px-1 text-fg-muted">
                            {'combo' in row ? '+' : t('then')}
                          </span>
                        )}
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-xs">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </td>
                  <td className="py-2 text-fg-muted">{t(`actions.${row.action}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-col gap-1">
            <label htmlFor={toggleId} className="flex items-center gap-3 font-medium">
              <input
                id={toggleId}
                type="checkbox"
                checked={enabled}
                onChange={(event) => writeShortcutsEnabled(event.target.checked)}
                aria-describedby={`${toggleId}-help`}
                className="size-4 accent-accent"
              />
              {t('toggle')}
            </label>
            <p id={`${toggleId}-help`} className="pl-7 text-fg-muted">
              {t('toggleHelp')}
            </p>
          </div>

          <form method="dialog" className="flex justify-end">
            <button
              type="submit"
              className="rounded-md border border-border px-4 py-2 hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
            >
              {t('close')}
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
