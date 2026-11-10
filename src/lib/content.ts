import { profileByLocale } from '@/content/profile/profile';
import type { AppLocale } from '@/i18n/routing';

export function getProfile(locale: AppLocale) {
  return profileByLocale[locale];
}
