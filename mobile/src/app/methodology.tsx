import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReaderHeader } from '@/components/navigation/ReaderHeader';
import { MethodologyContent } from '@/features/info';
import { useAppLanguage } from '@/i18n/LanguageProvider';
import { useAppTheme } from '@/theme/ThemeProvider';

export default function MethodologyScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const { t } = useAppLanguage();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = theme;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ReaderHeader
        testIDPrefix="methodology-reader"
        title={t('methodology.headerTitle')}
        onBack={() => router.back()}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{
          paddingHorizontal: Math.max(spacing.lg, insets.left, insets.right),
          paddingTop: spacing.lg,
          paddingBottom: insets.bottom + spacing.xxl,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MethodologyContent />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
});
