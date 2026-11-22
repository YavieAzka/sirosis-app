import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Hospital } from 'lucide-react-native';

import { SaveToDatabaseSection } from '@/components/clinical';
import { ClinicalCard } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import {
  buildLosSavePayload,
  savePredictionToDatabase,
} from '@/services/api';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { LosPredictRequest, LosPredictResponse } from '@/types/api';
import type { Gender } from '@/types/clinical';

export interface LosResultPanelProps {
  result: LosPredictResponse | null;
  submittedInput: LosPredictRequest | null;
  submittedGender: Gender;
  meldScore: string | null;
  testIDPrefix?: string;
}

export function LosResultPanel({
  result,
  submittedInput,
  submittedGender,
  meldScore,
  testIDPrefix = 'los-result',
}: LosResultPanelProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  if (!result || !submittedInput) {
    return (
      <ClinicalCard testID={`${testIDPrefix}-empty`} tone="neutral">
        <View style={[styles.emptyHeader, { gap: spacing.sm }]}>
          <Hospital size={22} color={colors.primary} strokeWidth={2} />
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
            {t('los.modal.title')}
          </Text>
        </View>
        <Text style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}>
          {t('guide.step4Desc')}
        </Text>
      </ClinicalCard>
    );
  }

  const isProlonged = result.probability_los >= 0.5;
  const probTone = isProlonged ? 'warning' : 'info';
  const rolePalette = colors.clinical[probTone];
  const probPercent = (result.probability_los * 100).toFixed(1);

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
                textAlign: 'center',
              },
            ]}
          >
            {t('los.modal.probTitle')}
          </Text>

          <Text
            testID={`${testIDPrefix}-probability`}
            style={[typography.numericDisplay, { color: rolePalette.main }]}
          >
            {probPercent}%
          </Text>

          {meldScore !== null && (
            <View
              style={[
                styles.meldChip,
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
                testID={`${testIDPrefix}-meld`}
                style={[
                  typography.labelMedium,
                  typography.numericBody,
                  { color: rolePalette.onContainer },
                ]}
              >
                {t('calculators.meld.title')}: {meldScore}
              </Text>
            </View>
          )}
        </View>
      </ClinicalCard>

      <SaveToDatabaseSection
        testIDPrefix={`${testIDPrefix}-save`}
        successMessage={t('save.successLos')}
        onSave={async ({ token, patientName, medicalRecordNumber }) => {
          const payload = buildLosSavePayload({
            input: submittedInput,
            gender: submittedGender,
            probabilityLos: result.probability_los,
            meldScore: meldScore ? Number(meldScore) : 0,
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
  meldChip: {
    borderWidth: 1,
  },
});
