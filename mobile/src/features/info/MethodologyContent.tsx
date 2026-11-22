import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Database,
  ExternalLink,
  Hospital,
  Layers,
  Microscope,
  Pill,
  Search,
  Stethoscope,
  TrendingUp,
  X,
} from 'lucide-react-native';

import { ClinicalCard, InlineAlert } from '@/components/ui';
import {
  filterScientificReferences,
  SCIENTIFIC_REFERENCES,
  type ReferenceCategoryFilter,
} from '@/constants/methodologyData';
import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import { openExternalUrl } from '@/utils/externalLinks';
import {
  CohortSection,
  DosingValidationSection,
  MetricsSection,
} from './MethodologyTablesSection';

export type MethodologyTabId =
  | 'overview'
  | 'cohort'
  | 'hybrid_ai'
  | 'metrics'
  | 'shap'
  | 'dosing'
  | 'references';

export interface MethodologyContentProps {
  initialTab?: MethodologyTabId;
}

export function MethodologyContent({
  initialTab = 'overview',
}: MethodologyContentProps) {
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const { isWide } = useWindowSizeClass();
  const { colors, typography, spacing, radii } = theme;

  const [activeTab, setActiveTab] = useState<MethodologyTabId>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<ReferenceCategoryFilter>('all');
  const [linkError, setLinkError] = useState<string | null>(null);

  const filteredReferences = useMemo(
    () =>
      filterScientificReferences(
        SCIENTIFIC_REFERENCES,
        searchQuery,
        selectedCategory
      ),
    [searchQuery, selectedCategory]
  );

  const tabs: {
    id: MethodologyTabId;
    label: string;
    icon: typeof Activity;
  }[] = [
    { id: 'overview', label: t('methodology.tabs.overview'), icon: Activity },
    { id: 'cohort', label: t('methodology.tabs.cohort'), icon: Hospital },
    { id: 'hybrid_ai', label: t('methodology.tabs.hybridAi'), icon: Layers },
    { id: 'metrics', label: t('methodology.tabs.metrics'), icon: TrendingUp },
    { id: 'shap', label: t('methodology.tabs.shap'), icon: Microscope },
    { id: 'dosing', label: t('methodology.tabs.dosing'), icon: Pill },
    { id: 'references', label: t('methodology.tabs.references'), icon: BookOpen },
  ];

  const categoryFilters: { id: ReferenceCategoryFilter; label: string }[] = [
    { id: 'all', label: t('methodology.filters.all') },
    { id: 'guideline', label: t('methodology.filters.guideline') },
    { id: 'pk_dosing', label: t('methodology.filters.pk_dosing') },
    { id: 'ml_ai', label: t('methodology.filters.ml_ai') },
    { id: 'prognosis', label: t('methodology.filters.prognosis') },
  ];

  const handleOpenDoi = async (url: string) => {
    setLinkError(null);
    const opened = await openExternalUrl(url);
    if (!opened) {
      setLinkError(t('methodology.references.doiOpenError'));
    }
  };

  const renderOverview = () => (
    <View testID="methodology-panel-overview" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.overview.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.overview.subtitle')}
        </Text>
      </View>

      <ClinicalCard tone="danger">
        <Text
          style={[
            typography.titleMedium,
            { color: colors.clinical.danger.onContainer },
          ]}
        >
          {t('methodology.overview.urgencyTitle')}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.clinical.danger.onContainer },
          ]}
        >
          {t('methodology.overview.urgencyBody')}
        </Text>
      </ClinicalCard>

      <ClinicalCard tone="safe">
        <Text
          style={[
            typography.titleMedium,
            { color: colors.clinical.safe.onContainer },
          ]}
        >
          {t('methodology.overview.solutionTitle')}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.clinical.safe.onContainer },
          ]}
        >
          {t('methodology.overview.solutionBody')}
        </Text>
      </ClinicalCard>

      <View style={{ marginTop: spacing.xs, gap: spacing.xs }}>
        <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
          {t('methodology.overview.pipelineTitle')}
        </Text>
        <Text
          style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.overview.pipelineSubtitle')}
        </Text>
      </View>

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
        {[
          {
            num: '1',
            title: t('methodology.overview.step1Title'),
            desc: t('methodology.overview.step1Desc'),
          },
          {
            num: '2',
            title: t('methodology.overview.step2Title'),
            desc: t('methodology.overview.step2Desc'),
          },
          {
            num: '3',
            title: t('methodology.overview.step3Title'),
            desc: t('methodology.overview.step3Desc'),
          },
          {
            num: '4',
            title: t('methodology.overview.step4Title'),
            desc: t('methodology.overview.step4Desc'),
          },
        ].map((step, idx) => (
          <View
            key={step.num}
            style={[
              styles.rowItem,
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
                styles.numBadge,
                {
                  backgroundColor: colors.primaryContainer,
                  borderRadius: radii.full,
                },
              ]}
            >
              <Text
                style={[
                  typography.numericLabel,
                  { color: colors.onPrimaryContainer },
                ]}
              >
                {step.num}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={[typography.titleSmall, { color: colors.onSurface }]}
              >
                {step.title}
              </Text>
              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {step.desc}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <InlineAlert
        tone="info"
        title={t('methodology.overview.ethicsTitle')}
        message={t('methodology.overview.ethicsBody')}
      />
    </View>
  );

  const renderHybridAi = () => (
    <View testID="methodology-panel-hybrid_ai" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.hybridAi.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.hybridAi.subtitle')}
        </Text>
      </View>

      <ClinicalCard tone="elevated">
        <View style={[styles.pillarTitleRow, { gap: spacing.sm }]}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: colors.primaryContainer, borderRadius: radii.md },
            ]}
          >
            <TrendingUp
              size={20}
              color={colors.onPrimaryContainer}
              strokeWidth={2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[typography.labelSmall, { color: colors.primary }]}>
              {t('methodology.hybridAi.mlLabel')}
            </Text>
            <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
              {t('methodology.hybridAi.mlTitle')}
            </Text>
          </View>
        </View>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.hybridAi.mlBody')}
        </Text>
        {[
          t('methodology.hybridAi.mlPoint1'),
          t('methodology.hybridAi.mlPoint2'),
          t('methodology.hybridAi.mlPoint3'),
        ].map((point, idx) => (
          <View key={idx} style={[styles.checkRow, { gap: spacing.sm }]}>
            <CheckCircle2 size={16} color={colors.primary} strokeWidth={2.2} />
            <Text style={[typography.bodySmall, { color: colors.onSurface, flex: 1 }]}>
              {point}
            </Text>
          </View>
        ))}
      </ClinicalCard>

      <ClinicalCard tone="safe">
        <View style={[styles.pillarTitleRow, { gap: spacing.sm }]}>
          <View
            style={[
              styles.iconBox,
              {
                backgroundColor: colors.clinical.safe.main,
                borderRadius: radii.md,
              },
            ]}
          >
            <Stethoscope
              size={20}
              color={colors.clinical.safe.onMain}
              strokeWidth={2}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                typography.labelSmall,
                { color: colors.clinical.safe.onContainer },
              ]}
            >
              {t('methodology.hybridAi.ruleLabel')}
            </Text>
            <Text
              style={[
                typography.titleMedium,
                { color: colors.clinical.safe.onContainer },
              ]}
            >
              {t('methodology.hybridAi.ruleTitle')}
            </Text>
          </View>
        </View>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.clinical.safe.onContainer },
          ]}
        >
          {t('methodology.hybridAi.ruleBody')}
        </Text>
        {[
          t('methodology.hybridAi.rulePoint1'),
          t('methodology.hybridAi.rulePoint2'),
          t('methodology.hybridAi.rulePoint3'),
        ].map((point, idx) => (
          <View key={idx} style={[styles.checkRow, { gap: spacing.sm }]}>
            <CheckCircle2
              size={16}
              color={colors.clinical.safe.onContainer}
              strokeWidth={2.2}
            />
            <Text
              style={[
                typography.bodySmall,
                { color: colors.clinical.safe.onContainer, flex: 1 },
              ]}
            >
              {point}
            </Text>
          </View>
        ))}
      </ClinicalCard>

      <ClinicalCard tone="neutral">
        <View style={[styles.pillarTitleRow, { gap: spacing.sm }]}>
          <Database size={18} color={colors.primary} strokeWidth={2} />
          <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
            {t('methodology.hybridAi.prepTitle')}
          </Text>
        </View>
        {[
          {
            title: t('methodology.hybridAi.prep1Title'),
            body: t('methodology.hybridAi.prep1Body'),
          },
          {
            title: t('methodology.hybridAi.prep2Title'),
            body: t('methodology.hybridAi.prep2Body'),
          },
          {
            title: t('methodology.hybridAi.prep3Title'),
            body: t('methodology.hybridAi.prep3Body'),
          },
        ].map((item) => (
          <View
            key={item.title}
            style={[
              styles.prepItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.outlineVariant,
                borderRadius: radii.md,
                padding: spacing.md,
                gap: 4,
              },
            ]}
          >
            <Text style={[typography.titleSmall, { color: colors.onSurface }]}>
              {item.title}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.onSurfaceVariant },
              ]}
            >
              {item.body}
            </Text>
          </View>
        ))}
      </ClinicalCard>
    </View>
  );

  const renderShap = () => (
    <View testID="methodology-panel-shap" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.shap.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.shap.subtitle')}
        </Text>
      </View>

      <ClinicalCard tone="elevated">
        <Text style={[typography.titleMedium, { color: colors.primary }]}>
          {t('methodology.shap.mortalityTitle')}
        </Text>
        <Text
          style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.shap.mortalitySub')}
        </Text>
        {[
          {
            title: t('methodology.shap.mortality1Title'),
            desc: t('methodology.shap.mortality1Desc'),
            highlight: true,
          },
          {
            title: t('methodology.shap.mortality2Title'),
            desc: t('methodology.shap.mortality2Desc'),
          },
          {
            title: t('methodology.shap.mortality3Title'),
            desc: t('methodology.shap.mortality3Desc'),
          },
          {
            title: t('methodology.shap.mortality4Title'),
            desc: t('methodology.shap.mortality4Desc'),
          },
        ].map((item) => (
          <View
            key={item.title}
            style={[
              styles.prepItem,
              {
                backgroundColor: item.highlight
                  ? colors.clinical.danger.container
                  : colors.surfaceContainerLow,
                borderColor: item.highlight
                  ? colors.clinical.danger.border
                  : colors.outlineVariant,
                borderRadius: radii.md,
                padding: spacing.md,
                gap: 4,
              },
            ]}
          >
            <Text
              style={[
                typography.titleSmall,
                {
                  color: item.highlight
                    ? colors.clinical.danger.onContainer
                    : colors.onSurface,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                {
                  color: item.highlight
                    ? colors.clinical.danger.onContainer
                    : colors.onSurfaceVariant,
                },
              ]}
            >
              {item.desc}
            </Text>
          </View>
        ))}
      </ClinicalCard>

      <ClinicalCard tone="elevated">
        <Text
          style={[
            typography.titleMedium,
            { color: colors.clinical.info.main },
          ]}
        >
          {t('methodology.shap.losTitle')}
        </Text>
        <Text
          style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.shap.losSub')}
        </Text>
        {[
          {
            title: t('methodology.shap.los1Title'),
            desc: t('methodology.shap.los1Desc'),
            highlight: true,
          },
          {
            title: t('methodology.shap.los2Title'),
            desc: t('methodology.shap.los2Desc'),
          },
          {
            title: t('methodology.shap.los3Title'),
            desc: t('methodology.shap.los3Desc'),
          },
          {
            title: t('methodology.shap.los4Title'),
            desc: t('methodology.shap.los4Desc'),
          },
        ].map((item) => (
          <View
            key={item.title}
            style={[
              styles.prepItem,
              {
                backgroundColor: item.highlight
                  ? colors.clinical.info.container
                  : colors.surfaceContainerLow,
                borderColor: item.highlight
                  ? colors.clinical.info.border
                  : colors.outlineVariant,
                borderRadius: radii.md,
                padding: spacing.md,
                gap: 4,
              },
            ]}
          >
            <Text
              style={[
                typography.titleSmall,
                {
                  color: item.highlight
                    ? colors.clinical.info.onContainer
                    : colors.onSurface,
                },
              ]}
            >
              {item.title}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                {
                  color: item.highlight
                    ? colors.clinical.info.onContainer
                    : colors.onSurfaceVariant,
                },
              ]}
            >
              {item.desc}
            </Text>
          </View>
        ))}
      </ClinicalCard>

      {/* Case Study Section 3.4 */}
      <View
        style={[
          styles.caseStudyBox,
          {
            backgroundColor: colors.primary,
            borderRadius: radii.xl,
            padding: spacing.xl,
            gap: spacing.md,
          },
        ]}
      >
        <Text style={[typography.titleMedium, { color: colors.onPrimary }]}>
          {t('methodology.shap.caseHeading')}
        </Text>
        <Text
          style={[
            typography.titleSmall,
            { color: colors.onPrimary, opacity: 0.96 },
          ]}
        >
          {t('methodology.shap.casePatientTitle')}
        </Text>
        <Text
          style={[
            typography.bodySmall,
            { color: colors.onPrimary, opacity: 0.9 },
          ]}
        >
          {t('methodology.shap.caseBody')}
        </Text>

        <View style={[styles.driverGrid, { gap: spacing.sm }]}>
          {[
            {
              label: t('methodology.shap.caseDriver1Label'),
              value: t('methodology.shap.caseDriver1Val'),
            },
            {
              label: t('methodology.shap.caseDriver2Label'),
              value: t('methodology.shap.caseDriver2Val'),
            },
            {
              label: t('methodology.shap.caseDriver3Label'),
              value: t('methodology.shap.caseDriver3Val'),
            },
            {
              label: t('methodology.shap.caseDriver4Label'),
              value: t('methodology.shap.caseDriver4Val'),
            },
          ].map((driver) => (
            <View
              key={driver.label}
              style={[
                styles.driverChip,
                {
                  backgroundColor: colors.surface,
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
                {driver.label}
              </Text>
              <Text
                style={[typography.numericBody, { color: colors.onSurface, fontWeight: '700' }]}
              >
                {driver.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderReferences = () => (
    <View testID="methodology-panel-references" style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text
          accessibilityRole="header"
          style={[typography.titleLarge, { color: colors.onSurface }]}
        >
          {t('methodology.references.title')}
        </Text>
        <Text
          style={[typography.bodyMedium, { color: colors.onSurfaceVariant }]}
        >
          {t('methodology.references.subtitle')}
        </Text>
      </View>

      {/* Primary Standards */}
      <View style={{ gap: spacing.sm }}>
        <Text style={[typography.titleMedium, { color: colors.onSurface }]}>
          {t('methodology.references.guidelinesHeading')}
        </Text>
        {[
          {
            badge: t('methodology.references.guideline1Badge'),
            title: t('methodology.references.guideline1Title'),
            body: t('methodology.references.guideline1Body'),
            tone: 'danger' as const,
          },
          {
            badge: t('methodology.references.guideline2Badge'),
            title: t('methodology.references.guideline2Title'),
            body: t('methodology.references.guideline2Body'),
            tone: 'info' as const,
          },
          {
            badge: t('methodology.references.guideline3Badge'),
            title: t('methodology.references.guideline3Title'),
            body: t('methodology.references.guideline3Body'),
            tone: 'neutral' as const,
          },
        ].map((item) => (
          <ClinicalCard key={item.badge} tone={item.tone}>
            <Text
              style={[
                typography.labelMedium,
                {
                  color:
                    item.tone === 'danger'
                      ? colors.clinical.danger.onContainer
                      : item.tone === 'info'
                        ? colors.clinical.info.onContainer
                        : colors.primary,
                },
              ]}
            >
              {item.badge}
            </Text>
            <Text style={[typography.titleSmall, { color: colors.onSurface }]}>
              {item.title}
            </Text>
            <Text
              style={[
                typography.bodySmall,
                { color: colors.onSurfaceVariant },
              ]}
            >
              {item.body}
            </Text>
          </ClinicalCard>
        ))}
      </View>

      {/* Search & Category Filter */}
      <View
        style={[
          styles.searchFilterPanel,
          {
            backgroundColor: colors.surfaceContainerLow,
            borderColor: colors.outlineVariant,
            borderRadius: radii.lg,
            padding: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        <View
          style={[
            styles.searchInputRow,
            {
              backgroundColor: colors.surface,
              borderColor: colors.outline,
              borderRadius: radii.md,
            },
          ]}
        >
          <View style={styles.searchIconSlot}>
            <Search size={18} color={colors.onSurfaceVariant} strokeWidth={2} />
          </View>
          <TextInput
            testID="references-search-input"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('methodology.searchPlaceholder')}
            placeholderTextColor={colors.outline}
            accessibilityLabel={t('methodology.searchPlaceholder')}
            style={[
              typography.bodyMedium,
              styles.searchInput,
              { color: colors.onSurface },
            ]}
          />
          {searchQuery.length > 0 && (
            <Pressable
              testID="references-search-clear"
              onPress={() => setSearchQuery('')}
              accessibilityRole="button"
              accessibilityLabel={t('methodology.references.clearSearchA11y')}
              style={styles.clearBtn}
            >
              <X size={18} color={colors.onSurfaceVariant} strokeWidth={2} />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: TOUCH_TARGET.MIN_GAP_DP }}
        >
          {categoryFilters.map((filterItem) => {
            const active = selectedCategory === filterItem.id;
            return (
              <Pressable
                key={filterItem.id}
                testID={`references-filter-${filterItem.id}`}
                onPress={() => setSelectedCategory(filterItem.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: active
                      ? colors.primary
                      : colors.surface,
                    borderColor: active ? colors.primary : colors.outlineVariant,
                    borderRadius: radii.full,
                    paddingHorizontal: spacing.md,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelMedium,
                    { color: active ? colors.onPrimary : colors.onSurface },
                  ]}
                >
                  {filterItem.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {linkError && (
        <InlineAlert
          testID="references-link-error"
          tone="danger"
          message={linkError}
        />
      )}

      {/* Results Count */}
      <Text
        testID="references-count-text"
        style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}
      >
        {`${t('methodology.references.showingPrefix')} ${filteredReferences.length} ${t('methodology.references.showingSuffix')}`}
      </Text>

      {/* Reference List */}
      {filteredReferences.length === 0 ? (
        <ClinicalCard testID="references-empty-state" tone="neutral">
          <Text
            style={[
              typography.bodyMedium,
              { color: colors.onSurfaceVariant, textAlign: 'center' },
            ]}
          >
            {t('methodology.noReferences')}
          </Text>
        </ClinicalCard>
      ) : (
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
          {filteredReferences.map((ref, idx) => (
            <View
              key={ref.id}
              testID={`reference-item-${ref.id}`}
              style={[
                styles.refRow,
                {
                  backgroundColor: ref.highlight
                    ? colors.primaryContainer
                    : colors.surface,
                  borderTopWidth: idx > 0 ? StyleSheet.hairlineWidth : 0,
                  borderTopColor: colors.outlineVariant,
                  padding: spacing.lg,
                  gap: spacing.xs,
                },
              ]}
            >
              <View style={[styles.refMetaRow, { gap: spacing.xs }]}>
                <Text
                  style={[
                    typography.numericLabel,
                    {
                      color: ref.highlight
                        ? colors.onPrimaryContainer
                        : colors.primary,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {`[${ref.id}]`}
                </Text>
                <Text
                  style={[
                    typography.labelMedium,
                    {
                      color: ref.highlight
                        ? colors.onPrimaryContainer
                        : colors.onSurface,
                      flex: 1,
                    },
                  ]}
                >
                  {`${ref.authors} (${ref.year})`}
                </Text>
              </View>

              <Text
                style={[
                  typography.titleSmall,
                  {
                    color: ref.highlight
                      ? colors.onPrimaryContainer
                      : colors.onSurface,
                  },
                ]}
              >
                {ref.title}
              </Text>

              <Text
                style={[
                  typography.bodySmall,
                  {
                    color: ref.highlight
                      ? colors.onPrimaryContainer
                      : colors.onSurfaceVariant,
                  },
                ]}
              >
                {ref.journal}
                {ref.volumeIssuePages ? `; ${ref.volumeIssuePages}` : ''}
              </Text>

              {ref.url && (
                <View style={styles.doiActionRow}>
                  <Pressable
                    testID={`reference-doi-${ref.id}`}
                    onPress={() => {
                      void handleOpenDoi(ref.url!);
                    }}
                    accessibilityRole="link"
                    accessibilityLabel={`${t('methodology.references.openDoiA11y')} ${ref.id}: ${ref.doi ?? ref.url}`}
                    style={({ pressed }) => [
                      styles.doiButton,
                      {
                        backgroundColor: pressed
                          ? colors.surfaceContainerHigh
                          : colors.surface,
                        borderColor: colors.primary,
                        borderRadius: radii.md,
                        paddingHorizontal: spacing.md,
                        gap: spacing.xs,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        typography.labelMedium,
                        { color: colors.primary },
                      ]}
                    >
                      {t('methodology.references.openDoi')}
                    </Text>
                    <ExternalLink
                      size={14}
                      color={colors.primary}
                      strokeWidth={2}
                    />
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View
      testID="methodology-content-root"
      style={[
        styles.container,
        isWide && styles.readableMeasure,
        { gap: spacing.lg },
      ]}
    >
      {/* Hero Summary Card */}
      <View
        style={[
          styles.heroBox,
          {
            backgroundColor: colors.primary,
            borderRadius: radii.xl,
            padding: spacing.xl,
            gap: spacing.sm,
          },
        ]}
      >
        <Text
          accessibilityRole="header"
          style={[typography.headlineSmall, { color: colors.onPrimary }]}
        >
          {t('methodology.title')}
        </Text>
        <Text
          style={[
            typography.bodyMedium,
            { color: colors.onPrimary, opacity: 0.92 },
          ]}
        >
          {t('methodology.subtitle')}
        </Text>

        <View style={[styles.badgeGrid, { gap: spacing.sm, marginTop: spacing.xs }]}>
          {[
            {
              label: t('methodology.badges.cohortLabel'),
              value: t('methodology.badges.cohortValue'),
              sub: t('methodology.badges.cohortSub'),
            },
            {
              label: t('methodology.badges.ethicsLabel'),
              value: t('methodology.badges.ethicsValue'),
              sub: t('methodology.badges.ethicsSub'),
            },
            {
              label: t('methodology.badges.aurocLabel'),
              value: t('methodology.badges.aurocValue'),
              sub: t('methodology.badges.aurocSub'),
            },
            {
              label: t('methodology.badges.concordanceLabel'),
              value: t('methodology.badges.concordanceValue'),
              sub: t('methodology.badges.concordanceSub'),
            },
          ].map((b) => (
            <View
              key={b.label}
              style={[
                styles.heroMetricTile,
                {
                  backgroundColor: colors.surface,
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
                {b.label}
              </Text>
              <Text
                style={[
                  typography.numericBody,
                  { color: colors.primary, fontWeight: '700' },
                ]}
              >
                {b.value}
              </Text>
              <Text
                style={[
                  typography.bodySmall,
                  { color: colors.onSurfaceVariant },
                ]}
              >
                {b.sub}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Scrollable Material Filter Chips / Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        contentContainerStyle={{ gap: TOUCH_TARGET.MIN_GAP_DP }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              testID={`methodology-tab-${tab.id}`}
              onPress={() => setActiveTab(tab.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={[
                styles.tabChip,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive
                    ? colors.primary
                    : colors.outlineVariant,
                  borderRadius: radii.full,
                  paddingHorizontal: spacing.md,
                  gap: spacing.xs,
                },
              ]}
            >
              <Icon
                size={16}
                color={isActive ? colors.onPrimary : colors.onSurfaceVariant}
                strokeWidth={2}
              />
              <Text
                style={[
                  typography.labelLarge,
                  { color: isActive ? colors.onPrimary : colors.onSurface },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Active Section Panel */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'cohort' && <CohortSection />}
      {activeTab === 'hybrid_ai' && renderHybridAi()}
      {activeTab === 'metrics' && <MetricsSection />}
      {activeTab === 'shap' && renderShap()}
      {activeTab === 'dosing' && <DosingValidationSection />}
      {activeTab === 'references' && renderReferences()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  readableMeasure: {
    maxWidth: 780,
    alignSelf: 'center',
  },
  heroBox: {},
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  heroMetricTile: {
    minWidth: '46%',
    flexGrow: 1,
    gap: 2,
  },
  tabChip: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numBadge: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepItem: {
    borderWidth: 1,
  },
  caseStudyBox: {},
  driverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  driverChip: {
    minWidth: '46%',
    flexGrow: 1,
    gap: 2,
  },
  searchFilterPanel: {
    borderWidth: 1,
  },
  searchInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
  },
  searchIconSlot: {
    paddingLeft: 12,
    paddingRight: 8,
  },
  searchInput: {
    flex: 1,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    paddingVertical: 10,
    paddingRight: 8,
  },
  clearBtn: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChip: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refRow: {},
  refMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doiActionRow: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  doiButton: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
