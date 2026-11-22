import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ClinicalCard,
  ClinicalNumberInput,
  InlineAlert,
  SegmentedToggle,
  SwitchRow,
} from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type { Gender } from '@/types/clinical';
import { hitungGfrCkdEpi } from '@/utils/clinical';
import { parseLocaleNumber } from '@/utils/validation';

export interface GfrCalculatorCardProps {
  mode: 'standalone' | 'linked';
  value: string;
  onChangeValue: (gfr: string) => void;
  gender: Gender;
  onChangeGender: (gender: Gender) => void;
  linkedScr?: string;
  linkedAge?: string;
  error?: string | null;
  testIDPrefix?: string;
}

export function GfrCalculatorCard({
  mode,
  value,
  onChangeValue,
  gender,
  onChangeGender,
  linkedScr = '',
  linkedAge = '',
  error,
  testIDPrefix = 'gfr',
}: GfrCalculatorCardProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  const [auto, setAuto] = useState(false);
  const [localScr, setLocalScr] = useState('');
  const [localAge, setLocalAge] = useState('');

  const effectiveScr = mode === 'linked' ? linkedScr : localScr;
  const effectiveAge = mode === 'linked' ? linkedAge : localAge;

  const computedGfr = useMemo(() => {
    if (!auto) return null;
    const scrNum = parseLocaleNumber(effectiveScr);
    const ageNum = parseLocaleNumber(effectiveAge);
    if (scrNum === null || ageNum === null) return null;
    return hitungGfrCkdEpi(scrNum, ageNum, gender);
  }, [auto, effectiveScr, effectiveAge, gender]);

  useEffect(() => {
    if (auto && computedGfr !== null && computedGfr !== value) {
      onChangeValue(computedGfr);
    }
  }, [auto, computedGfr, value, onChangeValue]);

  const genderOptions = useMemo(
    () => [
      { value: 'L' as Gender, label: t('calculators.gfr.male') },
      { value: 'P' as Gender, label: t('calculators.gfr.female') },
    ],
    [t]
  );

  return (
    <ClinicalCard testID={`${testIDPrefix}-card`}>
      <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
        {t('calculators.gfr.title')}
      </Text>

      <SwitchRow
        testID={`${testIDPrefix}-auto-toggle`}
        label={
          mode === 'linked'
            ? t('calculators.gfr.autoToggleFromFields')
            : t('calculators.gfr.autoToggle')
        }
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
          {mode === 'standalone' ? (
            <>
              <ClinicalNumberInput
                testID={`${testIDPrefix}-scr-input`}
                label={t('calculators.gfr.scr')}
                placeholder={t('calculators.gfr.placeholderScr')}
                unit="mg/dL"
                value={localScr}
                onChangeText={setLocalScr}
              />
              <ClinicalNumberInput
                testID={`${testIDPrefix}-age-input`}
                label={t('calculators.gfr.age')}
                placeholder={t('calculators.gfr.placeholderAge')}
                unit={t('calculators.gfr.age').includes('Tahun') ? 'thn' : 'yrs'}
                value={localAge}
                onChangeText={setLocalAge}
              />
            </>
          ) : (
            <InlineAlert
              testID={`${testIDPrefix}-linked-note`}
              tone="info"
              message={t('calculators.gfr.autoSourceNote')}
            />
          )}

          <SegmentedToggle<Gender>
            testID={`${testIDPrefix}-gender-toggle`}
            label={t('calculators.gfr.gender')}
            value={gender}
            options={genderOptions}
            onChange={onChangeGender}
          />
        </View>
      )}

      <ClinicalNumberInput
        testID={`${testIDPrefix}-value-input`}
        label={t('calculators.gfr.title')}
        placeholder={
          auto
            ? t('common.autoCalculated')
            : t('calculators.gfr.placeholderGfr')
        }
        unit="mL/min"
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
