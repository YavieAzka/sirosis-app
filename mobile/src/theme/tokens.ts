export type WindowSizeClass = 'compact' | 'medium' | 'expanded';

export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const RADII = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const TOUCH_TARGET = {
  MIN_SIZE_DP: 48,
  MIN_GAP_DP: 8,
} as const;

export const MOTION = {
  FAST_MS: 150,
  STANDARD_MS: 200,
  EMPHASIZED_MS: 250,
  REDUCED_MS: 0,
} as const;

export const WINDOW_BREAKPOINTS = {
  COMPACT_MAX: 599,
  MEDIUM_MIN: 600,
  EXPANDED_MIN: 840,
} as const;

export const TONAL_LEVELS = {
  level0: 'surface',
  level1: 'surfaceContainerLow',
  level2: 'surfaceContainer',
  level3: 'surfaceContainerHigh',
  level4: 'surfaceContainerHighest',
} as const;

export function getWindowSizeClass(widthDp: number): WindowSizeClass {
  if (widthDp >= WINDOW_BREAKPOINTS.EXPANDED_MIN) {
    return 'expanded';
  }
  if (widthDp >= WINDOW_BREAKPOINTS.MEDIUM_MIN) {
    return 'medium';
  }
  return 'compact';
}

export function isWideWindowClass(sizeClass: WindowSizeClass): boolean {
  return sizeClass === 'medium' || sizeClass === 'expanded';
}
