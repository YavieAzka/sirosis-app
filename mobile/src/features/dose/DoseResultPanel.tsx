import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pill } from 'lucide-react-native';

import { ClinicalCard, InlineAlert } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { DosePredictResponse, DoseRecommendationItem } from '@/types/api';
import { classifyDoseStatusTone } from '@/utils/clinical';

export interface DoseResultPanelProps {
  result: DosePredictResponse | null;
  testIDPrefix?: string;
}

export function DoseResultPanel({
  result,
  testIDPrefix = 'dose-result',
}: DoseResultPanelProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  if (!result) {
    return (
      <ClinicalCard testID={`${testIDPrefix}-empty`} tone="neutral">
        <View style={[styles.emptyHeader, { gap: spacing.sm }]}>
          <Pill size={22} color={colors.primary} strokeWidth={2} />
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
            {t('dose.resultTitle')}
          </Text>
        </View>
        <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>
          {t('guide.step3Desc')}
        </Text>
      </ClinicalCard>
    );
  }

  if (result.info) {
    return (
      <View testID={`${testIDPrefix}-container`} style={{ gap: spacing.md }}>
        <InlineAlert
          testID={`${testIDPrefix}-warning-banner`}
          tone="danger"
          message={t('dose.warningReview')}
        />
        <ClinicalCard testID={`${testIDPrefix}-info-card`} tone="neutral">
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
            {result.info.obat}
          </Text>
          <Text
            style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
          >
            {result.info.alasan}
          </Text>
        </ClinicalCard>
      </View>
    );
  }

  const entries = Object.entries(result).filter(
    (entry): entry is [string, DoseRecommendationItem] => Boolean(entry[1])
  );

  return (
    <View testID={`${testIDPrefix}-container`} style={{ gap: spacing.md }}>
      <InlineAlert
        testID={`${testIDPrefix}-warning-banner`}
        tone="danger"
        message={t('dose.warningReview')}
      />

      {entries.map(([drugKey, item]) => {
        const tone = classifyDoseStatusTone(item.status);
        const cardTone = tone === 'neutral' ? 'neutral' : tone;
        const badgePalette =
          tone === 'neutral' ? null : colors.clinical[tone];

        return (
          <ClinicalCard
            key={drugKey}
            testID={`${testIDPrefix}-card-${drugKey}`}
            tone={cardTone}
          >
            <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
              {item.obat}
            </Text>

            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: badgePalette
                    ? colors.surface
                    : colors.surfaceContainer,
                  borderColor: badgePalette
                    ? badgePalette.border
                    : colors.outlineVariant,
                  borderRadius: radii.full,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                },
              ]}
            >
              <Text
                testID={`${testIDPrefix}-status-${drugKey}`}
                style={[
                  typography.labelMedium,
                  {
                    color: badgePalette
                      ? badgePalette.onContainer
                      : colors.onSurfaceVariant,
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>

            <Text
              testID={`${testIDPrefix}-range-${drugKey}`}
              style={[
                typography.numericTitle,
                { color: colors.onSurface },
              ]}
            >
              {item.rentang_dosis}
            </Text>

            <View
              style={[
                styles.reasonBox,
                {
                  borderTopColor: badgePalette
                    ? badgePalette.border
                    : colors.outlineVariant,
                  paddingTop: spacing.sm,
                },
              ]}
            >
              <Text style={[typography.bodyMedium, { color: colors.onSurface }]}>
                <Text style={{ fontWeight: '700' }}>
                  {t('dose.reasonLabel')}:{' '}
                </Text>
                {item.alasan}
              </Text>
            </View>

            {item.peringatan && item.peringatan.length > 0 && (
              <View
                style={[
                  styles.warningBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.clinical.danger.border,
                    borderRadius: radii.md,
                    padding: spacing.md,
                    gap: spacing.xs,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelMedium,
                    {
                      color: colors.clinical.danger.onContainer,
                      textTransform: 'uppercase',
                    },
                  ]}
                >
                  {t('dose.specialAttention')}
                </Text>
                {item.peringatan.map((warningText, idx) => (
                  <Text
                    key={idx}
                    style={[
                      typography.bodySmall,
                      { color: colors.onSurface },
                    ]}
                  >
                    {`• ${warningText}`}
                  </Text>
                ))}
              </View>
            )}
          </ClinicalCard>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  reasonBox: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  warningBox: {
    borderWidth: 1,
  },
});
