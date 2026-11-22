import React from 'react';
import { AccessibilityInfo } from 'react-native';
import * as ReactNative from 'react-native';
import * as SystemUI from 'expo-system-ui';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { darkColors, lightColors } from '@/theme/colors';
import { ThemeProvider } from '@/theme/ThemeProvider';
import RootLayout from '../_layout';
import TabsLayout from '../(tabs)/_layout';

const mockCapturedStackProps: Record<string, unknown>[] = [];
const mockCapturedTabsProps: Record<string, unknown>[] = [];
const mockCapturedNavThemeValues: Record<string, unknown>[] = [];

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    initialWindowMetrics: {
      frame: { x: 0, y: 0, width: 390, height: 844 },
      insets: { top: 24, left: 0, right: 0, bottom: 16 },
    },
  };
});

jest.mock('expo-router', () => {
  function MockStackScreen() {
    return null;
  }
  function MockStack({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) {
    mockCapturedStackProps.push(props);
    return <>{children}</>;
  }
  MockStack.Screen = MockStackScreen;

  function MockTabsScreen() {
    return null;
  }
  function MockTabs({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) {
    mockCapturedTabsProps.push(props);
    return <>{children}</>;
  }
  MockTabs.Screen = MockTabsScreen;

  function MockNavThemeProvider({
    value,
    children,
  }: {
    value: Record<string, unknown>;
    children: React.ReactNode;
  }) {
    mockCapturedNavThemeValues.push(value);
    return <>{children}</>;
  }

  return {
    Stack: MockStack,
    Tabs: MockTabs,
    ThemeProvider: MockNavThemeProvider,
    DarkTheme: {
      dark: true,
      colors: {
        primary: '#fff',
        background: '#000',
        card: '#111',
        text: '#fff',
        border: '#222',
        notification: '#f00',
      },
      fonts: {},
    },
    DefaultTheme: {
      dark: false,
      colors: {
        primary: '#000',
        background: '#fff',
        card: '#fff',
        text: '#000',
        border: '#ccc',
        notification: '#f00',
      },
      fonts: {},
    },
    usePathname: () => '/',
    useRouter: () => ({
      navigate: jest.fn(),
      push: jest.fn(),
      back: jest.fn(),
    }),
  };
});

describe('Navigation Root & Tabs Dark Mode Background Wiring', () => {
  beforeEach(() => {
    mockCapturedStackProps.length = 0;
    mockCapturedTabsProps.length = 0;
    mockCapturedNavThemeValues.length = 0;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('RootLayout wires NavigationThemeProvider, Stack contentStyle, and SystemUI background to darkColors.background in dark mode', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('dark');
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
      remove: jest.fn(),
    } as never);
    const sysUiSpy = jest
      .spyOn(SystemUI, 'setBackgroundColorAsync')
      .mockResolvedValue();

    await render(<RootLayout />);

    await waitFor(() => {
      expect(sysUiSpy).toHaveBeenCalledWith(darkColors.background);
    });

    const latestTheme = mockCapturedNavThemeValues.at(-1) as {
      dark: boolean;
      colors: { background: string; card: string; text: string };
    };
    expect(latestTheme.dark).toBe(true);
    expect(latestTheme.colors.background).toBe(darkColors.background);
    expect(latestTheme.colors.card).toBe(darkColors.surface);
    expect(latestTheme.colors.text).toBe(darkColors.onSurface);

    const latestStack = mockCapturedStackProps.at(-1) as {
      screenOptions: { contentStyle: { backgroundColor: string } };
    };
    expect(latestStack.screenOptions.contentStyle.backgroundColor).toBe(
      darkColors.background
    );
  });

  it('TabsLayout updates Tabs sceneStyle backgroundColor when toggling between light and dark mode', async () => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
    jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(false);
    jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
      remove: jest.fn(),
    } as never);

    const { getByTestId } = await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 24, left: 0, right: 0, bottom: 16 },
        }}
      >
        <LanguageProvider initialLanguage="id">
          <ThemeProvider>
            <TabsLayout />
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    );

    const lightTabs = mockCapturedTabsProps.at(-1) as {
      screenOptions: { sceneStyle: { backgroundColor: string } };
    };
    expect(lightTabs.screenOptions.sceneStyle.backgroundColor).toBe(
      lightColors.background
    );

    await fireEvent.press(getByTestId('theme-toggle-button'));

    const darkTabs = mockCapturedTabsProps.at(-1) as {
      screenOptions: { sceneStyle: { backgroundColor: string } };
    };
    expect(darkTabs.screenOptions.sceneStyle.backgroundColor).toBe(
      darkColors.background
    );
  });
});
