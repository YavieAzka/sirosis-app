import React, { useMemo } from 'react';
import { Tabs, usePathname, useRouter } from 'expo-router';

import { AdaptiveNavigationScaffold } from '@/components/navigation/AdaptiveNavigationScaffold';
import {
  APP_DESTINATIONS,
  type AppDestination,
  type AppDestinationKey,
} from '@/components/navigation/destinations';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

const ROUTE_BY_KEY: Record<AppDestinationKey, '/' | '/los' | '/dose' | '/info'> = {
  index: '/',
  los: '/los',
  dose: '/dose',
  info: '/info',
};

function resolveActiveKey(pathname: string): AppDestinationKey {
  if (pathname.startsWith('/los')) return 'los';
  if (pathname.startsWith('/dose')) return 'dose';
  if (pathname.startsWith('/info')) return 'info';
  return 'index';
}

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useAppLanguage();
  const { theme } = useAppTheme();
  const { colors } = theme;
  const activeKey = resolveActiveKey(pathname);

  const localizedDestinations = useMemo<AppDestination[]>(
    () =>
      APP_DESTINATIONS.map((dest) => {
        if (dest.key === 'index') {
          return {
            ...dest,
            label: t('nav.mortality'),
            headerTitle: t('nav.mortalityTitle'),
            accessibilityLabel: t('nav.mortalityA11y'),
          };
        }
        if (dest.key === 'los') {
          return {
            ...dest,
            label: t('nav.los'),
            headerTitle: t('nav.losTitle'),
            accessibilityLabel: t('nav.losA11y'),
          };
        }
        if (dest.key === 'dose') {
          return {
            ...dest,
            label: t('nav.dose'),
            headerTitle: t('nav.doseTitle'),
            accessibilityLabel: t('nav.doseA11y'),
          };
        }
        return {
          ...dest,
          label: t('nav.info'),
          headerTitle: t('nav.infoTitle'),
          accessibilityLabel: t('nav.infoA11y'),
        };
      }),
    [t]
  );

  const handleSelectDestination = (key: AppDestinationKey) => {
    router.navigate(ROUTE_BY_KEY[key]);
  };

  return (
    <AdaptiveNavigationScaffold
      destinations={localizedDestinations}
      activeKey={activeKey}
      onSelectDestination={handleSelectDestination}
      languageCode={language}
      onToggleLanguage={() => {
        void toggleLanguage();
      }}
      languageToggleAccessibilityLabel={`${t('common.language')}: ${
        language === 'id' ? t('common.languageId') : t('common.languageEn')
      }`}
      themeToggleLightLabel={t('theme.toggleToLight')}
      themeToggleDarkLabel={t('theme.toggleToDark')}
    >
      <Tabs
        backBehavior="initialRoute"
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="los" />
        <Tabs.Screen name="dose" />
        <Tabs.Screen name="info" />
      </Tabs>
    </AdaptiveNavigationScaffold>
  );
}
