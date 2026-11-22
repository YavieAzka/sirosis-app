import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AlertCircle,
  DownloadCloud,
  RefreshCw,
} from 'lucide-react-native';

import { ClinicalButton } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { useOptionalOtaUpdates } from '@/updates/OtaUpdateProvider';

export function UpdatePromptBanner() {
  const ota = useOptionalOtaUpdates();
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, radii } = theme;

  if (!ota || ota.bannerDismissed) {
    return null;
  }

  const { status, errorMessage, downloadUpdate, applyUpdate, dismissBanner } =
    ota;

  if (
    status !== 'available' &&
    status !== 'downloading' &&
    status !== 'ready' &&
    status !== 'error'
  ) {
    return null;
  }

  let containerBg = colors.primaryContainer;
  let borderColor = colors.primary;
  let textColor = colors.onPrimaryContainer;
  let titleText = t('updates.availableTitle');
  let bodyText = t('updates.availableMessage');

  if (status === 'downloading') {
    titleText = t('updates.downloadingTitle');
    bodyText = t('updates.downloadingMessage');
  } else if (status === 'ready') {
    containerBg = colors.clinical.safe.container;
    borderColor = colors.clinical.safe.border;
    textColor = colors.clinical.safe.onContainer;
    titleText = t('updates.readyTitle');
    bodyText = t('updates.readyMessage');
  } else if (status === 'error') {
    containerBg = colors.clinical.danger.container;
    borderColor = colors.clinical.danger.border;
    textColor = colors.clinical.danger.onContainer;
    titleText = t('updates.errorTitle');
    bodyText = errorMessage ? `${t('updates.errorFallback')} (${errorMessage})` : t('updates.errorFallback');
  }

  return (
    <View
      testID="ota-update-banner"
      accessibilityLiveRegion="polite"
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: Math.max(insets.left, insets.right, spacing.md),
          paddingBottom: spacing.xs,
        },
      ]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: containerBg,
            borderColor,
            borderRadius: radii.lg,
            padding: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        <View style={[styles.headerRow, { gap: spacing.sm }]}>
          {status === 'downloading' ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : status === 'ready' ? (
            <RefreshCw size={20} color={textColor} strokeWidth={2} />
          ) : status === 'error' ? (
            <AlertCircle size={20} color={textColor} strokeWidth={2} />
          ) : (
            <DownloadCloud size={20} color={textColor} strokeWidth={2} />
          )}

          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[typography.titleSmall, { color: textColor }]}>
              {titleText}
            </Text>
            <Text style={[typography.bodySmall, { color: textColor }]}>
              {bodyText}
            </Text>
          </View>
        </View>

        <View style={[styles.actionsRow, { gap: spacing.sm }]}>
          {status === 'available' && (
            <ClinicalButton
              testID="ota-banner-download-btn"
              variant="filled"
              icon={DownloadCloud}
              label={t('updates.downloadBtn')}
              onPress={() => {
                void downloadUpdate();
              }}
            />
          )}

          {status === 'ready' && (
            <ClinicalButton
              testID="ota-banner-apply-btn"
              variant="filled"
              icon={RefreshCw}
              label={t('updates.applyBtn')}
              onPress={() => {
                void applyUpdate();
              }}
            />
          )}

          {status === 'error' && (
            <ClinicalButton
              testID="ota-banner-retry-btn"
              variant="filled"
              icon={RefreshCw}
              label={t('common.retry')}
              onPress={() => {
                void downloadUpdate();
              }}
            />
          )}

          {status !== 'downloading' && (
            <ClinicalButton
              testID="ota-banner-dismiss-btn"
              variant="text"
              label={
                status === 'error' ? t('common.close') : t('updates.laterBtn')
              }
              onPress={dismissBanner}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  card: {
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
