import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';

export interface ResultSheetModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  testID?: string;
}

export function ResultSheetModal({
  visible,
  title,
  onClose,
  children,
  testID = 'result-sheet-modal',
}: ResultSheetModalProps) {
  const { theme, reduceMotion } = useAppTheme();
  const { t } = useAppLanguage();
  const insets = useSafeAreaInsets();
  const { colors, typography, radii, spacing } = theme;

  return (
    <Modal
      testID={`${testID}-modal`}
      visible={visible}
      transparent
      statusBarTranslucent
      animationType={reduceMotion ? 'none' : 'slide'}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.root, { backgroundColor: colors.scrim }]}
      >
        <Pressable
          testID={`${testID}-backdrop`}
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t('common.close')}
        />

        <View
          testID={testID}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderTopLeftRadius: radii.xl,
              borderTopRightRadius: radii.xl,
              paddingBottom: Math.max(insets.bottom, spacing.lg),
            },
          ]}
        >
          <View
            style={[
              styles.handle,
              { backgroundColor: colors.outlineVariant },
            ]}
          />

          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.outlineVariant,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
              },
            ]}
          >
            <Text
              accessibilityRole="header"
              style={[
                typography.titleLarge,
                { color: colors.onSurface, flex: 1 },
              ]}
            >
              {title}
            </Text>
            <Pressable
              testID={`${testID}-close`}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              style={styles.closeBtn}
            >
              <X size={22} color={colors.onSurfaceVariant} strokeWidth={2} />
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{
              padding: spacing.lg,
              gap: spacing.md,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    height: '10%',
    minHeight: 48,
  },
  sheet: {
    maxHeight: '90%',
    overflow: 'hidden',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
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
  scroll: {
    flexGrow: 0,
  },
});
