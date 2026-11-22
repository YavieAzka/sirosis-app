import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface CheckboxRowProps {
  label: string;
  subtitle?: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  testID?: string;
}

export function CheckboxRow({
  label,
  subtitle,
  checked,
  onToggle,
  disabled = false,
  testID,
}: CheckboxRowProps) {
  const { theme } = useAppTheme();
  const { colors, typography, radii, spacing } = theme;

  return (
    <Pressable
      testID={testID}
      onPress={() => !disabled && onToggle()}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed && !disabled ? colors.surfaceContainer : 'transparent',
          borderRadius: radii.sm,
          paddingHorizontal: spacing.xs,
          gap: spacing.md,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.box,
          {
            borderRadius: radii.xs,
            borderColor: checked ? colors.primary : colors.outline,
            backgroundColor: checked ? colors.primary : 'transparent',
          },
        ]}
      >
        {checked && (
          <Check size={14} color={colors.onPrimary} strokeWidth={2.5} />
        )}
      </View>

      <View style={styles.textCol}>
        <Text
          style={[
            typography.bodyMedium,
            {
              color: colors.onSurface,
              fontWeight: checked ? '600' : '400',
            },
          ]}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
});
