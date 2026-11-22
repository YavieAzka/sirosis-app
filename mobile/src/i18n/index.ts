import { createInstance, type i18n as I18nInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import id from '@/locales/id.json';

export type AppLanguage = 'id' | 'en';

export const SUPPORTED_LANGUAGES: readonly AppLanguage[] = ['id', 'en'];
export const DEFAULT_LANGUAGE: AppLanguage = 'id';
export const LANGUAGE_STORAGE_KEY = 'cirrhosmart.language';

export const resources = {
  id: { translation: id },
  en: { translation: en },
} as const;

export function isSupportedLanguage(value: unknown): value is AppLanguage {
  return value === 'id' || value === 'en';
}

export function resolveDeviceLanguage(
  locales: readonly { languageCode?: string | null }[]
): AppLanguage {
  const primary = locales[0]?.languageCode?.toLowerCase();
  if (primary === 'en') {
    return 'en';
  }
  return DEFAULT_LANGUAGE;
}

export function createAppI18n(
  initialLanguage: AppLanguage = DEFAULT_LANGUAGE
): I18nInstance {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
  return instance;
}
