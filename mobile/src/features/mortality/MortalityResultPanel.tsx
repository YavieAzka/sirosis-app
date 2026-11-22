import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp, HeartPulse } from 'lucide-react-native';

import { SaveToDatabaseSection } from '@/components/clinical';
import { ClinicalButton, ClinicalCard } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import {
  buildMortalitySavePayload,
  savePredictionToDatabase,
} from '@/services/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type {
  MortalityPredictRequest,
  MortalityPredictResponse,
} from '@/types/api';

export interface MortalityResultPanelProps {
  result: MortalityPredictResponse | null;
  submittedInput: MortalityPredictRequest | null;
  defaultExpandedShap?: boolean;
  testIDPrefix?: string;
}

export function MortalityResultPanel({
  result,
  submittedInput,
  defaultExpandedShap = false,
  testIDPrefix = 'mortality-result',
}: MortalityResultPanelProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;
  const [showShap, setShowShap] = useState(defaultExpandedShap);

  const maxAbsContribution = useMemo(() => {
    if (!result?.shap_contributions?.length) return 1;
    const maxVal = Math.max(
      ...result.shap_contributions.map((item) => Math.abs(item.contribution))
    );
    return maxVal > 0 ? maxVal : 1;
  }, [result]);

  if (!result || !submittedInput) {
    return (
      <ClinicalCard testID={`${testIDPrefix}-empty`} tone="neutral">
        <View style={[styles.emptyHeader, { gap: spacing.sm }]}>
          <HeartPulse size={22} color={colors.primary} strokeWidth={2} />
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
            {t('mortality.modal.title')}
          </Text>
        </View>
        <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>
          {t('guide.step4Desc')}
        </Text>
      </ClinicalCard>
    );
  }

  const isHighRisk = result.probability >= 0.4;
  const probTone = isHighRisk ? 'danger' : 'safe';
  const rolePalette = colors.clinical[probTone];
  const probPercent = (result.probability * 100).toFixed(1);

  return (
    <View testID={`${testIDPrefix}-container`} style={{ gap: spacing.md }}>
      <ClinicalCard testID={`${testIDPrefix}-card`} tone={probTone}>
        <View style={styles.probHeader}>
          <Text
            style={[
              typography.labelLarge,
              {
                color: rolePalette.onContainer,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              },
            ]}
          >
            {t('mortality.modal.probTitle')}
          </Text>

          <Text
            testID={`${testIDPrefix}-probability`}
            style={[typography.numericDisplay, { color: rolePalette.main }]}
          >
            {probPercent}%
          </Text>

          <View
            style={[
              styles.aiBadge,
              {
                backgroundColor: colors.surface,
                borderColor: rolePalette.border,
                borderRadius: radii.full,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.xs,
              },
            ]}
          >
            <Text
              testID={`${testIDPrefix}-label`}
              style={[typography.labelMedium, { color: rolePalette.onContainer }]}
            >
              {t('mortality.modal.aiLabel')}:{' '}
              {result.predicted_class === 1
                ? t('mortality.modal.highRisk')
                : t('mortality.modal.survive')}
            </Text>
          </View>
        </View>
      </ClinicalCard>

      <ClinicalButton
        testID={`${testIDPrefix}-toggle-shap`}
        variant="tonal"
        icon={showShap ? ChevronUp : ChevronDown}
        label={
          showShap
            ? t('mortality.modal.hideShap')
            : t('mortality.modal.showShap')
        }
        onPress={() => setShowShap((prev) => !prev)}
      />

      {showShap && (
        <ClinicalCard testID={`${testIDPrefix}-shap-panel`} tone="elevated">
          <View style={styles.shapHeader}>
            <Text
              style={[
                typography.titleSmall,
                { color: colors.onSurface, flex: 1 },
              ]}
            >
              {t('mortality.modal.riskContrib')}
            </Text>
            <View
              style={[
                styles.explainerTag,
                {
                  backgroundColor: colors.surfaceContainer,
                  borderRadius: radii.xs,
                  paddingHorizontal: spacing.sm,
                  paddingVertical: 2,
                },
              ]}
            >
              <Text
                style={[
                  typography.numericLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                SHAP.TreeExplainer
              </Text>
            </View>
          </View>

          <View style={{ gap: spacing.sm }}>
            {result.shap_contributions.map((shap, index) => {
              const isPositive = shap.contribution > 0;
              const impactPalette = isPositive
                ? colors.clinical.danger
                : colors.clinical.safe;
              const impactPct = (Math.abs(shap.contribution) * 100).toFixed(1);
              const barWidthPct = Math.max(
                8,
                Math.round(
                  (Math.abs(shap.contribution) / maxAbsContribution) * 100
                )
              );
              const featureLabel = t(
                `mortality.featureLabels.${shap.feature}`,
                { defaultValue: shap.feature }
              );

              return (
                <View
                  key={`${shap.feature}-${index}`}
                  testID={`${testIDPrefix}-shap-item-${index}`}
                  style={[
                    styles.shapItem,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      borderColor: colors.outlineVariant,
                      borderRadius: radii.md,
                      padding: spacing.md,
                      gap: spacing.xs,
                    },
                  ]}
                >
                  <View style={styles.shapItemRow}>
                    <View style={{ flex: 1, paddingRight: spacing.sm }}>
                      <Text
                        style={[
                          typography.titleSmall,
                          { color: colors.onSurface },
                        ]}
                      >
                        {featureLabel}
                      </Text>
                      <Text
                        style={[
                          typography.bodySmall,
                          typography.numericBody,
                          { color: colors.onSurfaceVariant },
                        ]}
                      >
                        {t('mortality.modal.patientInput')}: {shap.value_input}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.impactBadge,
                        {
                          backgroundColor: impactPalette.container,
                          borderColor: impactPalette.border,
                          borderRadius: radii.sm,
                          paddingHorizontal: spacing.sm,
                          paddingVertical: spacing.xs,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          typography.numericBody,
                          { color: impactPalette.onContainer },
                        ]}
                      >
                        {isPositive ? '+' : '-'}
                        {impactPct}%
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.barTrack,
                      {
                        backgroundColor: colors.surfaceContainerHigh,
                        borderRadius: radii.full,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${barWidthPct}%`,
                          backgroundColor: impactPalette.main,
                          borderRadius: radii.full,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </ClinicalCard>
      )}

      <SaveToDatabaseSection
        testIDPrefix={`${testIDPrefix}-save`}
        successMessage={t('save.successMortality')}
        onSave={async ({ token, patientName, medicalRecordNumber }) => {
          const payload = buildMortalitySavePayload({
            input: submittedInput,
            result,
            token,
            patientName,
            medicalRecordNumber,
          });
          await savePredictionToDatabase(payload);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  probHeader: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  aiBadge: {
    borderWidth: 1,
  },
  shapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  explainerTag: {
    alignSelf: 'flex-start',
  },
  shapItem: {
    borderWidth: 1,
  },
  shapItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactBadge: {
    minWidth: 68,
    borderWidth: 1,
    alignItems: 'center',
  },
  barTrack: {
    height: 6,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
  },
});
