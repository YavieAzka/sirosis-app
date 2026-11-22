import React from 'react';
import { AccessibilityInfo, Dimensions, Linking } from 'react-native';
import * as ReactNative from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SCIENTIFIC_REFERENCES } from '@/constants/methodologyData';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { InfoHubScreenContent } from '../InfoHubScreenContent';
import { MethodologyContent } from '../MethodologyContent';

const mockPush = jest.fn();
const mockNavigate = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    navigate: mockNavigate,
    back: jest.fn(),
  }),
}));

async function renderInfoView(
  node: React.ReactElement,
  width = 390,
  height = 844
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

  return await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width, height },
        insets: { top: 24, left: 0, right: 0, bottom: 16 },
      }}
    >
      <LanguageProvider initialLanguage="id">
        <ThemeProvider>{node}</ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('MethodologyContent and InfoHubScreenContent', () => {
  const originalApiUrl = process.env.EXPO_PUBLIC_API_URL;

  beforeEach(() => {
    mockPush.mockClear();
    mockNavigate.mockClear();
    process.env.EXPO_PUBLIC_API_URL = 'https://cirrhosmart.example.com';
  });

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL = originalApiUrl;
    jest.restoreAllMocks();
  });

  it('MethodologyContent navigates across all 7 tabs and filters/opens 44 scientific references', async () => {
    const browserSpy = jest
      .spyOn(WebBrowser, 'openBrowserAsync')
      .mockResolvedValueOnce({ type: 'dismiss' } as never)
      .mockRejectedValueOnce(new Error('No browser'));
    jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValueOnce(new Error('No fallback'));

    const { getByTestId } = await renderInfoView(
      <MethodologyContent />,
      390,
      844
    );

    expect(getByTestId('methodology-panel-overview')).toBeTruthy();

    await fireEvent.press(getByTestId('methodology-tab-cohort'));
    expect(getByTestId('methodology-panel-cohort')).toBeTruthy();

    await fireEvent.press(getByTestId('methodology-tab-hybrid_ai'));
    expect(getByTestId('methodology-panel-hybrid_ai')).toBeTruthy();

    await fireEvent.press(getByTestId('methodology-tab-metrics'));
    expect(getByTestId('methodology-panel-metrics')).toBeTruthy();
    expect(getByTestId('metrics-compact-list')).toBeTruthy();

    await fireEvent.press(getByTestId('methodology-tab-shap'));
    expect(getByTestId('methodology-panel-shap')).toBeTruthy();

    await fireEvent.press(getByTestId('methodology-tab-dosing'));
    expect(getByTestId('methodology-panel-dosing')).toBeTruthy();

    await fireEvent.press(getByTestId('methodology-tab-references'));
    expect(getByTestId('methodology-panel-references')).toBeTruthy();
    expect(getByTestId('references-count-text').props.children).toContain(
      String(SCIENTIFIC_REFERENCES.length)
    );

    // Category filter: ml_ai
    await fireEvent.press(getByTestId('references-filter-ml_ai'));
    expect(
      getByTestId('references-count-text').props.children
    ).not.toContain(` ${SCIENTIFIC_REFERENCES.length} `);

    // Reset filter to all
    await fireEvent.press(getByTestId('references-filter-all'));
    expect(getByTestId('references-count-text').props.children).toContain(
      String(SCIENTIFIC_REFERENCES.length)
    );

    // Search query matches specific AASLD paper
    await fireEvent.changeText(getByTestId('references-search-input'), 'Biggins');
    expect(getByTestId('references-count-text').props.children).toContain(' 1 ');
    expect(getByTestId('reference-item-1')).toBeTruthy();

    // Open DOI via expo-web-browser
    await fireEvent.press(getByTestId('reference-doi-1'));
    expect(browserSpy).toHaveBeenCalledWith('https://doi.org/10.1002/hep.31884');

    // Second tap fails -> displays inline error alert
    await fireEvent.press(getByTestId('reference-doi-1'));
    await waitFor(() => {
      expect(getByTestId('references-link-error')).toBeTruthy();
    });

    // Query yielding empty state
    await fireEvent.changeText(
      getByTestId('references-search-input'),
      'zzzz-no-match'
    );
    expect(getByTestId('references-empty-state')).toBeTruthy();

    // Clear search resets back to all 44 references
    await fireEvent.press(getByTestId('references-search-clear'));
    expect(getByTestId('references-count-text').props.children).toContain(
      String(SCIENTIFIC_REFERENCES.length)
    );
    expect(getByTestId('reference-item-44')).toBeTruthy();
  });

  it('MethodologyContent renders multi-column metrics table on wide tablet widths', async () => {
    const { getByTestId } = await renderInfoView(
      <MethodologyContent initialTab="metrics" />,
      900,
      700
    );

    expect(getByTestId('metrics-wide-table')).toBeTruthy();
  });

  it('InfoHubScreenContent pushes native routes on phone and toggles language, theme, and web portal', async () => {
    const browserSpy = jest
      .spyOn(WebBrowser, 'openBrowserAsync')
      .mockResolvedValue({ type: 'dismiss' } as never);

    const { getByTestId, getByText } = await renderInfoView(
      <InfoHubScreenContent />,
      390,
      844
    );

    await fireEvent.press(getByTestId('info-menu-about'));
    expect(mockPush).toHaveBeenCalledWith('/about');

    await fireEvent.press(getByTestId('info-menu-guide'));
    expect(mockPush).toHaveBeenCalledWith('/guide');

    await fireEvent.press(getByTestId('info-menu-methodology'));
    expect(mockPush).toHaveBeenCalledWith('/methodology');

    // Language toggle ID -> EN
    await fireEvent.press(getByTestId('info-language-toggle-option-en'));
    await waitFor(() => {
      expect(getByText('Research, Guide & Methodology')).toBeTruthy();
    });

    // Appearance toggle to dark
    await fireEvent.press(getByTestId('info-theme-toggle-option-dark'));
    expect(
      getByTestId('info-theme-toggle-option-dark').props.accessibilityState
        .selected
    ).toBe(true);

    // Open configured web portal
    await fireEvent.press(getByTestId('info-open-web-btn'));
    expect(browserSpy).toHaveBeenCalledWith('https://cirrhosmart.example.com');
  });

  it('InfoHubScreenContent renders side-by-side reader on tablet and supports fullscreen expand', async () => {
    const { getByTestId } = await renderInfoView(
      <InfoHubScreenContent />,
      900,
      700
    );

    expect(getByTestId('info-hub-secondary')).toBeTruthy();
    expect(getByTestId('about-content-root')).toBeTruthy();

    await fireEvent.press(getByTestId('info-menu-guide'));
    expect(getByTestId('guide-content-root')).toBeTruthy();

    await fireEvent.press(getByTestId('info-menu-methodology'));
    expect(getByTestId('methodology-content-root')).toBeTruthy();

    await fireEvent.press(getByTestId('info-open-fullscreen-btn'));
    expect(mockPush).toHaveBeenCalledWith('/methodology');
  });
});
