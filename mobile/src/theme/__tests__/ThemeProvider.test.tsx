import React from 'react';
import { AccessibilityInfo, Pressable, Text } from 'react-native';
import * as ReactNative from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';

import { ThemeProvider, useAppTheme } from '../ThemeProvider';
import { darkColors, lightColors } from '../colors';

function ThemeProbe() {
  const {
    colorMode,
    preference,
    reduceMotion,
    toggleTheme,
    setPreference,
    effectiveDuration,
    theme,
  } = useAppTheme();

  return (
    <>
      <Text testID="color-mode">{colorMode}</Text>
      <Text testID="preference">{preference}</Text>
      <Text testID="primary-hex">{theme.colors.primary}</Text>
      <Text testID="reduce-motion">{String(reduceMotion)}</Text>
      <Text testID="duration-200">{String(effectiveDuration(200))}</Text>
      <Pressable testID="toggle-btn" onPress={toggleTheme} />
      <Pressable testID="set-dark-btn" onPress={() => setPreference('dark')} />
    </>
  );
}

describe('ThemeProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('resolves system color scheme and supports toggling Light/Dark themes', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    const removeMock = jest.fn();
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
      remove: removeMock,
    } as never);

    const { getByTestId, unmount } = await render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('color-mode').props.children).toBe('light');
    });
    expect(getByTestId('primary-hex').props.children).toBe(lightColors.primary);
    expect(getByTestId('duration-200').props.children).toBe('200');

    await fireEvent.press(getByTestId('toggle-btn'));
    expect(getByTestId('color-mode').props.children).toBe('dark');
    expect(getByTestId('primary-hex').props.children).toBe(darkColors.primary);

    await fireEvent.press(getByTestId('toggle-btn'));
    expect(getByTestId('color-mode').props.children).toBe('light');

    await fireEvent.press(getByTestId('set-dark-btn'));
    expect(getByTestId('preference').props.children).toBe('dark');
    expect(getByTestId('color-mode').props.children).toBe('dark');

    await unmount();
    expect(removeMock).toHaveBeenCalledTimes(1);
  });

  it('follows dark system preference by default when system scheme is dark', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
      remove: jest.fn(),
    } as never);

    const { getByTestId } = await render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('color-mode').props.children).toBe('dark');
    });
    expect(getByTestId('primary-hex').props.children).toBe(darkColors.primary);
  });

  it('honors OS Reduce Motion initial state and live change events', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);

    let changeHandler: ((enabled: boolean) => void) | undefined;
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'reduceMotionChanged') {
        changeHandler = handler as (enabled: boolean) => void;
      }
      return { remove: jest.fn() } as never;
    });

    const { getByTestId } = await render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('reduce-motion').props.children).toBe('true');
    });
    expect(getByTestId('duration-200').props.children).toBe('0');

    await act(async () => {
      changeHandler?.(false);
    });
    expect(getByTestId('reduce-motion').props.children).toBe('false');
    expect(getByTestId('duration-200').props.children).toBe('200');
  });

  it('throws clear error when useAppTheme is called outside ThemeProvider', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(render(<ThemeProbe />)).rejects.toThrow(
      'useAppTheme must be used within ThemeProvider'
    );
    spy.mockRestore();
  });
});
