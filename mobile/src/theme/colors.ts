export interface ClinicalRolePalette {
  main: string;
  onMain: string;
  container: string;
  onContainer: string;
  border: string;
}

export interface AppColorScheme {
  primary: string;
  onPrimary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondary: string;
  onSecondary: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  background: string;
  surface: string;
  surfaceContainerLowest: string;
  surfaceContainerLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceContainerHighest: string;
  onSurface: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  error: string;
  onError: string;
  errorContainer: string;
  onErrorContainer: string;
  scrim: string;
  clinical: {
    safe: ClinicalRolePalette;
    warning: ClinicalRolePalette;
    danger: ClinicalRolePalette;
    info: ClinicalRolePalette;
  };
}

export const lightColors: AppColorScheme = {
  primary: '#7F1D1D',
  onPrimary: '#FFFFFF',
  primaryContainer: '#FEE2E2',
  onPrimaryContainer: '#450A0A',
  secondary: '#6B4C4E',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#F5E6E7',
  onSecondaryContainer: '#2A1517',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F8FAFC',
  surfaceContainer: '#F1F5F9',
  surfaceContainerHigh: '#E2E8F0',
  surfaceContainerHighest: '#CBD5E1',
  onSurface: '#0F172A',
  onSurfaceVariant: '#475569',
  outline: '#64748B',
  outlineVariant: '#CBD5E1',
  error: '#B91C1C',
  onError: '#FFFFFF',
  errorContainer: '#FEE2E2',
  onErrorContainer: '#7F1D1D',
  scrim: 'rgba(15, 23, 42, 0.45)',
  clinical: {
    safe: {
      main: '#047857',
      onMain: '#FFFFFF',
      container: '#ECFDF5',
      onContainer: '#064E3B',
      border: '#A7F3D0',
    },
    warning: {
      main: '#B45309',
      onMain: '#FFFFFF',
      container: '#FFFBEB',
      onContainer: '#78350F',
      border: '#FDE68A',
    },
    danger: {
      main: '#B91C1C',
      onMain: '#FFFFFF',
      container: '#FEF2F2',
      onContainer: '#7F1D1D',
      border: '#FECACA',
    },
    info: {
      main: '#1D4ED8',
      onMain: '#FFFFFF',
      container: '#EFF6FF',
      onContainer: '#1E3A8A',
      border: '#BFDBFE',
    },
  },
};

export const darkColors: AppColorScheme = {
  primary: '#FCA5A5',
  onPrimary: '#450A0A',
  primaryContainer: '#7F1D1D',
  onPrimaryContainer: '#FEE2E2',
  secondary: '#E2BEC0',
  onSecondary: '#2A1517',
  secondaryContainer: '#4E3234',
  onSecondaryContainer: '#F9ECEC',
  background: '#111318',
  surface: '#161920',
  surfaceContainerLowest: '#0D0F14',
  surfaceContainerLow: '#1A1D25',
  surfaceContainer: '#1F232C',
  surfaceContainerHigh: '#292E39',
  surfaceContainerHighest: '#343A47',
  onSurface: '#F1F5F9',
  onSurfaceVariant: '#CBD5E1',
  outline: '#94A3B8',
  outlineVariant: '#334155',
  error: '#FCA5A5',
  onError: '#450A0A',
  errorContainer: '#7F1D1D',
  onErrorContainer: '#FEE2E2',
  scrim: 'rgba(0, 0, 0, 0.65)',
  clinical: {
    safe: {
      main: '#6EE7B7',
      onMain: '#022C22',
      container: '#064E3B',
      onContainer: '#D1FAE5',
      border: '#059669',
    },
    warning: {
      main: '#FCD34D',
      onMain: '#451A03',
      container: '#78350F',
      onContainer: '#FEF3C7',
      border: '#D97706',
    },
    danger: {
      main: '#FCA5A5',
      onMain: '#450A0A',
      container: '#7F1D1D',
      onContainer: '#FEE2E2',
      border: '#DC2626',
    },
    info: {
      main: '#93C5FD',
      onMain: '#172554',
      container: '#1E3A8A',
      onContainer: '#DBEAFE',
      border: '#2563EB',
    },
  },
};

function linearizeChannel(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(hex: string): number {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) {
    throw new Error(`Expected 6-digit hex color, received "${hex}"`);
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (
    0.2126 * linearizeChannel(r) +
    0.7152 * linearizeChannel(g) +
    0.0722 * linearizeChannel(b)
  );
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
