import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Info,
  Maximize2,
  ShieldCheck,
} from 'lucide-react-native';

import { ResponsiveWorkspace } from '@/components/navigation/ResponsiveWorkspace';
import {
  ClinicalButton,
  ClinicalCard,
  InlineAlert,
  SegmentedToggle,
} from '@/components/ui';
import { OtaUpdateStatusCard } from '@/components/updates';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import type { AppLanguage } from '@/i18n';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { getApiBaseUrl } from '@/services/api/config';
import { useAppTheme, type ThemePreference } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import { openExternalUrl } from '@/utils/externalLinks';
import { AboutContent } from './AboutContent';
import { GuideContent } from './GuideContent';
import { MethodologyContent } from './MethodologyContent';

export type InfoTopicKey = 'about' | 'guide' | 'methodology';

export function InfoHubScreenContent() {
  const router = useRouter();
  const { theme, preference, setPreference } = useAppTheme();
  const { language, setLanguage, t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing, radii } = theme;

  const [selectedTopic, setSelectedTopic] = useState<InfoTopicKey>('about');
  const [webLinkError, setWebLinkError] = useState<string | null>(null);

  const configuredApiUrl = useMemo(() => {
    try {
      return getApiBaseUrl();
    } catch {
      return null;
    }
  }, []);

  const menuItems: {
    key: InfoTopicKey;
    route: '/about' | '/guide' | '/methodology';
    title: string;
    desc: string;
    icon: typeof Info;
  }[] = [
    {
      key: 'about',
      route: '/about',
      title: t('infoHub.openAboutTitle'),
      desc: t('infoHub.openAboutDesc'),
      icon: Info,
    },
    {
      key: 'guide',
      route: '/guide',
      title: t('infoHub.openGuideTitle'),
      desc: t('infoHub.openGuideDesc'),
      icon: HelpCircle,
    },
    {
      key: 'methodology',
      route: '/methodology',
      title: t('infoHub.openMethodologyTitle'),
      desc: t('infoHub.openMethodologyDesc'),
      icon: BookOpen,
    },
  ];

  const handleSelectTopic = (item: (typeof menuItems)[number]) => {
    if (isWide) {
      setSelectedTopic(item.key);
      return;
    }
    router.push(item.route);
  };

  const handleOpenWebPortal = async () => {
    if (!configuredApiUrl) return;
    setWebLinkError(null);
    const opened = await openExternalUrl(configuredApiUrl);
    if (!opened) {
      setWebLinkError(t('infoHub.webLinkError'));
    }
  };

  const languageOptions: { value: AppLanguage; label: string }[] = [
    { value: 'id', label: t('common.languageId') },
    { value: 'en', label: t('common.languageEn') },
  ];

  const themeOptions: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: t('infoHub.appearanceSystem') },
    { value: 'light', label: t('infoHub.appearanceLight') },
    { value: 'dark', label: t('infoHub.appearanceDark') },
  ];

  const activeMenuItem =
    menuItems.find((item) => item.key === selectedTopic) ?? menuItems[0];

  const primaryPane = (
    <View testID="info-hub-primary" style={{ gap: spacing.lg }}>
      {/* Read Mode Resources Navigation */}
      <View style={{ gap: spacing.sm }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleMedium, { color: colors.onSurface }]}
        >
          {t('infoHub.resourcesTitle')}
        </Text>

        <View
          style={[
            styles.menuPanel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
              borderRadius: radii.lg,
            },
          ]}
        >
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isSelected = isWide && selectedTopic === item.key;

            return (
              <Pressable
                key={item.key}
                testID={`info-menu-${item.key}`}
                onPress={() => handleSelectTopic(item)}
                accessibilityRole="button"
                accessibilityState={isWide ? { selected: isSelected } : undefined}
                accessibilityLabel={item.title}
                style={({ pressed }) => [
                  styles.menuRow,
                  {
                    backgroundColor: isSelected
                      ? colors.primaryContainer
                      : pressed
                        ? colors.surfaceContainerHigh
                        : colors.surface,
                    borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                    borderTopColor: colors.outlineVariant,
                    padding: spacing.lg,
                    gap: spacing.md,
                  },
                ]}
              >
                <View
                  style={[
                    styles.menuIconBox,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.surfaceContainer,
                      borderRadius: radii.md,
                    },
                  ]}
                >
                  <Icon
                    size={20}
                    color={
                      isSelected ? colors.onPrimary : colors.primary
                    }
                    strokeWidth={2}
                  />
                </View>

                <View style={{ flex: 1, gap: 4 }}>
                  <Text
                    style={[
                      typography.titleSmall,
                      {
                        color: isSelected
                          ? colors.onPrimaryContainer
                          : colors.onSurface,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      typography.bodySmall,
                      {
                        color: isSelected
                          ? colors.onPrimaryContainer
                          : colors.onSurfaceVariant,
                      },
                    ]}
                  >
                    {item.desc}
                  </Text>
                </View>

                <ChevronRight
                  size={20}
                  color={
                    isSelected
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant
                  }
                  strokeWidth={2}
                />
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Settings & Web Access */}
      <ClinicalCard tone="elevated">
        <Text
          accessibilityRole="header"
          style={[typography.titleMedium, { color: colors.onSurface }]}
        >
          {t('infoHub.settingsTitle')}
        </Text>

        <SegmentedToggle<AppLanguage>
          testID="info-language-toggle"
          label={t('infoHub.languageLabel')}
          value={language}
          options={languageOptions}
          onChange={(lang) => {
            void setLanguage(lang);
          }}
        />

        <SegmentedToggle<ThemePreference>
          testID="info-theme-toggle"
          label={t('infoHub.themeLabel')}
          value={preference}
          options={themeOptions}
          onChange={setPreference}
        />

        <View
          style={[
            styles.webLinkBox,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderColor: colors.outlineVariant,
              borderRadius: radii.md,
              padding: spacing.md,
              gap: spacing.sm,
            },
          ]}
        >
          <Text style={[typography.titleSmall, { color: colors.onSurface }]}>
            {t('infoHub.webLinkTitle')}
          </Text>
          <Text
            style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
          >
            {configuredApiUrl
              ? `${t('infoHub.webLinkDescPrefix')} ${configuredApiUrl}`
              : t('infoHub.webLinkUnavailable')}
          </Text>

          {webLinkError && (
            <InlineAlert
              testID="info-weblink-error"
              tone="danger"
              message={webLinkError}
            />
          )}

          {configuredApiUrl && (
            <ClinicalButton
              testID="info-open-web-btn"
              variant="outlined"
              icon={ExternalLink}
              label={t('infoHub.webLinkBtn')}
              onPress={() => {
                void handleOpenWebPortal();
              }}
            />
          )}
        </View>
      </ClinicalCard>

      <OtaUpdateStatusCard />

      {/* Medical Disclaimer & KEPK Approval */}
      <InlineAlert
        testID="info-disclaimer-alert"
        tone="warning"
        title={t('disclaimer.title')}
        message={t('disclaimer.text')}
      />

      <ClinicalCard tone="neutral">
        <View style={[styles.ethicsRow, { gap: spacing.sm }]}>
          <ShieldCheck
            size={18}
            color={colors.clinical.safe.main}
            strokeWidth={2}
          />
          <Text
            style={[
              typography.labelMedium,
              { color: colors.onSurface, flex: 1 },
            ]}
          >
            {t('infoHub.ethicsBadge')}
          </Text>
        </View>
        <Text
          style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
        >
          {t('infoHub.footerInstitutional')}
        </Text>
      </ClinicalCard>
    </View>
  );

  const secondaryPane = (
    <View testID="info-hub-secondary" style={{ gap: spacing.lg }}>
      <View
        style={[
          styles.readerBar,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            typography.titleMedium,
            { color: colors.primary, flex: 1, paddingRight: spacing.sm },
          ]}
        >
          {activeMenuItem.title}
        </Text>
        <ClinicalButton
          testID="info-open-fullscreen-btn"
          variant="tonal"
          icon={Maximize2}
          label={t('infoHub.openFullscreen')}
          onPress={() => router.push(activeMenuItem.route)}
        />
      </View>

      {selectedTopic === 'about' && (
        <AboutContent
          onSelectTab={(route) => router.navigate(route)}
          onOpenGuide={() => setSelectedTopic('guide')}
          onOpenMethodology={() => setSelectedTopic('methodology')}
        />
      )}
      {selectedTopic === 'guide' && (
        <GuideContent onOpenCalculators={() => router.navigate('/')} />
      )}
      {selectedTopic === 'methodology' && <MethodologyContent />}
    </View>
  );

  return (
    <ResponsiveWorkspace
      primaryPane={primaryPane}
      secondaryPane={isWide ? secondaryPane : undefined}
    />
  );
}

const styles = StyleSheet.create({
  menuPanel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
  },
  menuIconBox: {
    width: TOUCH_TARGET.MIN_SIZE_DP - 4,
    height: TOUCH_TARGET.MIN_SIZE_DP - 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webLinkBox: {
    borderWidth: 1,
  },
  ethicsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readerBar: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: TOUCH_TARGET.MIN_SIZE_DP + 8,
  },
});
