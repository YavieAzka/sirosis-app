import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calculator } from 'lucide-react-native';

import { ClinicalButton, ClinicalCard, InlineAlert } from '@/components/ui';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export interface GuideContentProps {
  onOpenCalculators?: () => void;
}

export function GuideContent({ onOpenCalculators }: GuideContentProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing, radii } = theme;

  const steps = [
    {
      num: '1',
      title: t('guide.step1Title'),
      desc: t('guide.step1Desc'),
    },
    {
      num: '2',
      title: t('guide.step2Title'),
      desc: t('guide.step2Desc'),
    },
    {
      num: '3',
      title: t('guide.step3Title'),
      desc: t('guide.step3Desc'),
    },
    {
      num: '4',
      title: t('guide.step4Title'),
      desc: t('guide.step4Desc'),
    },
  ];

  return (
    <View
      testID="guide-content-root"
      style={[
        styles.container,
        isWide && styles.readableMeasure,
        { gap: spacing.lg },
      ]}
    >
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.headlineSmall, { color: colors.onSurface }]}
        >
          {t('guide.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('guide.subtitle')}
        </Text>
      </View>

      <View
        style={[
          styles.stepsPanel,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
          },
        ]}
      >
        {steps.map((step, index) => (
          <View
            key={step.num}
            testID={`guide-step-${step.num}`}
            style={[
              styles.stepRow,
              {
                padding: spacing.lg,
                gap: spacing.md,
                borderTopWidth: index > 0 ? StyleSheet.hairlineWidth : 0,
                borderTopColor: colors.outlineVariant,
              },
            ]}
          >
            <View
              style={[
                styles.stepBadge,
                {
                  backgroundColor: colors.primaryContainer,
                  borderRadius: radii.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.numericTitle,
                  { color: colors.onPrimaryContainer },
                ]}
              >
                {step.num}
              </Text>
            </View>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
                {step.title}
              </Text>
              <Text
                style={[
                  typography.bodyMedium,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {step.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <ClinicalCard tone="info">
        <Text
          style={[
            typography.titleSmall,
            { color: colors.clinical.info.onContainer },
          ]}
        >
          {t('guide.offlineTipTitle')}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.clinical.info.onContainer },
          ]}
        >
          {t('guide.offlineTipDesc')}
        </Text>
      </ClinicalCard>

      <InlineAlert
        testID="guide-disclaimer-alert"
        tone="warning"
        title={t('disclaimer.title')}
        message={t('disclaimer.text')}
      />

      {onOpenCalculators && (
        <ClinicalButton
          testID="guide-open-calculators-btn"
          variant="filled"
          icon={Calculator}
          label={t('guide.ctaOpenCalculators')}
          onPress={onOpenCalculators}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  readableMeasure: {
    maxWidth: 740,
    alignSelf: 'center',
  },
  stepsPanel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
