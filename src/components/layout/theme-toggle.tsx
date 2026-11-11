'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSyncExternalStore } from 'react';
import {
  applyThemePreference,
  nextThemePreference,
  readThemePreference,
  subscribeToThemePreference,
  type ThemePreference,
} from '@/lib/theme';

const icons = { system: Monitor, light: Sun, dark: Moon } as const;

/** Static pages cannot know the stored choice, so the server renders `system`. */
function getServerSnapshot(): ThemePreference {
  return 'system';
}

/** Cycles system, light and dark; the icon shows the current preference. */
export function ThemeToggle() {
  const t = useTranslations('theme');
  const preference = useSyncExternalStore(
    subscribeToThemePreference,
    readThemePreference,
    getServerSnapshot,
  );
  const next = nextThemePreference(preference);
  const Icon = icons[preference];

  return (
    <button
      type="button"
      onClick={() => applyThemePreference(next)}
      aria-label={t('switch', { current: t(preference), next: t(next) })}
      title={t('switch', { current: t(preference), next: t(next) })}
      className="rounded-md p-2 text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
    >
      <Icon aria-hidden size={18} />
    </button>
  );
}
