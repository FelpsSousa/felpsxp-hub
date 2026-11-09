import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 px-6">
      <p className="text-sm uppercase tracking-wide text-slate-400">{t('eyebrow')}</p>
      <h1 className="text-4xl font-semibold">{t('title')}</h1>
      <p className="text-slate-300">{t('lede')}</p>
    </main>
  );
}
