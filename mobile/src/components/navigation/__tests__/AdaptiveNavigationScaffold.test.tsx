import React from 'react';
import { AccessibilityInfo, Dimensions, StyleSheet, Text } from 'react-native';
import * as ReactNative from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '@/theme/ThemeProvider';
import { TOUCH_TARGET } from '@/theme/tokens';
import { AdaptiveNavigationScaffold } from '../AdaptiveNavigationScaffold';
import { APP_DESTINATIONS } from '../destinations';

async function renderWithDimensions(
  width: number,
  height: number,
  activeKey: 'index' | 'los' | 'dose' | 'info' = 'index',
  onSelectDestination = jest.fn(),
  onToggleLanguage?: jest.Mock
) {
  Dimensions.set({
    window: { width, height, scale: 2, fontScale: 1 },
    screen: { width, height, scale: 2, fontScale: 1 },
  });
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  const utils = await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width, height },
        insets: { top: 24, left: 0, right: 0, bottom: 16 },
      }}
    >
      <ThemeProvider>
        <AdaptiveNavigationScaffold
          destinations={APP_DESTINATIONS}
          activeKey={activeKey}
          onSelectDestination={onSelectDestination}
          languageCode={onToggleLanguage ? 'id' : undefined}
          onToggleLanguage={onToggleLanguage}
        >
          <Text testID="child-screen">Screen Body</Text>
        </AdaptiveNavigationScaffold>
      </ThemeProvider>
    </SafeAreaProvider>
  );

  return { ...utils, onSelectDestination };
}

describe('AdaptiveNavigationScaffold', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders Material Bottom Navigation Bar on compact Android phones (< 600dp)', async () => {
    const { getByTestId, queryByTestId, getByText, onSelectDestination } =
      await renderWithDimensions(390, 844, 'index');

    expect(getByTestId('bottom-navigation-bar')).toBeTruthy();
    expect(queryByTestId('navigation-rail')).toBeNull();
    expect(getByText('AI Prediksi Mortalitas')).toBeTruthy();

    const activeTab = getByTestId('bottom-tab-index');
    expect(activeTab.props.accessibilityState).toEqual({ selected: true });
    const tabStyle = StyleSheet.flatten(activeTab.props.style);
    expect(tabStyle.minHeight).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);
    expect(tabStyle.minWidth).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);

    const toggleBtn = getByTestId('theme-toggle-button');
    expect(toggleBtn.props.accessibilityLabel).toBe('Aktifkan mode gelap');

    await fireEvent.press(getByTestId('bottom-tab-dose'));
    expect(onSelectDestination).toHaveBeenCalledWith('dose');

    await fireEvent.press(toggleBtn);
    expect(getByTestId('theme-toggle-button').props.accessibilityLabel).toBe(
      'Aktifkan mode terang'
    );
  });

  it('switches to Material Navigation Rail on ward tablets (>= 600dp)', async () => {
    const { getByTestId, queryByTestId, getByText, onSelectDestination } =
      await renderWithDimensions(840, 1080, 'los');

    expect(getByTestId('navigation-rail')).toBeTruthy();
    expect(queryByTestId('bottom-navigation-bar')).toBeNull();
    expect(getByText('AI Prediksi Lama Rawat')).toBeTruthy();

    const activeRailItem = getByTestId('rail-item-los');
    expect(activeRailItem.props.accessibilityState).toEqual({ selected: true });

    const railStyle = StyleSheet.flatten(activeRailItem.props.style);
    expect(railStyle.minHeight).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);
    expect(railStyle.minWidth).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);

    await fireEvent.press(getByTestId('rail-item-info'));
    expect(onSelectDestination).toHaveBeenCalledWith('info');
  });

  it('renders accessible language toggle chip (>= 48dp) when language props are supplied', async () => {
    const onToggleLanguage = jest.fn();
    const { getByTestId, getByText } = await renderWithDimensions(
      390,
      844,
      'index',
      jest.fn(),
      onToggleLanguage
    );

    const langBtn = getByTestId('language-toggle-button');
    const langStyle = StyleSheet.flatten(langBtn.props.style);
    expect(langStyle.minHeight).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);
    expect(langStyle.minWidth).toBeGreaterThanOrEqual(TOUCH_TARGET.MIN_SIZE_DP);
    expect(getByText('ID')).toBeTruthy();

    await fireEvent.press(langBtn);
    expect(onToggleLanguage).toHaveBeenCalledTimes(1);
  });
});
