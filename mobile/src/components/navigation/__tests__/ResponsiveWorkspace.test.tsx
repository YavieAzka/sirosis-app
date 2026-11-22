import React from 'react';
import { AccessibilityInfo, Dimensions, Text } from 'react-native';
import * as ReactNative from 'react-native';
import { render } from '@testing-library/react-native';

import { ThemeProvider } from '@/theme/ThemeProvider';
import { ResponsiveWorkspace } from '../ResponsiveWorkspace';

async function renderWorkspace(width: number, withSecondary: boolean) {
  Dimensions.set({
    window: { width, height: 800, scale: 2, fontScale: 1 },
    screen: { width, height: 800, scale: 2, fontScale: 1 },
  });
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <ThemeProvider>
      <ResponsiveWorkspace
        primaryPane={<Text testID="primary-pane">Primary</Text>}
        secondaryPane={
          withSecondary ? <Text testID="secondary-pane">Secondary</Text> : undefined
        }
      />
    </ThemeProvider>
  );
}

describe('ResponsiveWorkspace', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uses single-pane vertical layout on compact phones (< 600dp)', async () => {
    const { getByTestId, queryByTestId } = await renderWorkspace(390, true);
    expect(getByTestId('workspace-single-pane')).toBeTruthy();
    expect(queryByTestId('workspace-two-pane')).toBeNull();
    expect(getByTestId('primary-pane')).toBeTruthy();
    expect(getByTestId('secondary-pane')).toBeTruthy();
  });

  it('uses two-pane side-by-side layout on wide screens (>= 600dp) when secondaryPane exists', async () => {
    const { getByTestId, queryByTestId } = await renderWorkspace(768, true);
    expect(getByTestId('workspace-two-pane')).toBeTruthy();
    expect(queryByTestId('workspace-single-pane')).toBeNull();
    expect(getByTestId('primary-pane')).toBeTruthy();
    expect(getByTestId('secondary-pane')).toBeTruthy();
  });

  it('falls back to single-pane layout on wide screens when secondaryPane is omitted', async () => {
    const { getByTestId, queryByTestId } = await renderWorkspace(900, false);
    expect(getByTestId('workspace-single-pane')).toBeTruthy();
    expect(queryByTestId('workspace-two-pane')).toBeNull();
  });
});
