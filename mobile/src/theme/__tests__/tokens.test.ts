import {
  getWindowSizeClass,
  isWideWindowClass,
  MOTION,
  SPACING,
  TOUCH_TARGET,
} from '../tokens';
import { typeScale } from '../typography';

describe('Android Material 3 design tokens', () => {
  it('enforces minimum 48dp touch targets and 8dp spacing gap', () => {
    expect(TOUCH_TARGET.MIN_SIZE_DP).toBeGreaterThanOrEqual(48);
    expect(TOUCH_TARGET.MIN_GAP_DP).toBeGreaterThanOrEqual(8);
  });

  it('defines snappy Operate-mode motion durations (150-250ms) and 0ms reduced motion', () => {
    expect(MOTION.FAST_MS).toBeGreaterThanOrEqual(150);
    expect(MOTION.EMPHASIZED_MS).toBeLessThanOrEqual(250);
    expect(MOTION.REDUCED_MS).toBe(0);
  });

  it('resolves Material 3 Window Size Classes accurately across phone and tablet widths', () => {
    expect(getWindowSizeClass(320)).toBe('compact');
    expect(getWindowSizeClass(390)).toBe('compact');
    expect(getWindowSizeClass(599)).toBe('compact');
    expect(isWideWindowClass(getWindowSizeClass(599))).toBe(false);

    expect(getWindowSizeClass(600)).toBe('medium');
    expect(getWindowSizeClass(768)).toBe('medium');
    expect(getWindowSizeClass(839)).toBe('medium');
    expect(isWideWindowClass(getWindowSizeClass(600))).toBe(true);

    expect(getWindowSizeClass(840)).toBe('expanded');
    expect(getWindowSizeClass(1280)).toBe('expanded');
    expect(isWideWindowClass(getWindowSizeClass(840))).toBe(true);
  });

  it('keeps spacing scale monotonically increasing', () => {
    expect(SPACING.xxs).toBeLessThan(SPACING.xs);
    expect(SPACING.xs).toBeLessThan(SPACING.sm);
    expect(SPACING.sm).toBeLessThan(SPACING.md);
    expect(SPACING.md).toBeLessThan(SPACING.lg);
    expect(SPACING.lg).toBeLessThan(SPACING.xl);
    expect(SPACING.xl).toBeLessThan(SPACING.xxl);
  });

  it('configures tabular-nums on all numeric typography roles', () => {
    const numericRoles = [
      typeScale.numericDisplay,
      typeScale.numericTitle,
      typeScale.numericBody,
      typeScale.numericLabel,
    ];
    for (const style of numericRoles) {
      expect(style.fontVariant).toContain('tabular-nums');
      expect(typeof style.fontSize).toBe('number');
    }
  });
});
