import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Download,
  DownloadCloud,
  RefreshCw,
} from 'lucide-react-native';

import { ClinicalButton, ClinicalCard, InlineAlert } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import {
  getApkDownloadUrl,
  getOtaEnvironmentInfo,
} from '@/updates/otaService';
import { useOptionalOtaUpdates } from '@/updates/OtaUpdateProvider';
import { openExternalUrl } from '@/utils/externalLinks';

export function OtaUpdateStatusCard() {
  const ota = useOptionalOtaUpdates();
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, spacing, radii } = theme;
  const [apkOpenError, setApkOpenError] = useState<string | null>(null);

  const fallbackEnv = useMemo(() => getOtaEnvironmentInfo(), []);
  const fallbackApkUrl = useMemo(() => getApkDownloadUrl(), []);

  const envInfo = ota?.envInfo ?? fallbackEnv;
  const apkUrl = ota?.apkDownloadUrl ?? fallbackApkUrl;
  const status = ota?.status ?? 'idle';
  const errorMessage = ota?.errorMessage ?? null;

  const handleOpenApkDownload = async () => {
    if (!apkUrl) return;
    setApkOpenError(null);
    const opened = await openExternalUrl(apkUrl);
    if (!opened) {
      setApkOpenError(t('infoHub.webLinkError'));
    }
  };

  const renderStatusAlert = () => {
    if (status === 'available') {
      return (
        <InlineAlert
          testID="ota-card-status-available"
          tone="info"
          title={t('updates.availableTitle')}
          message={t('updates.availableMessage')}
        />
      );
    }
    if (status === 'ready') {
      return (
        <InlineAlert
          testID="ota-card-status-ready"
          tone="safe"
          title={t('updates.readyTitle')}
          message={t('updates.readyMessage')}
        />
      );
    }
    if (status === 'up-to-date') {
      return (
        <InlineAlert
          testID="ota-card-status-uptodate"
          tone="safe"
          message={t('updates.upToDate')}
        />
      );
    }
    if (status === 'offline') {
      return (
        <InlineAlert
          testID="ota-card-status-offline"
          tone="warning"
          message={t('updates.offline')}
        />
      );
    }
    if (status === 'unsupported') {
      return (
        <InlineAlert
          testID="ota-card-status-unsupported"
          tone="info"
          message={t('updates.unsupported')}
        />
      );
    }
    if (status === 'error') {
      return (
        <InlineAlert
          testID="ota-card-status-error"
          tone="danger"
          title={t('updates.errorTitle')}
          message={
            errorMessage
              ? `${t('updates.errorFallback')} (${errorMessage})`
              : t('updates.errorFallback')
          }
        />
      );
    }
    return null;
  };

  return (
    <ClinicalCard testID="info-ota-updates-card" tone="elevated">
      <Text
        accessibilityRole="header"
        style={[typography.titleMedium, { color: colors.onSurface }]}
      >
        {t('infoHub.updatesTitle')}
      </Text>

      <View
        style={[
          styles.metaGrid,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.outlineVariant,
            borderRadius: radii.md,
            padding: spacing.md,
            gap: spacing.xs,
          },
        ]}
      >
        <View style={styles.metaRow}>
          <Text
            style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
          >
            {t('infoHub.versionLabel')}
          </Text>
          <Text
            style={[typography.numericLabel, { color: colors.onSurface }]}
          >
            {`v${envInfo.appVersion}`}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text
            style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
          >
            {t('infoHub.channelLabel')}
          </Text>
          <Text
            style={[typography.numericLabel, { color: colors.onSurface }]}
          >
            {envInfo.channel ?? 'preview'}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Text
            style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
          >
            {t('infoHub.patchStatusPrefix')}
          </Text>
          <Text
            style={[typography.numericLabel, { color: colors.primary }]}
          >
            {envInfo.updateId && !envInfo.isEmbeddedLaunch
              ? envInfo.updateId.slice(0, 8)
              : t('infoHub.embeddedBundle')}
          </Text>
        </View>
      </View>

      {renderStatusAlert()}

      {ota && (
        <View style={{ gap: spacing.sm }}>
          {status === 'available' ? (
            <ClinicalButton
              testID="ota-card-download-btn"
              variant="filled"
              icon={DownloadCloud}
              label={t('updates.downloadBtn')}
              onPress={() => {
                void ota.downloadUpdate();
              }}
            />
          ) : status === 'ready' ? (
            <ClinicalButton
              testID="ota-card-apply-btn"
              variant="filled"
              icon={RefreshCw}
              label={t('updates.applyBtn')}
              onPress={() => {
                void ota.applyUpdate();
              }}
            />
          ) : (
            <ClinicalButton
              testID="ota-card-check-btn"
              variant="tonal"
              icon={RefreshCw}
              loading={status === 'checking' || status === 'downloading'}
              label={
                status === 'checking'
                  ? t('infoHub.checkingUpdates')
                  : status === 'downloading'
                    ? t('updates.downloadingTitle')
                    : t('infoHub.checkUpdatesBtn')
              }
              onPress={() => {
                void ota.checkForUpdates({ manual: true });
              }}
            />
          )}
        </View>
      )}

      {apkOpenError && (
        <InlineAlert
          testID="ota-card-apk-error"
          tone="danger"
          message={apkOpenError}
        />
      )}

      {apkUrl && (
        <ClinicalButton
          testID="ota-card-apk-download-btn"
          variant="outlined"
          icon={Download}
          label={t('infoHub.downloadApkBtn')}
          onPress={() => {
            void handleOpenApkDownload();
          }}
        />
      )}
    </ClinicalCard>
  );
}

const styles = StyleSheet.create({
  metaGrid: {
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
