import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';

import { ClinicalCard, InlineAlert } from '@/components/ui';
import {
  COHORT_CHARACTERISTICS,
  CONCORDANCE_CASES,
  DOSE_APPROPRIATENESS_DATA,
  MODEL_METRICS_TABLE,
} from '@/constants/methodologyData';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export function CohortSection() {
  const { theme } = useAppTheme();
  const { language, t } = useAppLanguage();
  const { colors, typography, spacing, radii } = theme;
  const isEn = language === 'en';

  return (
    <View testID="methodology-panel-cohort" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.cohort.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.cohort.subtitle')}
        </Text>
      </View>

      {COHORT_CHARACTERISTICS.map((group) => (
        <View
          key={group.category}
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
              borderRadius: radii.lg,
            },
          ]}
        >
          <View
            style={[
              styles.panelHeader,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderBottomColor: colors.outlineVariant,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
              },
            ]}
          >
            <Text style={[typography.titleSmall, { color: colors.primary }]}>
              {isEn ? group.categoryEn : group.categoryId}
            </Text>
          </View>

          {group.items.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.cohortRow,
                {
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                  borderTopColor: colors.outlineVariant,
                  gap: spacing.xs,
                },
              ]}
            >
              <View style={styles.cohortMainRow}>
                <Text
                  style={[
                    typography.bodyMedium,
                    { color: colors.onSurface, flex: 1, paddingRight: spacing.sm },
                  ]}
                >
                  {isEn ? item.labelEn : item.labelId}
                </Text>
                <Text
                  style={[
                    typography.numericBody,
                    {
                      color: colors.onSurface,
                      fontWeight: '700',
                      textAlign: 'right',
                    },
                  ]}
                >
                  {item.value}
                </Text>
              </View>
              {item.missing && (
                <Text
                  style={[
                    typography.bodySmall,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {t('methodology.cohort.missingPrefix')} {item.missing}
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}

      <InlineAlert
        tone="warning"
        title={t('methodology.cohort.observationTitle')}
        message={t('methodology.cohort.observationBody')}
      />
    </View>
  );
}

export function MetricsSection() {
  const { theme } = useAppTheme();
  const { language, t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing, radii } = theme;
  const isEn = language === 'en';

  return (
    <View testID="methodology-panel-metrics" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.sm }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.metrics.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.metrics.subtitle')}
        </Text>
        <View
          style={[
            styles.inlineBadge,
            {
              backgroundColor: colors.clinical.safe.container,
              borderColor: colors.clinical.safe.border,
              borderRadius: radii.full,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.xs,
              gap: spacing.xs,
            },
          ]}
        >
          <CheckCircle2
            size={16}
            color={colors.clinical.safe.onContainer}
            strokeWidth={2.2}
          />
          <Text
            style={[
              typography.labelMedium,
              { color: colors.clinical.safe.onContainer },
            ]}
          >
            {t('methodology.metrics.primaryModelBadge')}
          </Text>
        </View>
      </View>

      {isWide ? (
        <View
          testID="metrics-wide-table"
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
              borderRadius: radii.lg,
            },
          ]}
        >
          <View
            style={[
              styles.wideTableRow,
              {
                backgroundColor: colors.primary,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.md,
              },
            ]}
          >
            <Text style={[typography.labelMedium, styles.metricColName, { color: colors.onPrimary }]}>
              {t('methodology.metrics.colMetric')}
            </Text>
            <Text style={[typography.labelMedium, styles.metricColVal, { color: colors.onPrimary }]}>
              {t('methodology.metrics.colMortalityRf')}
            </Text>
            <Text style={[typography.labelMedium, styles.metricColVal, { color: colors.onPrimary }]}>
              {t('methodology.metrics.colMortalityXgb')}
            </Text>
            <Text style={[typography.labelMedium, styles.metricColVal, { color: colors.onPrimary }]}>
              {t('methodology.metrics.colLosRf')}
            </Text>
            <Text style={[typography.labelMedium, styles.metricColVal, { color: colors.onPrimary }]}>
              {t('methodology.metrics.colLosXgb')}
            </Text>
          </View>

          {MODEL_METRICS_TABLE.map((row, idx) => (
            <View
              key={row.metric}
              style={[
                styles.wideTableRow,
                {
                  backgroundColor: row.highlight
                    ? colors.clinical.warning.container
                    : idx % 2 === 0
                      ? colors.surface
                      : colors.surfaceContainerLow,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.outlineVariant,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.md,
                },
              ]}
            >
              <View style={styles.metricColName}>
                <Text
                  style={[
                    typography.labelLarge,
                    {
                      color: row.highlight
                        ? colors.clinical.warning.onContainer
                        : colors.onSurface,
                    },
                  ]}
                >
                  {isEn ? row.labelEn : row.labelId}
                </Text>
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: row.highlight
                        ? colors.clinical.warning.onContainer
                        : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {isEn ? row.descriptionEn : row.descriptionId}
                </Text>
              </View>
              <Text
                style={[
                  typography.numericBody,
                  styles.metricColVal,
                  { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {row.mortalityRf}
              </Text>
              <Text
                style={[
                  typography.numericBody,
                  styles.metricColVal,
                  { color: colors.onSurface },
                ]}
              >
                {row.mortalityXgb}
              </Text>
              <Text
                style={[
                  typography.numericBody,
                  styles.metricColVal,
                  { color: colors.onSurface, fontWeight: '700' },
                ]}
              >
                {row.losRf}
              </Text>
              <Text
                style={[
                  typography.numericBody,
                  styles.metricColVal,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {row.losXgb}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <View testID="metrics-compact-list" style={{ gap: spacing.sm }}>
          {MODEL_METRICS_TABLE.map((row) => (
            <View
              key={row.metric}
              style={[
                styles.compactMetricCard,
                {
                  backgroundColor: row.highlight
                    ? colors.clinical.warning.container
                    : colors.surface,
                  borderColor: row.highlight
                    ? colors.clinical.warning.border
                    : colors.outlineVariant,
                  borderRadius: radii.lg,
                  padding: spacing.md,
                  gap: spacing.sm,
                },
              ]}
            >
              <View style={{ gap: 2 }}>
                <Text
                  style={[
                    typography.titleSmall,
                    {
                      color: row.highlight
                        ? colors.clinical.warning.onContainer
                        : colors.onSurface,
                    },
                  ]}
                >
                  {isEn ? row.labelEn : row.labelId}
                </Text>
                <Text
                  style={[
                    typography.bodySmall,
                    {
                      color: row.highlight
                        ? colors.clinical.warning.onContainer
                        : colors.onSurfaceVariant,
                    },
                  ]}
                >
                  {isEn ? row.descriptionEn : row.descriptionId}
                </Text>
              </View>

              <View style={[styles.compactGrid, { gap: spacing.sm }]}>
                <View
                  style={[
                    styles.compactCell,
                    {
                      backgroundColor: colors.primaryContainer,
                      borderRadius: radii.md,
                      padding: spacing.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: colors.onPrimaryContainer },
                    ]}
                  >
                    {t('methodology.metrics.colMortalityRf')}
                  </Text>
                  <Text
                    style={[
                      typography.numericBody,
                      { color: colors.onPrimaryContainer, fontWeight: '700' },
                    ]}
                  >
                    {row.mortalityRf}
                  </Text>
                </View>

                <View
                  style={[
                    styles.compactCell,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      borderRadius: radii.md,
                      padding: spacing.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {t('methodology.metrics.colMortalityXgb')}
                  </Text>
                  <Text
                    style={[
                      typography.numericBody,
                      { color: colors.onSurface },
                    ]}
                  >
                    {row.mortalityXgb}
                  </Text>
                </View>

                <View
                  style={[
                    styles.compactCell,
                    {
                      backgroundColor: colors.clinical.info.container,
                      borderRadius: radii.md,
                      padding: spacing.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: colors.clinical.info.onContainer },
                    ]}
                  >
                    {t('methodology.metrics.colLosRf')}
                  </Text>
                  <Text
                    style={[
                      typography.numericBody,
                      { color: colors.clinical.info.onContainer, fontWeight: '700' },
                    ]}
                  >
                    {row.losRf}
                  </Text>
                </View>

                <View
                  style={[
                    styles.compactCell,
                    {
                      backgroundColor: colors.surfaceContainerLow,
                      borderRadius: radii.md,
                      padding: spacing.sm,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {t('methodology.metrics.colLosXgb')}
                  </Text>
                  <Text
                    style={[
                      typography.numericBody,
                      { color: colors.onSurface },
                    ]}
                  >
                    {row.losXgb}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <ClinicalCard tone="neutral">
        <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
          {t('methodology.metrics.interpretationTitle')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.metrics.interpretation1')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.metrics.interpretation2')}
        </Text>
      </ClinicalCard>
    </View>
  );
}

export function DosingValidationSection() {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, spacing, radii } = theme;

  return (
    <View testID="methodology-panel-dosing" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.dosing.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.dosing.subtitle')}
        </Text>
      </View>

      {/* Table 2: Real-World Dose Appropriateness */}
      <View
        style={[
          styles.panel,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
          },
        ]}
      >
        <View
          style={[
            styles.panelHeader,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderBottomColor: colors.outlineVariant,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
          ]}
        >
          <Text style={[typography.titleSmall, { color: colors.primary }]}>
            {t('methodology.dosing.table2Title')}
          </Text>
        </View>

        {DOSE_APPROPRIATENESS_DATA.map((item, idx) => (
          <View
            key={item.drug}
            style={[
              styles.cohortRow,
              {
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.md,
                borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                borderTopColor: colors.outlineVariant,
                gap: spacing.xs,
              },
            ]}
          >
            <View style={styles.cohortMainRow}>
              <Text
                style={[
                  typography.titleSmall,
                  { color: colors.onSurface, flex: 1, paddingRight: spacing.sm },
                ]}
              >
                {item.drug}
              </Text>
              <Text
                style={[
                  typography.numericLabel,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {`${item.category} · n=${item.n}`}
              </Text>
            </View>

            <View style={[styles.doseRatioRow, { gap: spacing.sm }]}>
              <View
                style={[
                  styles.ratioPill,
                  {
                    backgroundColor: colors.clinical.safe.container,
                    borderRadius: radii.sm,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 4,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.numericLabel,
                    { color: colors.clinical.safe.onContainer },
                  ]}
                >
                  {`${t('methodology.dosing.colAppropriate')}: ${item.appropriateCount} (${item.appropriatePct})`}
                </Text>
              </View>

              <View
                style={[
                  styles.ratioPill,
                  {
                    backgroundColor: colors.clinical.danger.container,
                    borderRadius: radii.sm,
                    paddingHorizontal: spacing.sm,
                    paddingVertical: 4,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.numericLabel,
                    { color: colors.clinical.danger.onContainer },
                  ]}
                >
                  {`${t('methodology.dosing.colInappropriate')}: ${item.inappropriateCount} (${item.inappropriatePct})`}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Table 4: Concordance Across 5 Stratified Patients */}
      <View
        style={[
          styles.panel,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
          },
        ]}
      >
        <View
          style={[
            styles.concordanceHeader,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderBottomColor: colors.outlineVariant,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              gap: spacing.xs,
            },
          ]}
        >
          <Text style={[typography.titleSmall, { color: colors.primary }]}>
            {t('methodology.dosing.table4Title')}
          </Text>
          <View
            style={[
              styles.inlineBadge,
              {
                backgroundColor: colors.clinical.safe.container,
                borderColor: colors.clinical.safe.border,
                borderRadius: radii.full,
                paddingHorizontal: spacing.sm,
                paddingVertical: 2,
              },
            ]}
          >
            <Text
              style={[
                typography.labelSmall,
                { color: colors.clinical.safe.onContainer },
              ]}
            >
              {t('methodology.dosing.agreementBadge')}
            </Text>
          </View>
        </View>

        {CONCORDANCE_CASES.map((c, idx) => {
          const isConcordant = c.agreement.includes('Concordant');
          const statusPalette = isConcordant
            ? colors.clinical.safe
            : colors.clinical.danger;

          return (
            <View
              key={`${c.patient}-${c.drug}-${idx}`}
              style={[
                styles.cohortRow,
                {
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                  borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                  borderTopColor: colors.outlineVariant,
                  gap: spacing.xs,
                },
              ]}
            >
              <View style={styles.cohortMainRow}>
                <Text
                  style={[
                    typography.titleSmall,
                    { color: colors.onSurface, flex: 1, paddingRight: spacing.sm },
                  ]}
                >
                  {`P${c.patient} · ${c.drug}`}
                </Text>
                <View
                  style={[
                    styles.ratioPill,
                    {
                      backgroundColor: statusPalette.container,
                      borderColor: statusPalette.border,
                      borderWidth: 1,
                      borderRadius: radii.full,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: statusPalette.onContainer },
                    ]}
                  >
                    {c.agreement}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  typography.numericLabel,
                  { color: colors.primary },
                ]}
              >
                {`CTP ${c.ctp} · eGFR ${c.egfr} mL/min`}
              </Text>

              <Text
                style={[typography.bodySmall, { color: colors.onSurface }]}
              >
                {`${t('methodology.dosing.colSystemRec')}: ${c.systemRecommendation}`}
              </Text>
              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {`${t('methodology.dosing.colExpertLabel')}: ${c.clinicalLabel}`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  panelHeader: {
    borderBottomWidth: 1,
  },
  concordanceHeader: {
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  cohortRow: {},
  cohortMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  inlineBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  wideTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricColName: {
    flex: 2,
    paddingRight: 8,
  },
  metricColVal: {
    flex: 1,
    textAlign: 'center',
  },
  compactMetricCard: {
    borderWidth: 1,
  },
  compactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  compactCell: {
    minWidth: '46%',
    flexGrow: 1,
    gap: 2,
  },
  doseRatioRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratioPill: {},
});
