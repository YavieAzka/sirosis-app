import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  FileText,
  HeartPulse,
  HelpCircle,
  Hospital,
  Mail,
  Microscope,
  Pill,
  ShieldCheck,
  Users,
} from 'lucide-react-native';

import { ClinicalButton, ClinicalCard, InlineAlert } from '@/components/ui';
import { TEAM_MEMBERS } from '@/constants/teamData';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { openMailto } from '@/utils/externalLinks';
import { TeamAvatar } from './TeamAvatar';

export interface AboutContentProps {
  onSelectTab?: (route: '/' | '/los' | '/dose') => void;
  onOpenMethodology?: () => void;
  onOpenGuide?: () => void;
}

export function AboutContent({
  onSelectTab,
  onOpenMethodology,
  onOpenGuide,
}: AboutContentProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing, radii } = theme;
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleOpenEmail = async (email: string, subject?: string) => {
    setEmailError(null);
    const opened = await openMailto(email, subject);
    if (!opened) {
      setEmailError(t('about.emailOpenError'));
    }
  };

  const metrics = [
    {
      id: 'cohort',
      icon: Users,
      badge: t('about.cohortBadge'),
      value: t('about.cohortMetricValue'),
      label: t('about.cohortMetricLabel'),
      sub: t('about.cohortMetricSub'),
      valueColor: colors.onSurface,
    },
    {
      id: 'auroc',
      icon: Award,
      badge: t('about.aurocBadge'),
      value: t('about.aurocMetricValue'),
      label: t('about.aurocMetricLabel'),
      sub: t('about.aurocMetricSub'),
      valueColor: colors.primary,
    },
    {
      id: 'concordance',
      icon: ShieldCheck,
      badge: t('about.concordanceBadge'),
      value: t('about.concordanceMetricValue'),
      label: t('about.concordanceMetricLabel'),
      sub: t('about.concordanceMetricSub'),
      valueColor: colors.clinical.safe.main,
    },
    {
      id: 'ethics',
      icon: FileText,
      badge: t('about.ethicsBadge'),
      value: t('about.ethicsMetricValue'),
      label: t('about.ethicsMetricLabel'),
      sub: t('about.ethicsMetricSub'),
      valueColor: colors.onSurface,
    },
  ];

  const dilemmas = [
    {
      id: 'mortality',
      icon: Activity,
      title: t('about.problem1Title'),
      desc: t('about.problem1Desc'),
    },
    {
      id: 'dosing',
      icon: Pill,
      title: t('about.problem2Title'),
      desc: t('about.problem2Desc'),
    },
    {
      id: 'xai',
      icon: Microscope,
      title: t('about.problem3Title'),
      desc: t('about.problem3Desc'),
    },
  ];

  const pillars: {
    id: string;
    route: '/' | '/los' | '/dose';
    icon: typeof HeartPulse;
    title: string;
    desc: string;
    points: string[];
    actionLabel: string;
  }[] = [
    {
      id: 'mortality',
      route: '/',
      icon: HeartPulse,
      title: t('about.pillar1Title'),
      desc: t('about.pillar1Desc'),
      points: [t('about.pillar1Point1'), t('about.pillar1Point2')],
      actionLabel: t('about.pillar1Action'),
    },
    {
      id: 'los',
      route: '/los',
      icon: Hospital,
      title: t('about.pillar2Title'),
      desc: t('about.pillar2Desc'),
      points: [t('about.pillar2Point1'), t('about.pillar2Point2')],
      actionLabel: t('about.pillar2Action'),
    },
    {
      id: 'dose',
      route: '/dose',
      icon: Pill,
      title: t('about.pillar3Title'),
      desc: t('about.pillar3Desc'),
      points: [t('about.pillar3Point1'), t('about.pillar3Point2')],
      actionLabel: t('about.pillar3Action'),
    },
  ];

  const workflowSteps = [
    { num: '1', title: t('about.step1Title'), desc: t('about.step1Desc') },
    { num: '2', title: t('about.step2Title'), desc: t('about.step2Desc') },
    { num: '3', title: t('about.step3Title'), desc: t('about.step3Desc') },
    { num: '4', title: t('about.step4Title'), desc: t('about.step4Desc') },
  ];

  return (
    <View
      testID="about-content-root"
      style={[
        styles.container,
        isWide && styles.readableMeasure,
        { gap: spacing.lg },
      ]}
    >
      {/* Hero Summary */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: colors.primary,
            borderRadius: radii.xl,
            padding: spacing.xl,
            gap: spacing.md,
          },
        ]}
      >
        <Text
          accessibilityRole="header"
          style={[typography.headlineMedium, { color: colors.onPrimary }]}
        >
          {t('about.title')}
        </Text>
        <Text
          style={[
            typography.bodyLarge,
            { color: colors.onPrimary, opacity: 0.92 },
          ]}
        >
          {t('about.subtitle')}
        </Text>

        <View style={[styles.heroActions, { gap: spacing.sm, paddingTop: spacing.xs }]}>
          {onSelectTab && (
            <ClinicalButton
              testID="about-launch-calculator-btn"
              variant="tonal"
              icon={HeartPulse}
              label={t('about.ctaLaunch')}
              onPress={() => onSelectTab('/')}
            />
          )}
          {onOpenMethodology && (
            <ClinicalButton
              testID="about-open-methodology-btn"
              variant="outlined"
              icon={BookOpen}
              label={t('about.ctaMethodology')}
              onPress={onOpenMethodology}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.surface,
              }}
            />
          )}
          {onOpenGuide && (
            <ClinicalButton
              testID="about-open-guide-btn"
              variant="outlined"
              icon={HelpCircle}
              label={t('about.ctaGuide')}
              onPress={onOpenGuide}
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.surface,
              }}
            />
          )}
        </View>
      </View>

      {/* 4 Key Study Metrics */}
      <View style={[styles.metricsGrid, { gap: spacing.md }]}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <View
              key={m.id}
              testID={`about-metric-${m.id}`}
              style={[
                styles.metricTile,
                isWide ? styles.metricHalfWide : styles.metricHalfPhone,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outlineVariant,
                  borderRadius: radii.lg,
                  padding: spacing.md,
                  gap: spacing.xs,
                },
              ]}
            >
              <View style={styles.metricTopRow}>
                <Icon size={18} color={colors.primary} strokeWidth={2} />
                <View
                  style={[
                    styles.miniBadge,
                    {
                      backgroundColor: colors.primaryContainer,
                      borderRadius: radii.sm,
                      paddingHorizontal: spacing.sm,
                      paddingVertical: 2,
                    },
                  ]}
                >
                  <Text
                    style={[
                      typography.labelSmall,
                      { color: colors.onPrimaryContainer },
                    ]}
                  >
                    {m.badge}
                  </Text>
                </View>
              </View>
              <Text
                style={[typography.numericTitle, { color: m.valueColor }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {m.value}
              </Text>
              <Text style={[typography.titleSmall, { color: colors.onSurface }]}>
                {m.label}
              </Text>
              <Text
                style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
              >
                {m.sub}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Clinical Context & 3 Dilemmas */}
      <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
        <Text
          accessibilityRole="header"
          style={[typography.headlineSmall, { color: colors.onSurface }]}
        >
          {t('about.problemsTitle')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('about.problemsIntro')}
        </Text>
      </View>

      <View
        style={[
          styles.groupedSurface,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
          },
        ]}
      >
        {dilemmas.map((item, idx) => {
          const Icon = item.icon;
          return (
            <View
              key={item.id}
              style={[
                styles.dilemmaRow,
                {
                  padding: spacing.lg,
                  gap: spacing.md,
                  borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                  borderTopColor: colors.outlineVariant,
                },
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor: colors.primaryContainer,
                    borderRadius: radii.md,
                  },
                ]}
              >
                <Icon
                  size={20}
                  color={colors.onPrimaryContainer}
                  strokeWidth={2}
                />
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Text
                  style={[typography.titleMedium, { color: colors.onSurface }]}
                >
                  {item.title}
                </Text>
                <Text
                  style={[
                    typography.bodyMedium,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {item.desc}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* 3 Core Modules */}
      <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.headlineSmall, { color: colors.onSurface }]}
        >
          {t('about.pillarsTitle')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('about.pillarsSubtitle')}
        </Text>
      </View>

      <View style={{ gap: spacing.md }}>
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <ClinicalCard key={pillar.id} tone="elevated">
              <View style={[styles.pillarHeader, { gap: spacing.md }]}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: colors.primaryContainer,
                      borderRadius: radii.md,
                    },
                  ]}
                >
                  <Icon
                    size={22}
                    color={colors.onPrimaryContainer}
                    strokeWidth={2}
                  />
                </View>
                <Text
                  style={[
                    typography.titleLarge,
                    { color: colors.onSurface, flex: 1 },
                  ]}
                >
                  {pillar.title}
                </Text>
              </View>

              <Text
                style={[
                  typography.bodyMedium,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {pillar.desc}
              </Text>

              <View style={{ gap: spacing.xs }}>
                {pillar.points.map((pt, i) => (
                  <View key={i} style={[styles.pointRow, { gap: spacing.sm }]}>
                    <CheckCircle2
                      size={16}
                      color={colors.clinical.safe.main}
                      strokeWidth={2.2}
                    />
                    <Text
                      style={[
                        typography.bodySmall,
                        { color: colors.onSurface, flex: 1 },
                      ]}
                    >
                      {pt}
                    </Text>
                  </View>
                ))}
              </View>

              {onSelectTab && (
                <ClinicalButton
                  testID={`about-pillar-btn-${pillar.id}`}
                  variant="tonal"
                  label={pillar.actionLabel}
                  onPress={() => onSelectTab(pillar.route)}
                />
              )}
            </ClinicalCard>
          );
        })}
      </View>

      {/* 4 Operational Bedside Workflow Steps */}
      <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.headlineSmall, { color: colors.onSurface }]}
        >
          {t('about.workflowTitle')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('about.workflowSubtitle')}
        </Text>
      </View>

      <View
        style={[
          styles.groupedSurface,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
          },
        ]}
      >
        {workflowSteps.map((step, idx) => (
          <View
            key={step.num}
            style={[
              styles.dilemmaRow,
              {
                padding: spacing.lg,
                gap: spacing.md,
                borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                borderTopColor: colors.outlineVariant,
              },
            ]}
          >
            <View
              style={[
                styles.stepCircle,
                {
                  backgroundColor:
                    step.num === '4'
                      ? colors.clinical.safe.main
                      : colors.primary,
                  borderRadius: radii.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.numericLabel,
                  { color: colors.onPrimary },
                ]}
              >
                {step.num}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={[typography.titleMedium, { color: colors.onSurface }]}
              >
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

      {/* Research Team & Promoters */}
      <View style={{ marginTop: spacing.md, gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.headlineSmall, { color: colors.onSurface }]}
        >
          {t('about.teamTitle')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('about.teamSubtitle')}
        </Text>
      </View>

      {emailError && (
        <InlineAlert testID="about-email-error" tone="danger" message={emailError} />
      )}

      <View style={{ gap: spacing.md }}>
        {TEAM_MEMBERS.map((member) => (
          <View
            key={member.id}
            testID={`team-card-${member.id}`}
            style={[
              styles.teamRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.outlineVariant,
                borderRadius: radii.lg,
                padding: spacing.lg,
                gap: spacing.md,
              },
            ]}
          >
            <TeamAvatar member={member} size={76} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
                {member.name}
              </Text>
              <Text style={[typography.labelMedium, { color: colors.primary }]}>
                {t(member.roleKey)}
              </Text>
              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {t(member.institutionKey)}
              </Text>
              {member.email && (
                <View style={{ alignSelf: 'flex-start', marginTop: spacing.xs }}>
                  <ClinicalButton
                    testID={`team-email-btn-${member.id}`}
                    variant="outlined"
                    icon={Mail}
                    label={t('about.contactEmailBtn')}
                    accessibilityLabel={`${t('about.contactEmailBtn')} ${member.name}`}
                    onPress={() => {
                      void handleOpenEmail(member.email!, member.emailSubject);
                    }}
                  />
                </View>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Support & Collaboration Block */}
      <ClinicalCard tone="neutral">
        <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
          {t('about.supportTitle')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('about.supportDesc')}
        </Text>
        <ClinicalButton
          testID="about-support-email-btn"
          variant="filled"
          icon={Mail}
          label={t('about.supportBtn')}
          onPress={() => {
            void handleOpenEmail(
              'yavieazkaputra@gmail.com',
              'Kolaborasi/Dukungan: CirrhoSmart AI'
            );
          }}
        />
      </ClinicalCard>
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
  heroCard: {},
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricTile: {
    borderWidth: 1,
    flexGrow: 1,
  },
  metricHalfPhone: {
    minWidth: '46%',
  },
  metricHalfWide: {
    minWidth: '22%',
  },
  metricTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  miniBadge: {},
  groupedSurface: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  dilemmaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
