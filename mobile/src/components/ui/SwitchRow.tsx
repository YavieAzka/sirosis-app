import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface SwitchRowProps {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
  testID?: string;
}

export function SwitchRow({
  label,
  subtitle,
  value,
  onValueChange,
  disabled = false,
  testID,
}: SwitchRowProps) {
  const { theme } = useAppTheme();
  const { colors, typography, spacing } = theme;

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      style={[styles.row, { gap: spacing.md }]}
    >
      <View style={styles.textCol}>
        <Text
          style={[
            typography.titleSmall,
            { color: disabled ? colors.outline : colors.onSurface },
          ]}
        >
          {label}
        </Text>
        {subtitle ? (
          <Text
            style={[
              typography.bodySmall,
              { color: colors.onSurfaceVariant, marginTop: 2 },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Switch
        testID={testID ? `${testID}-switch` : undefined}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: colors.surfaceContainerHigh,
          true: colors.primaryContainer,
        }}
        thumbColor={value ? colors.primary : colors.outline}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  textCol: {
    flex: 1,
  },
});
