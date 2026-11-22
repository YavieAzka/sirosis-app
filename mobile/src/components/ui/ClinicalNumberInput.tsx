import React, { useRef, useState, type ComponentRef } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { AlertCircle } from 'lucide-react-native';

import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface ClinicalNumberInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  unit?: string;
  error?: string | null;
  helperText?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  rightAccessory?: React.ReactNode;
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ClinicalNumberInput({
  label,
  value,
  onChangeText,
  placeholder,
  unit,
  error,
  helperText,
  editable = true,
  keyboardType = 'decimal-pad',
  secureTextEntry = false,
  rightAccessory,
  accessibilityLabel,
  containerStyle,
  testID,
}: ClinicalNumberInputProps) {
  const { theme } = useAppTheme();
  const { colors, typography, radii, spacing } = theme;
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  const hasError = Boolean(error);
  const borderColor = hasError
    ? colors.error
    : focused
      ? colors.primary
      : colors.outlineVariant;
  const backgroundColor = !editable
    ? colors.surfaceContainer
    : colors.surface;
  const textColor = !editable
    ? colors.primary
    : colors.onSurface;

  return (
    <View style={[styles.wrapper, { gap: spacing.xs }, containerStyle]}>
      <Text
        style={[
          typography.labelMedium,
          { color: hasError ? colors.error : colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text>

      <Pressable
        accessible={false}
        onPress={() => {
          if (editable) {
            inputRef.current?.focus();
          }
        }}
        style={[
          styles.inputContainer,
          {
            backgroundColor,
            borderColor,
            borderWidth: focused || hasError ? 1.5 : 1,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          testID={testID}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.outline}
          editable={editable}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          returnKeyType="done"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={accessibilityLabel ?? label}
          accessibilityState={{ disabled: !editable }}
          style={[
            styles.input,
            typography.numericBody,
            { color: textColor },
          ]}
        />

        {unit ? (
          <Text
            style={[
              typography.labelMedium,
              { color: colors.onSurfaceVariant },
            ]}
          >
            {unit}
          </Text>
        ) : null}

        {rightAccessory}
      </Pressable>

      {hasError ? (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.feedbackRow, { gap: spacing.xs }]}
        >
          <AlertCircle size={14} color={colors.error} strokeWidth={2} />
          <Text style={[typography.bodySmall, { color: colors.error, flex: 1 }]}>
            {error}
          </Text>
        </View>
      ) : helperText ? (
        <Text style={[typography.bodySmall, { color: colors.onSurfaceVariant }]}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputContainer: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    paddingVertical: 10,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
