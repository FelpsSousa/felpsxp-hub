import { ImageResponse } from 'next/og';
import { locales, type AppLocale } from '@/i18n/routing';
import { getProfile, getSiteSettings } from '@/lib/content';
import { requireLocale } from '@/i18n/locale';

/**
 * Default share image (Open Graph and Twitter) for every page in a locale,
 * generated at build time. Colours are the ADR-0005 dark palette, with the
 * purple brand accent.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Felipe Sousa';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type ImageProps = { params: Promise<{ locale: string }> };

export default async function OpenGraphImage({ params }: ImageProps) {
  const locale = requireLocale((await params).locale);
  const profile = getProfile(locale);
  const { name, url } = getSiteSettings();
  const domain = new URL(url).host;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        backgroundColor: '#0d1117',
        color: '#f0f6fc',
        borderTop: '12px solid #ab7df8',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: 76, fontWeight: 700, letterSpacing: -1 }}>{name}</div>
        <div style={{ fontSize: 40, color: '#ab7df8' }}>{profile.title}</div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          fontSize: 28,
          color: '#9198a1',
        }}
      >
        <div style={{ display: 'flex', maxWidth: 820, lineHeight: 1.4 }}>{profile.shortBio}</div>
        <div style={{ display: 'flex', color: '#f0f6fc' }}>{domain}</div>
      </div>
    </div>,
    size,
  );
}
