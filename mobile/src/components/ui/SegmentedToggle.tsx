import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: string;
}

export interface SegmentedToggleProps<T extends string | number> {
  label?: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  testID?: string;
}

export function SegmentedToggle<T extends string | number>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  testID,
}: SegmentedToggleProps<T>) {
  const { theme } = useAppTheme();
  const { colors, typography, radii, spacing } = theme;

  return (
    <View style={[styles.wrapper, { gap: spacing.xs }]}>
      {label ? (
        <Text
          style={[typography.labelMedium, { color: colors.onSurfaceVariant }]}
        >
          {label}
        </Text>
      ) : null}

      <View
        testID={testID}
        accessibilityRole="radiogroup"
        style={[
          styles.track,
          {
            borderColor: colors.outline,
            borderRadius: radii.md,
            backgroundColor: colors.surface,
          },
        ]}
      >
        {options.map((opt, index) => {
          const isSelected = opt.value === value;
          const isLast = index === options.length - 1;
          return (
            <Pressable
              key={String(opt.value)}
              testID={
                testID
                  ? `${testID}-option-${String(opt.value)}`
                  : `segment-${String(opt.value)}`
              }
              onPress={() => !disabled && onChange(opt.value)}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected, disabled }}
              accessibilityLabel={opt.label}
              style={({ pressed }) => [
                styles.segment,
                {
                  backgroundColor: isSelected
                    ? colors.primaryContainer
                    : pressed
                      ? colors.surfaceContainer
                      : colors.surface,
                  borderRightColor: colors.outline,
                  borderRightWidth: isLast ? 0 : 1,
                  paddingHorizontal: spacing.sm,
                  gap: spacing.xs,
                },
              ]}
            >
              {isSelected && (
                <Check
                  size={16}
                  color={colors.onPrimaryContainer}
                  strokeWidth={2.2}
                />
              )}
              <Text
                style={[
                  typography.labelMedium,
                  {
                    color: disabled
                      ? colors.outline
                      : isSelected
                        ? colors.onPrimaryContainer
                        : colors.onSurface,
                    textAlign: 'center',
                  },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  track: {
    flexDirection: 'row',
    borderWidth: 1,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
