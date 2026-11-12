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

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/**
 * Cloudflare Turnstile, rendered explicitly so it survives client-side
 * navigation. It writes its token into a hidden form field named
 * `cf-turnstile-response`. Tokens are single use, so every new value of
 * `resetSignal` (the form's action state, after each submission) asks for a
 * fresh one.
 */
export function TurnstileWidget({
  siteKey,
  language,
  resetSignal,
}: {
  siteKey: string;
  language: string;
  resetSignal: unknown;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
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
    });
  }, [siteKey, language]);

  useEffect(() => {
    if (resetSignal !== initialSignalRef.current && widgetIdRef.current) {
      window.turnstile?.reset(widgetIdRef.current);
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
      <Script src={SCRIPT_URL} strategy="afterInteractive" onReady={renderWidget} />
      <div ref={containerRef} className="min-h-[65px]" />
    </>
  );
}
