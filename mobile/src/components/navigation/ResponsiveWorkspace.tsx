import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useWindowSizeClass } from '@/hooks/useWindowSizeClass';
import { useAppTheme } from '@/theme/ThemeProvider';

export interface ResponsiveWorkspaceProps {
  primaryPane: React.ReactNode;
  secondaryPane?: React.ReactNode;
}

export function ResponsiveWorkspace({
  primaryPane,
  secondaryPane,
}: ResponsiveWorkspaceProps) {
  const { isWide } = useWindowSizeClass();
  const { theme } = useAppTheme();
  const { colors, spacing } = theme;

  if (isWide && secondaryPane) {
    return (
      <KeyboardAvoidingView
        style={[styles.flexOne, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View
          testID="workspace-two-pane"
          style={[
            styles.twoPaneContainer,
            {
              backgroundColor: colors.background,
              padding: spacing.lg,
              gap: spacing.lg,
            },
          ]}
        >
          <ScrollView
            style={[styles.pane, { backgroundColor: colors.background }]}
            contentContainerStyle={[styles.paneContent, { gap: spacing.md }]}
            keyboardShouldPersistTaps="handled"
          >
            {primaryPane}
          </ScrollView>
          <ScrollView
            style={[styles.pane, { backgroundColor: colors.background }]}
            contentContainerStyle={[styles.paneContent, { gap: spacing.md }]}
            keyboardShouldPersistTaps="handled"
          >
            {secondaryPane}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.flexOne, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        testID="workspace-single-pane"
        style={[styles.singleScroll, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.singleContent,
          {
            padding: isWide ? spacing.xl : spacing.lg,
            gap: spacing.md,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {primaryPane}
        {secondaryPane}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  singleScroll: {
    flex: 1,
  },
  singleContent: {
    flexGrow: 1,
  },
  twoPaneContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  pane: {
    flex: 1,
  },
  paneContent: {
    flexGrow: 1,
  },
});
