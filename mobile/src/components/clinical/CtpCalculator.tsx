import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  ClinicalCard,
  MaterialSelectSheet,
  SwitchRow,
  type SelectOption,
} from '@/components/ui';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import type {
  CtpEncoded,
  CtpParamKey,
  CtpParams,
  CtpResult,
  CtpScoreValue,
} from '@/types/clinical';
import { CTP_OPTIONS, hitungSkorCtp } from '@/utils/clinical';

export interface CtpCalculatorProps {
  active: boolean;
  onToggleActive: (active: boolean) => void;
  params: CtpParams;
  onChangeParam: (key: CtpParamKey, value: CtpScoreValue) => void;
  manualEncoded: CtpEncoded;
  onChangeManualEncoded: (encoded: CtpEncoded) => void;
  testIDPrefix?: string;
}

const PARAM_KEYS: CtpParamKey[] = [
  'bilirubin',
  'albumin',
  'inr',
  'ascites',
  'encephalopathy',
];

export function CtpCalculator({
  active,
  onToggleActive,
  params,
  onChangeParam,
  manualEncoded,
  onChangeManualEncoded,
  testIDPrefix = 'ctp',
}: CtpCalculatorProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { colors, typography, radii, spacing } = theme;

  const result: CtpResult | null = useMemo(
    () => hitungSkorCtp(params),
    [params]
  );

  const manualOptions: SelectOption<CtpEncoded>[] = useMemo(
    () => [
      { value: 1, label: t('calculators.ctp.classA') },
      { value: 2, label: t('calculators.ctp.classB') },
      { value: 3, label: t('calculators.ctp.classC') },
    ],
    [t]
  );

  return (
    <ClinicalCard testID={`${testIDPrefix}-card`}>
      <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
        {t('calculators.ctp.title')}
      </Text>

      <SwitchRow
        testID={`${testIDPrefix}-auto-toggle`}
        label={t('calculators.ctp.autoToggle')}
        value={active}
        onValueChange={onToggleActive}
      />

      {active && (
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
          {PARAM_KEYS.map((key) => {
            const options: SelectOption<CtpScoreValue>[] = CTP_OPTIONS[key].map(
              (opt) => ({
                value: opt.value,
                label: t(opt.labelKey, { defaultValue: opt.fallbackLabel }),
              })
            );
            return (
              <MaterialSelectSheet<CtpScoreValue>
                key={key}
                testID={`${testIDPrefix}-param-${key}`}
                label={t(`calculators.ctp.params.${key}`)}
                value={params[key]}
                options={options}
                placeholder={`-- ${t('common.select')} --`}
                onSelect={(val) => onChangeParam(key, val)}
              />
            );
          })}

          {result && (
            <View
              testID={`${testIDPrefix}-auto-result`}
              accessibilityLiveRegion="polite"
              style={[
                styles.resultPill,
                {
                  backgroundColor: colors.primaryContainer,
                  borderRadius: radii.md,
                  padding: spacing.md,
                },
              ]}
            >
              <Text
                style={[
                  typography.titleSmall,
                  typography.numericBody,
                  { color: colors.onPrimaryContainer, textAlign: 'center' },
                ]}
              >
                {t('calculators.ctp.totalScore')}: {result.total} →{' '}
                {t('calculators.ctp.classLabel')}: {result.kelas}
              </Text>
            </View>
          )}
        </View>
      )}

      <MaterialSelectSheet<CtpEncoded>
        testID={`${testIDPrefix}-manual-select`}
        label={t('calculators.ctp.manualLabel')}
        value={manualEncoded}
        options={manualOptions}
        disabled={active}
        onSelect={onChangeManualEncoded}
      />
    </ClinicalCard>
  );
}

const styles = StyleSheet.create({
  autoPanel: {
    borderWidth: 1,
  },
  resultPill: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
