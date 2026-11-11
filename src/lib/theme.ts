/**
 * Light/dark theme preference (ADR-0005 defines both palettes).
 *
 * `system` follows `prefers-color-scheme` and is the default. An explicit
 * choice is stored in localStorage only: it never reaches the server and
 * expires when the visitor clears site data. The `<html data-theme>`
 * attribute is what the stylesheet reads.
 */

export const themePreferences = ['system', 'light', 'dark'] as const;

export type ThemePreference = (typeof themePreferences)[number];

export const THEME_STORAGE_KEY = 'theme';

const THEME_CHANGE_EVENT = 'themechange';

/** The preference that follows `current` when the toggle is pressed. */
export function nextThemePreference(current: ThemePreference): ThemePreference {
  const index = themePreferences.indexOf(current);
  return themePreferences[(index + 1) % themePreferences.length];
}

/** Narrows an untrusted stored value; anything unexpected means `system`. */
export function parseThemePreference(value: unknown): ThemePreference {
  return value === 'light' || value === 'dark' ? value : 'system';
}

/**
 * Inline script for `<head>`: applies a stored explicit theme before the
 * first paint, so a static page never flashes the wrong palette. It only
 * accepts the two literal values and swallows storage errors (private
 * mode, blocked site data), in which case the system theme applies.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}})();`;

export function readThemePreference(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return 'system';
  }
}

function setRootTheme(preference: ThemePreference): void {
  if (preference === 'system') {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = preference;
  }
}

export function applyThemePreference(preference: ThemePreference): void {
  try {
    if (preference === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    }
  } catch {
    // Storage unavailable: the choice still applies for this page view.
  }

  setRootTheme(preference);
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/** Subscribes to changes from this tab and from other open tabs. */
export function subscribeToThemePreference(onChange: () => void): () => void {
  function onStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY) {
      setRootTheme(parseThemePreference(event.newValue));
      onChange();
    }
  }

  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener('storage', onStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onStorage);
  };
}
