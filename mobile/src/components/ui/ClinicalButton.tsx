import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export type ClinicalButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

export interface ClinicalButtonProps {
  label: string;
  onPress: () => void;
  variant?: ClinicalButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ClinicalButton({
  label,
  onPress,
  variant = 'filled',
  icon: Icon,
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
  testID,
}: ClinicalButtonProps) {
  const { theme } = useAppTheme();
  const { colors, typography, radii, spacing } = theme;
  const isDisabled = disabled || loading;

  const getColors = (pressed: boolean) => {
    if (isDisabled) {
      return {
        bg:
          variant === 'text' || variant === 'outlined'
            ? 'transparent'
            : colors.surfaceContainerHigh,
        fg: colors.outline,
        border:
          variant === 'outlined' ? colors.outlineVariant : 'transparent',
      };
    }

    switch (variant) {
      case 'filled':
        return {
          bg: pressed ? colors.onPrimaryContainer : colors.primary,
          fg: colors.onPrimary,
          border: 'transparent',
        };
      case 'tonal':
        return {
          bg: pressed ? colors.secondaryContainer : colors.primaryContainer,
          fg: colors.onPrimaryContainer,
          border: 'transparent',
        };
      case 'outlined':
        return {
          bg: pressed ? colors.surfaceContainer : 'transparent',
          fg: colors.primary,
          border: colors.outline,
        };
      case 'text':
        return {
          bg: pressed ? colors.surfaceContainer : 'transparent',
          fg: colors.primary,
          border: 'transparent',
        };
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => {
        const palette = getColors(pressed);
        return [
          styles.button,
          {
            backgroundColor: palette.bg,
            borderColor: palette.border,
            borderWidth: variant === 'outlined' ? 1 : 0,
            borderRadius: radii.md,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            gap: spacing.sm,
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const palette = getColors(pressed);
        return (
          <>
            {loading ? (
              <ActivityIndicator
                testID={testID ? `${testID}-spinner` : undefined}
                size="small"
                color={palette.fg}
              />
            ) : (
              Icon && <Icon size={18} color={palette.fg} strokeWidth={2} />
            )}
            <Text
              style={[
                typography.labelLarge,
                { color: palette.fg, textAlign: 'center' },
              ]}
            >
              {label}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
