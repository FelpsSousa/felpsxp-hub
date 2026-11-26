import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { requireLocale } from '@/i18n/locale';
import { getProfile, getSiteSettings } from '@/lib/content';
import { pageMetadata } from '@/lib/seo';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const locale = requireLocale((await params).locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  return pageMetadata({ locale, path: '/about', title: t('title'), description: t('description') });
}

const headingClass = 'text-xl font-semibold text-fg';
const linkClass = 'text-link underline underline-offset-4 hover:decoration-2';

export default async function AboutPage({ params }: AboutPageProps) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const profile = getProfile(locale);
  const settings = getSiteSettings();
  const repository = settings.repositoryUrl;

  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-fg">{t('title')}</h1>
        <p className="text-lg text-fg">{profile.title}</p>
        <p className="text-fg-muted">{profile.location}</p>
      </header>

      <section aria-labelledby="bio" className="flex flex-col gap-4">
        <h2 id="bio" className={headingClass}>
          {t('bio')}
        </h2>
        {profile.summaryParagraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-fg">
            {paragraph}
          </p>
        ))}
      </section>

      <section aria-labelledby="focus" className="flex flex-col gap-3">
        <h2 id="focus" className={headingClass}>
          {t('focus')}
        </h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-fg">
          {profile.currentFocus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-i-work" className="flex flex-col gap-3">
        <h2 id="how-i-work" className={headingClass}>
          {t('howIWork')}
        </h2>
        <ul className="flex list-disc flex-col gap-2 pl-5 text-fg">
          {profile.howIWork.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="text-sm text-fg-muted">
          {t('evidence')}{' '}
          <a href={`${repository}/tree/main/docs/adr`} className={linkClass}>
            {t('adrs')}
          </a>
          {', '}
          <a href={`${repository}/blob/main/AI.md`} className={linkClass}>
            AI.md
          </a>
          {', '}
          <a href={`${repository}/pulls?q=is%3Apr+is%3Amerged`} className={linkClass}>
            {t('pullRequests')}
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="principles" className="flex flex-col gap-3">
        <h2 id="principles" className={headingClass}>
          {t('principles')}
        </h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-fg">
          {profile.principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="next" className="flex flex-col gap-3">
        <h2 id="next" className={headingClass}>
          {t('next')}
        </h2>
        <ul className="flex flex-col gap-2 text-fg">
          <li>
            <Link href="/cv" className={linkClass}>
              {t('links.cv')}
            </Link>
          </li>
          <li>
            <Link href="/experience" className={linkClass}>
              {t('links.experience')}
            </Link>
          </li>
          <li>
            <Link href="/projects" className={linkClass}>
              {t('links.projects')}
            </Link>
          </li>
          <li>
            <Link href="/contact" className={linkClass}>
              {t('links.contact')}
            </Link>
          </li>
          {settings.socialLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={linkClass} rel="me noopener noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
