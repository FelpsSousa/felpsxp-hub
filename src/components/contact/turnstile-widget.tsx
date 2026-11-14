'use client';

import Script from 'next/script';
import { useCallback, useEffect, useRef } from 'react';
import { TURNSTILE_FIELD } from '@/lib/contact/fields';

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action?: string;
      language?: string;
      theme?: 'auto' | 'light' | 'dark';
      'response-field-name'?: string;
      callback?: () => void;
      'error-callback'?: () => boolean;
      'expired-callback'?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/** Where the check stands: a token exists only in `ready`. */
export type TurnstileStatus = 'loading' | 'ready' | 'expired' | 'error';

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Cloudflare Turnstile, rendered explicitly so it survives client-side
 * navigation. It writes its token into a hidden form field named
 * `cf-turnstile-response`. Tokens are single use, so every new value of
 * `resetSignal` (the form's action state, after each submission) asks for a
 * fresh one. Every change of state is reported through `onStatusChange`,
 * so the form can explain a failed check instead of submitting without a
 * token.
 */
export function TurnstileWidget({
  siteKey,
  language,
  resetSignal,
  onStatusChange,
}: {
  siteKey: string;
  language: string;
  resetSignal: unknown;
  onStatusChange: (status: TurnstileStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Read through a ref, so a new callback identity never re-renders the widget.
  const onStatusChangeRef = useRef(onStatusChange);
  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);
  const widgetIdRef = useRef<string | null>(null);
  const initialSignalRef = useRef(resetSignal);

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: 'contact',
      language,
      theme: 'auto',
      'response-field-name': TURNSTILE_FIELD,
      callback: () => onStatusChangeRef.current('ready'),
      // Returning true tells Turnstile the error is handled here.
      'error-callback': () => {
        onStatusChangeRef.current('error');
        return true;
      },
      'expired-callback': () => onStatusChangeRef.current('expired'),
    });
  }, [siteKey, language]);

  useEffect(() => {
    if (resetSignal !== initialSignalRef.current && widgetIdRef.current) {
      window.turnstile?.reset(widgetIdRef.current);
      onStatusChangeRef.current('loading');
    }
  }, [resetSignal]);

  useEffect(
    () => () => {
      if (widgetIdRef.current) {
        window.turnstile?.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    },
    [],
  );

  return (
    <>
      <Script
        src={SCRIPT_URL}
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => onStatusChangeRef.current('error')}
      />
      <div ref={containerRef} data-testid="turnstile" className="min-h-[65px]" />
    </>
  );
}
