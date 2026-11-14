'use client';

import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useRouter } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { searchEntries, type SearchEntry } from '@/lib/search';

type Indexes = Record<AppLocale, SearchEntry[]>;
type LoadState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * Site search: a header button and Ctrl+K (Cmd+K on macOS) open a modal dialog
 * with a combobox over the static `/search-index.json`, fetched on first open.
 * The native <dialog> traps focus, closes on Escape and returns focus to the
 * element that opened it.
 */
export function SiteSearch() {
  const t = useTranslations('search');
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [indexes, setIndexes] = useState<Indexes | null>(null);
  const [load, setLoad] = useState<LoadState>('idle');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;

  const results = indexes ? searchEntries(indexes[locale] ?? [], query) : [];

  async function ensureIndex() {
    if (indexes || load === 'loading') return;
    setLoad('loading');
    try {
      const response = await fetch('/search-index.json');
      if (!response.ok) throw new Error(String(response.status));
      setIndexes((await response.json()) as Indexes);
      setLoad('ready');
    } catch {
      setLoad('error');
    }
  }

  function open() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    inputRef.current?.select();
    void ensureIndex();
  }

  function close() {
    dialogRef.current?.close();
  }

  function go(entry: SearchEntry) {
    close();
    setQuery('');
    router.push(entry.href);
  }

  // Ctrl+K / Cmd+K from anywhere on the page.
  const onShortcut = useEffectEvent((event: globalThis.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      open();
    }
  });
  useEffect(() => {
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  function onInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    // Closed explicitly: some browsers spend the first Escape clearing the field.
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      go(results[Math.min(active, results.length - 1)]);
    }
  }

  const status =
    load === 'error'
      ? t('error')
      : load !== 'ready'
        ? t('loading')
        : query.trim() === ''
          ? t('hint')
          : results.length === 0
            ? t('noResults', { query: query.trim() })
            : t('results', { count: results.length });

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={t('open')}
        aria-keyshortcuts="Control+K Meta+K"
        title={`${t('open')} (Ctrl+K)`}
        className="rounded-md p-2 text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
      >
        <Search aria-hidden="true" className="size-5" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label={t('dialogLabel')}
        onClick={(event) => {
          // A click on the backdrop lands on the dialog element itself.
          if (event.target === dialogRef.current) close();
        }}
        className="mx-auto mt-[12vh] w-[min(36rem,calc(100%-2rem))] rounded-lg border border-border bg-canvas p-0 text-fg shadow-xl backdrop:bg-black/60"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search aria-hidden="true" className="size-5 shrink-0 text-fg-muted" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-label={t('dialogLabel')}
              aria-expanded={results.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={results.length > 0 ? optionId(active) : undefined}
              placeholder={t('placeholder')}
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKeyDown}
              className="h-12 w-full bg-transparent text-fg placeholder:text-fg-muted focus:outline-none"
            />
          </div>

          <ul id={listId} role="listbox" aria-label={t('resultsLabel')} className="max-h-[50vh] overflow-y-auto p-2">
            {results.map((entry, index) => (
              <li
                key={entry.href}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                onClick={() => go(entry)}
                onMouseMove={() => setActive(index)}
                className={`flex cursor-pointer flex-col gap-0.5 rounded-md px-3 py-2 ${
                  index === active ? 'bg-surface' : ''
                }`}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-medium text-fg">{entry.title}</span>
                  <span className="shrink-0 text-xs text-fg-muted">{t(`kinds.${entry.kind}`)}</span>
                </span>
                {entry.description && (
                  <span className="text-sm text-fg-muted">{entry.description}</span>
                )}
              </li>
            ))}
          </ul>

          <p role="status" className="border-t border-border px-4 py-2 text-xs text-fg-muted">
            {status}
          </p>
        </div>
      </dialog>
    </>
  );
}
