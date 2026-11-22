import type { TextStyle } from 'react-native';

export type MaterialTypeRole =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'numericDisplay'
  | 'numericTitle'
  | 'numericBody'
  | 'numericLabel';

export const SYSTEM_SANS_FAMILY = 'sans-serif';
export const SYSTEM_MONO_FAMILY = 'monospace';

export const typeScale: Record<MaterialTypeRole, TextStyle> = {
  displayLarge: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400',
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
    letterSpacing: 0,
  },
  displaySmall: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '700',
    letterSpacing: 0,
  },
  headlineLarge: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: 0,
  },
  headlineMedium: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    letterSpacing: 0,
  },
  headlineSmall: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: 0,
  },
  titleLarge: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: 0,
  },
  titleMedium: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  bodyLarge: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodyMedium: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  labelLarge: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  labelSmall: {
    fontFamily: SYSTEM_SANS_FAMILY,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  numericDisplay: {
    fontFamily: SYSTEM_MONO_FAMILY,
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  numericTitle: {
    fontFamily: SYSTEM_MONO_FAMILY,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  numericBody: {
    fontFamily: SYSTEM_MONO_FAMILY,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  numericLabel: {
    fontFamily: SYSTEM_MONO_FAMILY,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
};
