import {
  darkColors,
  getContrastRatio,
  getRelativeLuminance,
  lightColors,
  type AppColorScheme,
} from '../colors';

function assertPaletteAccessibility(name: string, palette: AppColorScheme) {
  it(`${name}: maintains WCAG AA (>= 4.5:1) contrast on brand, surface, and error roles`, () => {
    expect(getContrastRatio(palette.onPrimary, palette.primary)).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(palette.onPrimaryContainer, palette.primaryContainer)
    ).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(palette.onSecondary, palette.secondary)).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(palette.onSecondaryContainer, palette.secondaryContainer)
    ).toBeGreaterThanOrEqual(4.5);

    const surfaces = [
      palette.background,
      palette.surface,
      palette.surfaceContainerLow,
      palette.surfaceContainer,
      palette.surfaceContainerHigh,
    ];
    for (const surfaceHex of surfaces) {
      expect(getContrastRatio(palette.onSurface, surfaceHex)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(palette.onSurfaceVariant, surfaceHex)).toBeGreaterThanOrEqual(4.5);
    }

    expect(getContrastRatio(palette.onError, palette.error)).toBeGreaterThanOrEqual(4.5);
    expect(
      getContrastRatio(palette.onErrorContainer, palette.errorContainer)
    ).toBeGreaterThanOrEqual(4.5);
  });

  it(`${name}: maintains WCAG AA (>= 4.5:1) contrast on all clinical semantic palettes`, () => {
    const roles = ['safe', 'warning', 'danger', 'info'] as const;
    for (const role of roles) {
      const token = palette.clinical[role];
      expect(getContrastRatio(token.onMain, token.main)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(token.onContainer, token.container)).toBeGreaterThanOrEqual(4.5);
      expect(getContrastRatio(token.main, palette.surface)).toBeGreaterThanOrEqual(4.5);
    }
  });
}

describe('Material Design 3 color tokens', () => {
  assertPaletteAccessibility('lightColors', lightColors);
  assertPaletteAccessibility('darkColors', darkColors);

  it('has identical token keys between lightColors and darkColors', () => {
    expect(Object.keys(lightColors).sort()).toEqual(Object.keys(darkColors).sort());
    expect(Object.keys(lightColors.clinical).sort()).toEqual(
      Object.keys(darkColors.clinical).sort()
    );
  });

  it('throws on invalid hex strings in getRelativeLuminance', () => {
    expect(() => getRelativeLuminance('#fff')).toThrow();
    expect(() => getRelativeLuminance('invalid')).toThrow();
  });
});
