import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';

import {
  darkColors,
  lightColors,
  type AppColorScheme,
} from '@/theme/colors';
import { MOTION, RADII, SPACING, TOUCH_TARGET } from '@/theme/tokens';
import { typeScale, type MaterialTypeRole } from '@/theme/typography';
import type { TextStyle } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedColorMode = 'light' | 'dark';

export interface AppTheme {
  mode: ResolvedColorMode;
  colors: AppColorScheme;
  typography: Record<MaterialTypeRole, TextStyle>;
  spacing: typeof SPACING;
  radii: typeof RADII;
  touchTarget: typeof TOUCH_TARGET;
  motion: typeof MOTION;
}

export interface ThemeContextValue {
  theme: AppTheme;
  preference: ThemePreference;
  colorMode: ResolvedColorMode;
  reduceMotion: boolean;
  setPreference: (pref: ThemePreference) => void;
  toggleTheme: () => void;
  effectiveDuration: (durationMs: number) => number;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({
  children,
  initialPreference = 'system',
}: {
  children: React.ReactNode;
  initialPreference?: ThemePreference;
}) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>(initialPreference);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(Boolean(enabled));
      })
      .catch(() => {
        // Ignore on unsupported test runtimes
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setReduceMotion(Boolean(enabled));
      }
    );

    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  const colorMode: ResolvedColorMode =
    preference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const toggleTheme = useCallback(() => {
    setPreference((prev) => {
      const currentResolved =
        prev === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : prev;
      return currentResolved === 'dark' ? 'light' : 'dark';
    });
  }, [systemScheme]);

  const effectiveDuration = useCallback(
    (durationMs: number) => (reduceMotion ? MOTION.REDUCED_MS : durationMs),
    [reduceMotion]
  );

  const theme = useMemo<AppTheme>(
    () => ({
      mode: colorMode,
      colors: colorMode === 'dark' ? darkColors : lightColors,
      typography: typeScale,
      spacing: SPACING,
      radii: RADII,
      touchTarget: TOUCH_TARGET,
      motion: MOTION,
    }),
    [colorMode]
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      preference,
      colorMode,
      reduceMotion,
      setPreference,
      toggleTheme,
      effectiveDuration,
    }),
    [theme, preference, colorMode, reduceMotion, toggleTheme, effectiveDuration]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
