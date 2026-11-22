import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ClinicalCard, ClinicalNumberInput, SwitchRow } from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { hitungMap } from '@/utils/clinical';
import { parseLocaleNumber } from '@/utils/validation';

export interface MapInputCardProps {
  value: string;
  onChangeValue: (mapValue: string) => void;
  error?: string | null;
  testIDPrefix?: string;
}

export function MapInputCard({
  value,
  onChangeValue,
  error,
  testIDPrefix = 'map',
}: MapInputCardProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  const [auto, setAuto] = useState(false);
  const [sbp, setSbp] = useState('');
  const [dbp, setDbp] = useState('');

  const computedMap = useMemo(() => {
    if (!auto) return null;
    const sbpNum = parseLocaleNumber(sbp);
    const dbpNum = parseLocaleNumber(dbp);
    if (sbpNum === null || dbpNum === null) return null;
    return hitungMap(sbpNum, dbpNum);
  }, [auto, sbp, dbp]);

  useEffect(() => {
    if (auto && computedMap !== null && computedMap !== value) {
      onChangeValue(computedMap);
    }
  }, [auto, computedMap, value, onChangeValue]);

  return (
    <ClinicalCard testID={`${testIDPrefix}-card`}>
      <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
        {t('calculators.map.title')}
      </Text>

      <SwitchRow
        testID={`${testIDPrefix}-auto-toggle`}
        label={t('calculators.map.autoToggle')}
        value={auto}
        onValueChange={setAuto}
      />

      {auto && (
        <View
          testID={`${testIDPrefix}-auto-panel`}
          style={[
            styles.autoPanel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outlineVariant,
              borderRadius: radii.md,
              padding: spacing.md,
              gap: spacing.md,
            },
          ]}
        >
          <ClinicalNumberInput
            testID={`${testIDPrefix}-sbp-input`}
            label={t('calculators.map.sbp')}
            placeholder={t('calculators.map.placeholderSbp')}
            unit="mmHg"
            value={sbp}
            onChangeText={setSbp}
          />
          <ClinicalNumberInput
            testID={`${testIDPrefix}-dbp-input`}
            label={t('calculators.map.dbp')}
            placeholder={t('calculators.map.placeholderDbp')}
            unit="mmHg"
            value={dbp}
            onChangeText={setDbp}
          />
        </View>
      )}

      <ClinicalNumberInput
        testID={`${testIDPrefix}-value-input`}
        label={t('calculators.map.title')}
        placeholder={
          auto
            ? t('common.autoCalculated')
            : t('calculators.map.placeholderMap')
        }
        unit="mmHg"
        value={value}
        editable={!auto}
        error={error}
        onChangeText={(text) => {
          if (!auto) onChangeValue(text);
        }}
      />
    </ClinicalCard>
  );
}

const styles = StyleSheet.create({
  autoPanel: {
    borderWidth: 1,
  },
});
