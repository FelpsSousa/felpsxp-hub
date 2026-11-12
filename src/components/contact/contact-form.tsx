'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useState } from 'react';
import { submitContact } from '@/app/[locale]/contact/actions';
import { TurnstileWidget } from '@/components/contact/turnstile-widget';
import { HONEYPOT_FIELD } from '@/lib/contact/fields';
import type { ContactActionState } from '@/lib/contact/handle-submission';
import { contactIntents, type ContactField } from '@/lib/contact/schema';

const initialState: ContactActionState = { status: 'idle' };

const emptyValues: Record<ContactField, string> = {
  name: '',
  email: '',
  company: '',
  intent: '',
  message: '',
};

const inputClass =
  'w-full rounded-md border border-border bg-canvas px-3 py-2 text-fg placeholder:text-fg-muted focus-visible:outline-2 focus-visible:outline-accent aria-[invalid=true]:border-danger';

export function ContactForm({
  turnstileSiteKey,
  turnstileLanguage,
}: {
  turnstileSiteKey: string;
  turnstileLanguage: string;
}) {
  const t = useTranslations('contact');
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const [values, setValues] = useState(emptyValues);
  const [dismissed, setDismissed] = useState<ContactActionState | null>(null);

  const invalidFields = state.status === 'invalid' ? state.fields : [];
  const isInvalid = (name: ContactField) => invalidFields.includes(name);

  if (state.status === 'success' && dismissed !== state) {
    return (
      <div role="status" className="flex flex-col gap-4 rounded-lg border border-border p-6">
        <p className="font-medium text-success">{t('success.title')}</p>
        <p className="text-fg-muted">{t('success.body')}</p>
        <button
          type="button"
          onClick={() => {
            setValues(emptyValues);
            setDismissed(state);
          }}
          className="w-fit text-accent underline underline-offset-4 hover:decoration-2"
        >
          {t('success.again')}
        </button>
      </div>
    );
  }

  const update = (name: ContactField) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [name]: event.target.value }));

  const describedBy = (name: ContactField) => (isInvalid(name) ? `${name}-error` : undefined);

  const errorFor = (name: ContactField) =>
    isInvalid(name) ? (
      <p id={`${name}-error`} className="text-sm text-danger">
        {t(`errors.${name}`)}
      </p>
    ) : null;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.status === 'error' && (
        <p role="alert" className="rounded-md border border-danger/50 p-3 text-sm text-danger">
          {t('errors.generic')}
        </p>
      )}
      {state.status === 'invalid' && (
        <p role="alert" className="text-sm text-danger">
          {t('errors.summary')}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-fg">
          {t('fields.name')}
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          value={values.name}
          onChange={update('name')}
          aria-invalid={isInvalid('name')}
          aria-describedby={describedBy('name')}
          className={inputClass}
        />
        {errorFor('name')}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-fg">
          {t('fields.email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          value={values.email}
          onChange={update('email')}
          aria-invalid={isInvalid('email')}
          aria-describedby={describedBy('email')}
          className={inputClass}
        />
        {errorFor('email')}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="company" className="text-sm font-medium text-fg">
          {t('fields.company')} <span className="font-normal text-fg-muted">{t('optional')}</span>
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          maxLength={100}
          value={values.company}
          onChange={update('company')}
          aria-invalid={isInvalid('company')}
          aria-describedby={describedBy('company')}
          className={inputClass}
        />
        {errorFor('company')}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="intent" className="text-sm font-medium text-fg">
          {t('fields.intent')}
        </label>
        <select
          id="intent"
          name="intent"
          required
          value={values.intent}
          onChange={update('intent')}
          aria-invalid={isInvalid('intent')}
          aria-describedby={describedBy('intent')}
          className={inputClass}
        >
          <option value="" disabled>
            {t('intentPlaceholder')}
          </option>
          {contactIntents.map((intent) => (
            <option key={intent} value={intent}>
              {t(`intents.${intent}`)}
            </option>
          ))}
        </select>
        {errorFor('intent')}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-fg">
          {t('fields.message')}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          maxLength={5000}
          value={values.message}
          onChange={update('message')}
          aria-invalid={isInvalid('message')}
          aria-describedby={describedBy('message')}
          className={inputClass}
        />
        {errorFor('message')}
      </div>

      {/* Honeypot: invisible to people and skipped by keyboard and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Website</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <TurnstileWidget siteKey={turnstileSiteKey} language={turnstileLanguage} resetSignal={state} />

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-md bg-accent px-5 py-2 font-medium text-canvas hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
      >
        {pending ? t('sending') : t('send')}
      </button>
    </form>
  );
}
