import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AlertCircle, Check, ChevronDown, X } from 'lucide-react-native';

import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface SelectOption<T extends string | number> {
  value: T;
  label: string;
  description?: string;
}

export interface MaterialSelectSheetProps<T extends string | number> {
  label: string;
  value: T | '';
  options: SelectOption<T>[];
  onSelect: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
  testID?: string;
}

export function MaterialSelectSheet<T extends string | number>({
  label,
  value,
  options,
  onSelect,
  placeholder,
  disabled = false,
  error,
  testID,
}: MaterialSelectSheetProps<T>) {
  const { theme, reduceMotion } = useAppTheme();
  const { t } = useAppLanguage();
  const insets = useSafeAreaInsets();
  const { colors, typography, radii, spacing } = theme;
  const [open, setOpen] = useState(false);
  const resolvedPlaceholder = placeholder ?? t('common.select');

  const selectedOption = options.find((opt) => opt.value === value);
  const hasError = Boolean(error);

  const handleOpen = () => {
    if (!disabled) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChoose = (nextValue: T) => {
    onSelect(nextValue);
    setOpen(false);
  };

  return (
    <View style={[styles.wrapper, { gap: spacing.xs }]}>
      <Text
        style={[
          typography.labelMedium,
          { color: hasError ? colors.error : colors.onSurfaceVariant },
        ]}
      >
        {label}
      </Text>

      <Pressable
        testID={testID}
        onPress={handleOpen}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={
          selectedOption ? `${label}: ${selectedOption.label}` : label
        }
        accessibilityState={{ disabled, expanded: open }}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: disabled
              ? colors.surfaceContainer
              : pressed
                ? colors.surfaceContainerLow
                : colors.surface,
            borderColor: hasError ? colors.error : colors.outlineVariant,
            borderWidth: hasError ? 1.5 : 1,
            borderRadius: radii.md,
            paddingHorizontal: spacing.md,
            gap: spacing.sm,
          },
        ]}
      >
        <Text
          style={[
            typography.bodyMedium,
            {
              flex: 1,
              color: disabled
                ? colors.outline
                : selectedOption
                  ? colors.onSurface
                  : colors.outline,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : resolvedPlaceholder}
        </Text>
        <ChevronDown
          size={20}
          color={disabled ? colors.outline : colors.onSurfaceVariant}
          strokeWidth={2}
        />
      </Pressable>

      {hasError && (
        <View
          accessibilityLiveRegion="polite"
          style={[styles.errorRow, { gap: spacing.xs }]}
        >
          <AlertCircle size={14} color={colors.error} strokeWidth={2} />
          <Text style={[typography.bodySmall, { color: colors.error, flex: 1 }]}>
            {error}
          </Text>
        </View>
      )}

      <Modal
        visible={open}
        transparent
        statusBarTranslucent
        animationType={reduceMotion ? 'none' : 'slide'}
        onRequestClose={handleClose}
      >
        <View style={[styles.modalRoot, { backgroundColor: colors.scrim }]}>
          <Pressable
            testID={testID ? `${testID}-backdrop` : 'select-sheet-backdrop'}
            style={styles.backdrop}
            onPress={handleClose}
            accessibilityRole="button"
            accessibilityLabel={t('common.close')}
          />

          <View
            testID={testID ? `${testID}-sheet` : 'select-sheet-content'}
            style={[
              styles.sheet,
              {
                backgroundColor: colors.surface,
                borderTopLeftRadius: radii.xl,
                borderTopRightRadius: radii.xl,
                paddingBottom: Math.max(insets.bottom, spacing.lg),
              },
            ]}
          >
            <View
              style={[
                styles.sheetHandleBar,
                { backgroundColor: colors.outlineVariant },
              ]}
            />

            <View
              style={[
                styles.sheetHeader,
                {
                  borderBottomColor: colors.outlineVariant,
                  paddingHorizontal: spacing.lg,
                  paddingVertical: spacing.md,
                },
              ]}
            >
              <Text
                accessibilityRole="header"
                style={[
                  typography.titleMedium,
                  { color: colors.onSurface, flex: 1 },
                ]}
              >
                {label}
              </Text>
              <Pressable
                testID={testID ? `${testID}-close` : 'select-sheet-close'}
                onPress={handleClose}
                accessibilityRole="button"
                accessibilityLabel={t('common.close')}
                style={styles.closeBtn}
              >
                <X size={20} color={colors.onSurfaceVariant} strokeWidth={2} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.optionsList}
              contentContainerStyle={{
                padding: spacing.md,
                gap: spacing.xs,
              }}
            >
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <Pressable
                    key={String(opt.value)}
                    testID={
                      testID
                        ? `${testID}-option-${String(opt.value)}`
                        : `select-option-${String(opt.value)}`
                    }
                    onPress={() => handleChoose(opt.value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={opt.label}
                    style={({ pressed }) => [
                      styles.optionRow,
                      {
                        backgroundColor: isSelected
                          ? colors.primaryContainer
                          : pressed
                            ? colors.surfaceContainer
                            : colors.surface,
                        borderRadius: radii.md,
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.md,
                        gap: spacing.sm,
                      },
                    ]}
                  >
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text
                        style={[
                          typography.bodyMedium,
                          {
                            color: isSelected
                              ? colors.onPrimaryContainer
                              : colors.onSurface,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {opt.description ? (
                        <Text
                          style={[
                            typography.bodySmall,
                            {
                              color: isSelected
                                ? colors.onPrimaryContainer
                                : colors.onSurfaceVariant,
                            },
                          ]}
                        >
                          {opt.description}
                        </Text>
                      ) : null}
                    </View>
                    {isSelected && (
                      <Check
                        size={20}
                        color={colors.onPrimaryContainer}
                        strokeWidth={2.2}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  trigger: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    maxHeight: '75%',
  },
  sheetHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeBtn: {
    minWidth: TOUCH_TARGET.MIN_SIZE_DP,
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    flexGrow: 0,
  },
  optionRow: {
    minHeight: TOUCH_TARGET.MIN_SIZE_DP,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
