import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Moon, Sun } from 'lucide-react-native';

import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import type { AppDestination, AppDestinationKey } from './destinations';

export interface AdaptiveNavigationScaffoldProps {
  destinations: AppDestination[];
  activeKey: AppDestinationKey;
  onSelectDestination: (key: AppDestinationKey) => void;
  title?: string;
  languageCode?: string;
  onToggleLanguage?: () => void;
  languageToggleAccessibilityLabel?: string;
  themeToggleLightLabel?: string;
  themeToggleDarkLabel?: string;
  children: React.ReactNode;
}

export function AdaptiveNavigationScaffold({
  destinations,
  activeKey,
  onSelectDestination,
  title,
  languageCode,
  onToggleLanguage,
  languageToggleAccessibilityLabel,
  themeToggleLightLabel = 'Aktifkan mode terang',
  themeToggleDarkLabel = 'Aktifkan mode gelap',
  children,
}: AdaptiveNavigationScaffoldProps) {
  const { theme, colorMode, toggleTheme } = useAppTheme();
  const { isWide } = useWindowSizeClass();
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, radii } = theme;

  const activeDest =
    destinations.find((dest) => dest.key === activeKey) ?? destinations[0];
  const resolvedTitle = title ?? activeDest?.headerTitle ?? 'CirrhoSmart AI';

  const themeToggleLabel =
    colorMode === 'dark' ? themeToggleLightLabel : themeToggleDarkLabel;

  const renderLanguageToggle = () => {
    if (!languageCode || !onToggleLanguage) {
      return null;
    }
    return (
      <Pressable
        testID="language-toggle-button"
        onPress={onToggleLanguage}
        accessibilityRole="button"
        accessibilityLabel={
          languageToggleAccessibilityLabel ?? `Bahasa ${languageCode.toUpperCase()}`
        }
        style={({ pressed }) => [
          styles.languageChip,
          {
            backgroundColor: pressed
              ? colors.surfaceContainerHigh
              : colors.surfaceContainer,
            borderColor: colors.outlineVariant,
            borderRadius: radii.full,
          },
        ]}
      >
        <Text style={[typography.labelLarge, { color: colors.primary }]}>
          {languageCode.toUpperCase()}
        </Text>
      </Pressable>
    );
  };

  const renderThemeToggle = () => (
    <Pressable
      testID="theme-toggle-button"
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={themeToggleLabel}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: pressed
            ? colors.surfaceContainerHigh
            : colors.surfaceContainer,
          borderRadius: radii.full,
        },
      ]}
    >
      {colorMode === 'dark' ? (
        <Sun size={20} color={colors.onSurface} strokeWidth={2} />
      ) : (
        <Moon size={20} color={colors.onSurface} strokeWidth={2} />
      )}
    </Pressable>
  );

  return (
    <View
      testID="adaptive-scaffold-root"
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      {isWide && (
        <View
          testID="navigation-rail"
          accessibilityRole="tablist"
          style={[
            styles.rail,
            {
              backgroundColor: colors.surfaceContainerLow,
              borderRightColor: colors.outlineVariant,
              paddingTop: Math.max(insets.top, spacing.lg),
              paddingBottom: Math.max(insets.bottom, spacing.lg),
              paddingLeft: Math.max(insets.left, spacing.sm),
              paddingRight: spacing.sm,
            },
          ]}
        >
          <View style={styles.railBrandSlot}>
            <Text
              style={[
                typography.titleMedium,
                { color: colors.primary, textAlign: 'center' },
              ]}
            >
              CS
            </Text>
          </View>

          <View style={[styles.railItems, { gap: spacing.sm }]}>
            {destinations.map((dest) => {
              const Icon = dest.icon;
              const isSelected = dest.key === activeKey;
              return (
                <Pressable
                  key={dest.key}
                  testID={`rail-item-${dest.key}`}
                  onPress={() => onSelectDestination(dest.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={dest.accessibilityLabel}
                  style={styles.railItem}
                >
                  <View
                    style={[
                      styles.railPill,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryContainer
                          : 'transparent',
                        borderRadius: radii.full,
                      },
                    ]}
                  >
                    <Icon
                      size={22}
                      color={
                        isSelected
                          ? colors.onPrimaryContainer
                          : colors.onSurfaceVariant
                      }
                      strokeWidth={isSelected ? 2.2 : 1.8}
                    />
                  </View>
                  <Text
                    style={[
                      typography.labelSmall,
                      {
                        color: isSelected
                          ? colors.onSurface
                          : colors.onSurfaceVariant,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {dest.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.railFooter}>{renderThemeToggle()}</View>
        </View>
      )}

      <View style={styles.mainColumn}>
        <View
          testID="top-app-bar"
          style={[
            styles.topAppBar,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.outlineVariant,
              paddingTop: insets.top + spacing.sm,
              paddingBottom: spacing.sm,
              paddingLeft: isWide ? spacing.xl : Math.max(insets.left, spacing.lg),
              paddingRight: Math.max(insets.right, spacing.lg),
            },
          ]}
        >
          <View style={styles.topAppBarText}>
            <Text
              style={[typography.titleLarge, { color: colors.onSurface }]}
              accessibilityRole="header"
            >
              {resolvedTitle}
            </Text>
          </View>
          <View style={[styles.topAppBarActions, { gap: TOUCH_TARGET.MIN_GAP_DP }]}>
            {renderLanguageToggle()}
            {!isWide && renderThemeToggle()}
          </View>
        </View>

        <View
          style={[
            styles.contentArea,
            {
              backgroundColor: colors.background,
              paddingRight: isWide ? insets.right : 0,
            },
          ]}
        >
          {children}
        </View>

        {!isWide && (
          <View
            testID="bottom-navigation-bar"
            accessibilityRole="tablist"
            style={[
              styles.bottomBar,
              {
                backgroundColor: colors.surfaceContainerLow,
                borderTopColor: colors.outlineVariant,
                paddingBottom: Math.max(insets.bottom, spacing.sm),
                paddingTop: spacing.sm,
                paddingLeft: Math.max(insets.left, spacing.sm),
                paddingRight: Math.max(insets.right, spacing.sm),
                gap: TOUCH_TARGET.MIN_GAP_DP,
              },
            ]}
          >
            {destinations.map((dest) => {
              const Icon = dest.icon;
              const isSelected = dest.key === activeKey;
              return (
                <Pressable
                  key={dest.key}
                  testID={`bottom-tab-${dest.key}`}
                  onPress={() => onSelectDestination(dest.key)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={dest.accessibilityLabel}
                  style={styles.bottomItem}
                >
                  <View
                    style={[
                      styles.bottomPill,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryContainer
                          : 'transparent',
                        borderRadius: radii.full,
                      },
                    ]}
                  >
                    <Icon
                      size={20}
                      color={
                        isSelected
                          ? colors.onPrimaryContainer
                          : colors.onSurfaceVariant
                      }
                      strokeWidth={isSelected ? 2.2 : 1.8}
                    />
                  </View>
                  <Text
                    style={[
                      typography.labelSmall,
                      {
                        color: isSelected
                          ? colors.onSurface
                          : colors.onSurfaceVariant,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {dest.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
  },
  mainColumn: {
    flex: 1,
    minWidth: 0,
  },
  topAppBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  topAppBarText: {
    flex: 1,
    paddingRight: 12,
  },
  topAppBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageChip: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    paddingHorizontal: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentArea: {
    flex: 1,
    minHeight: 0,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomItem: {
    flex: 1,
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  bottomPill: {
    minWidth: 56,
    minHeight: 32,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rail: {
    width: 88,
    borderRightWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  railBrandSlot: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railItems: {
    width: '100%',
    alignItems: 'center',
  },
  railItem: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  railPill: {
    minWidth: 56,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  railFooter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
