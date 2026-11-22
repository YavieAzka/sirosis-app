import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calculator } from 'lucide-react-native';

import {
  ClinicalCard,
  ClinicalNumberInput,
  SegmentedToggle,
} from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { hitungInr } from '@/utils/clinical';
import { parseLocaleNumber } from '@/utils/validation';

export type InrInputMode = 'direct' | 'calculate';

export interface InrInputCardProps {
  value: string;
  onChangeValue: (inr: string) => void;
  error?: string | null;
  testIDPrefix?: string;
}

export function InrInputCard({
  value,
  onChangeValue,
  error,
  testIDPrefix = 'inr',
}: InrInputCardProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  const [mode, setMode] = useState<InrInputMode>('direct');
  const [directInr, setDirectInr] = useState(value);
  const [ptPatient, setPtPatient] = useState('');
  const [ptNormal, setPtNormal] = useState('');
  const [isi, setIsi] = useState('1.0');

  const calculatedInr = useMemo(() => {
    if (mode !== 'calculate') return null;
    const pt = parseLocaleNumber(ptPatient);
    const ptNorm = parseLocaleNumber(ptNormal);
    const isiVal = parseLocaleNumber(isi);
    if (pt === null || ptNorm === null || isiVal === null) return null;
    return hitungInr(pt, ptNorm, isiVal);
  }, [mode, ptPatient, ptNormal, isi]);

  useEffect(() => {
    if (mode === 'calculate') {
      const next = calculatedInr ?? '';
      if (next !== value) {
        onChangeValue(next);
      }
    }
  }, [mode, calculatedInr, value, onChangeValue]);

  const handleModeChange = (nextMode: InrInputMode) => {
    setMode(nextMode);
    if (nextMode === 'direct') {
      onChangeValue(directInr);
    } else {
      onChangeValue(calculatedInr ?? '');
    }
  };

  const modeOptions = useMemo(
    () => [
      { value: 'direct' as InrInputMode, label: t('calculators.inr.directMode') },
      {
        value: 'calculate' as InrInputMode,
        label: t('calculators.inr.calculateMode'),
      },
    ],
    [t]
  );

  return (
    <ClinicalCard testID={`${testIDPrefix}-card`}>
      <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
        {t('calculators.inr.title')}
      </Text>

      <SegmentedToggle<InrInputMode>
        testID={`${testIDPrefix}-mode-toggle`}
        value={mode}
        options={modeOptions}
        onChange={handleModeChange}
      />

      {mode === 'direct' ? (
        <ClinicalNumberInput
          testID={`${testIDPrefix}-direct-input`}
          label={t('calculators.inr.title')}
          placeholder={t('calculators.inr.placeholder')}
          value={directInr}
          error={error}
          onChangeText={(text) => {
            setDirectInr(text);
            onChangeValue(text);
          }}
        />
      ) : (
        <View
          testID={`${testIDPrefix}-calc-panel`}
          style={[
            styles.calcPanel,
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
            testID={`${testIDPrefix}-pt-patient-input`}
            label={t('calculators.inr.ptPatient')}
            placeholder={t('calculators.inr.placeholderPt')}
            unit="s"
            value={ptPatient}
            onChangeText={setPtPatient}
          />
          <ClinicalNumberInput
            testID={`${testIDPrefix}-pt-normal-input`}
            label={t('calculators.inr.ptNormal')}
            placeholder={t('calculators.inr.placeholderNormal')}
            unit="s"
            value={ptNormal}
            onChangeText={setPtNormal}
          />
          <ClinicalNumberInput
            testID={`${testIDPrefix}-isi-input`}
            label={t('calculators.inr.isiValue')}
            value={isi}
            onChangeText={setIsi}
          />

          <View
            testID={`${testIDPrefix}-calc-result`}
            accessibilityLiveRegion="polite"
            style={[
              styles.resultBanner,
              {
                backgroundColor: colors.primaryContainer,
                borderRadius: radii.md,
                padding: spacing.md,
              },
            ]}
          >
            <View style={[styles.resultLabelGroup, { gap: spacing.xs }]}>
              <Calculator
                size={18}
                color={colors.onPrimaryContainer}
                strokeWidth={2}
              />
              <Text
                style={[
                  typography.labelMedium,
                  { color: colors.onPrimaryContainer },
                ]}
              >
                {t('calculators.inr.resultLabel')}
              </Text>
            </View>
            <Text
              style={[
                typography.numericTitle,
                { color: colors.onPrimaryContainer },
              ]}
            >
              {calculatedInr ?? '--'}
            </Text>
          </View>
        </View>
      )}
    </ClinicalCard>
  );
}

const styles = StyleSheet.create({
  calcPanel: {
    borderWidth: 1,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
