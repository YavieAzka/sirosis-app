import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { I18nextProvider, useTranslation } from 'react-i18next';

import {
  createAppI18n,
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LANGUAGE_STORAGE_KEY,
  resolveDeviceLanguage,
  type AppLanguage,
} from './index';

export interface LanguageContextValue {
  language: AppLanguage;
  isHydrated: boolean;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  toggleLanguage: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: React.ReactNode;
  initialLanguage?: AppLanguage;
}) {
  const [i18nInstance] = useState(() =>
    createAppI18n(initialLanguage ?? DEFAULT_LANGUAGE)
  );
  const [language, setLanguageState] = useState<AppLanguage>(
    initialLanguage ?? DEFAULT_LANGUAGE
  );
  const [isHydrated, setIsHydrated] = useState<boolean>(
    Boolean(initialLanguage)
  );

  useEffect(() => {
    let active = true;
    if (initialLanguage) {
      return undefined;
    }

    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((stored) => {
        if (!active) return;
        const resolved = isSupportedLanguage(stored)
          ? stored
          : resolveDeviceLanguage(getLocales());
        setLanguageState(resolved);
        return i18nInstance.changeLanguage(resolved);
      })
      .catch(() => {
        if (!active) return;
        const fallback = resolveDeviceLanguage(getLocales());
        setLanguageState(fallback);
        void i18nInstance.changeLanguage(fallback);
      })
      .finally(() => {
        if (active) setIsHydrated(true);
      });

    return () => {
      active = false;
    };
  }, [i18nInstance, initialLanguage]);

  const setLanguage = useCallback(
    async (nextLang: AppLanguage) => {
      setLanguageState(nextLang);
      await i18nInstance.changeLanguage(nextLang);
      try {
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLang);
      } catch {
        // Persistence error should not block active UI switch
      }
    },
    [i18nInstance]
  );

  const toggleLanguage = useCallback(async () => {
    const next: AppLanguage = language === 'id' ? 'en' : 'id';
    await setLanguage(next);
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      isHydrated,
      setLanguage,
      toggleLanguage,
    }),
    [language, isHydrated, setLanguage, toggleLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useAppLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useAppLanguage must be used within LanguageProvider');
  }
  const { t } = useTranslation();
  return { ...ctx, t };
}
