import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ClinicalCard } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { hitungMeldUnos } from '@/utils/clinical';
import { parseLocaleNumber } from '@/utils/validation';

export interface MeldScoreCardProps {
  bilirubin: string;
  inr: string;
  creatinine: string;
  testID?: string;
}

export function MeldScoreCard({
  bilirubin,
  inr,
  creatinine,
  testID = 'meld-score-card',
}: MeldScoreCardProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  const meldScore = useMemo(() => {
    const bil = parseLocaleNumber(bilirubin);
    const inrVal = parseLocaleNumber(inr);
    const cr = parseLocaleNumber(creatinine);
    if (bil === null || inrVal === null || cr === null) return null;
    return hitungMeldUnos(bil, inrVal, cr);
  }, [bilirubin, inr, creatinine]);

  return (
    <ClinicalCard testID={testID} tone="info">
      <View style={[styles.row, { gap: spacing.md }]}>
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text
            style={[
              typography.titleSmall,
              { color: colors.clinical.info.onContainer },
            ]}
          >
            {t('calculators.meld.title')}
          </Text>
          <Text
            style={[
              typography.bodySmall,
              { color: colors.clinical.info.onContainer },
            ]}
          >
            {t('calculators.meld.subtitle')}
          </Text>
        </View>

        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.scoreBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.clinical.info.border,
              borderRadius: radii.md,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
            },
          ]}
        >
          {meldScore !== null ? (
            <>
              <Text
                testID={`${testID}-value`}
                style={[
                  typography.numericTitle,
                  { color: colors.clinical.info.main },
                ]}
              >
                {meldScore}
              </Text>
              <Text
                style={[
                  typography.labelSmall,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {t('calculators.meld.scoreLabel')}
              </Text>
            </>
          ) : (
            <Text
              testID={`${testID}-waiting`}
              style={[
                typography.labelSmall,
                { color: colors.onSurfaceVariant, textAlign: 'center' },
              ]}
            >
              {t('calculators.meld.waiting')}
            </Text>
          )}
        </View>
      </View>
    </ClinicalCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreBox: {
    minWidth: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
