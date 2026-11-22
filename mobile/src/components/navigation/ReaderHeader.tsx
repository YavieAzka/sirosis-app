import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Sun } from 'lucide-react-native';

import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface ReaderHeaderProps {
  title: string;
  onBack: () => void;
  testIDPrefix?: string;
}

export function ReaderHeader({
  title,
  onBack,
  testIDPrefix = 'reader',
}: ReaderHeaderProps) {
  const { theme, colorMode, toggleTheme } = useAppTheme();
  const { language, toggleLanguage, t } = useAppLanguage();
  const insets = useSafeAreaInsets();
  const { colors, typography, spacing, radii } = theme;

  return (
    <View
      testID={`${testIDPrefix}-header`}
      style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.outlineVariant,
          paddingTop: insets.top + spacing.sm,
          paddingBottom: spacing.sm,
          paddingLeft: Math.max(insets.left, spacing.sm),
          paddingRight: Math.max(insets.right, spacing.md),
        },
      ]}
    >
      <View style={[styles.leftGroup, { gap: spacing.xs }]}>
        <Pressable
          testID={`${testIDPrefix}-back-button`}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: pressed
                ? colors.surfaceContainerHigh
                : 'transparent',
              borderRadius: radii.full,
            },
          ]}
        >
          <ArrowLeft size={22} color={colors.onSurface} strokeWidth={2} />
        </Pressable>

        <Text
          numberOfLines={1}
          accessibilityRole="header"
          style={[
            typography.titleLarge,
            styles.title,
            { color: colors.onSurface },
          ]}
        >
          {title}
        </Text>
      </View>

      <View style={[styles.actions, { gap: TOUCH_TARGET.MIN_GAP_DP }]}>
        <Pressable
          testID={`${testIDPrefix}-language-toggle`}
          onPress={() => {
            void toggleLanguage();
          }}
          accessibilityRole="button"
          accessibilityLabel={`${t('common.language')}: ${
            language === 'id' ? t('common.languageId') : t('common.languageEn')
          }`}
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
            {language.toUpperCase()}
          </Text>
        </Pressable>

        <Pressable
          testID={`${testIDPrefix}-theme-toggle`}
          onPress={toggleTheme}
          accessibilityRole="button"
          accessibilityLabel={
            colorMode === 'dark'
              ? t('theme.toggleToLight')
              : t('theme.toggleToDark')
          }
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    minHeight: 64,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageChip: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    paddingHorizontal: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
