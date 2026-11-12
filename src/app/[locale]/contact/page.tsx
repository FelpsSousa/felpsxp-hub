import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/contact/contact-form';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

/** Turnstile's own language codes for the widget's text. */
const turnstileLanguages = { pt: 'pt-br', en: 'en' } as const satisfies Record<AppLocale, string>;

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return pageMetadata({
    locale: locale as AppLocale,
    path: '/contact',
    title: t('title'),
    description: t('lede'),
  });
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const t = await getTranslations('contact');
  const { contactEmail, socialLinks } = getSiteSettings();
  const linkedIn = socialLinks.find((link) => link.label === 'LinkedIn');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-fg">{t('lede')}</p>
      </header>

      <section className="flex flex-col gap-2 text-sm text-fg-muted">
        <h2 className="font-medium uppercase tracking-wide">{t('directLabel')}</h2>
        <p>
          <a href={`mailto:${contactEmail}`} className="text-accent underline-offset-4 hover:underline">
            {contactEmail}
          </a>
          {linkedIn && (
            <>
              {' · '}
              <a
                href={linkedIn.href}
                rel="me noopener noreferrer"
                target="_blank"
                className="text-accent underline-offset-4 hover:underline"
              >
                LinkedIn
              </a>
            </>
          )}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-medium uppercase tracking-wide text-fg-muted">
          {t('formLabel')}
        </h2>
        {siteKey ? (
          <ContactForm
            turnstileSiteKey={siteKey}
            turnstileLanguage={turnstileLanguages[locale as AppLocale]}
          />
        ) : (
          <p className="text-fg-muted">{t('formUnavailable')}</p>
        )}
        <p className="text-sm text-fg-muted">
          {t('privacyNote')}{' '}
          <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">
            {t('privacyLink')}
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
