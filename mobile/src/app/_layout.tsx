import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { UpdatePromptBanner } from '@/components/updates';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider, useAppTheme } from '@/theme/ThemeProvider';
import { OtaUpdateProvider } from '@/updates';

function RootNavigator() {
  const { colorMode, theme } = useAppTheme();
  const { colors } = theme;

  const navigationTheme = useMemo(
    () => ({
      ...(colorMode === 'dark' ? DarkTheme : DefaultTheme),
      dark: colorMode === 'dark',
      colors: {
        ...(colorMode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.primary,
        background: colors.background,
        card: colors.surface,
        text: colors.onSurface,
        border: colors.outlineVariant,
        notification: colors.error,
      },
    }),
    [colorMode, colors]
  );

  useEffect(() => {
    Promise.resolve(SystemUI.setBackgroundColorAsync(colors.background)).catch(
      () => {
        // Ignore on runtimes without native SystemUI support
      }
    );
  }, [colors.background]);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <StatusBar style={colorMode === 'dark' ? 'light' : 'dark'} />
        <UpdatePromptBanner />
        <View style={styles.stackWrap}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="about" />
            <Stack.Screen name="guide" />
            <Stack.Screen name="methodology" />
          </Stack>
        </View>
      </View>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <LanguageProvider>
        <ThemeProvider>
          <OtaUpdateProvider>
            <RootNavigator />
          </OtaUpdateProvider>
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  stackWrap: {
    flex: 1,
  },
});
