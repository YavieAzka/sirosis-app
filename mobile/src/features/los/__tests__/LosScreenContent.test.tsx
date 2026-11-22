import React from 'react';
import { AccessibilityInfo, Dimensions } from 'react-native';
import * as ReactNative from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { LosScreenContent } from '../LosScreenContent';

async function renderLos(width = 390, height = 844) {
  Dimensions.set({
    window: { width, height, scale: 2, fontScale: 1 },
    screen: { width, height, scale: 2, fontScale: 1 },
  });
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);
  jest
    .spyOn(NetInfo, 'fetch')
    .mockResolvedValue({ isConnected: true } as never);

  return await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width, height },
        insets: { top: 24, left: 0, right: 0, bottom: 16 },
      }}
    >
      <LanguageProvider initialLanguage="id">
        <ThemeProvider>
          <LosScreenContent />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('LosScreenContent', () => {
  const originalEnvUrl = process.env.EXPO_PUBLIC_API_URL;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.EXPO_PUBLIC_API_URL = 'https://cirrhosmart.example.com';
  });

  afterEach(() => {
    process.env.EXPO_PUBLIC_API_URL = originalEnvUrl;
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('auto-calculates linked CKD-EPI GFR and UNOS MELD, calls /api/predict_los, and saves with meldScore', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ probability_los: 0.583 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { patient: {}, mortality: null, los: {} },
        }),
      });
    globalThis.fetch = fetchMock as never;

    const { getByTestId, getByText } = await renderLos(390, 844);

    await fireEvent.changeText(getByTestId('los-usia-input'), '64');
    await fireEvent.changeText(getByTestId('los-kreatinin-input'), '2,7');
    await fireEvent.changeText(getByTestId('los-bilirubin-input'), '0,4');
    await fireEvent.changeText(getByTestId('los-inr-input'), '1,11');
    await fireEvent.changeText(getByTestId('los-sgot-input'), '70');

    // Linked GFR auto toggle
    await fireEvent.press(getByTestId('los-gfr-auto-toggle'));
    await waitFor(() => {
      expect(getByTestId('los-gfr-value-input').props.value).toBe('25.52');
    });

    // Live UNOS MELD card should show 17.1
    expect(getByTestId('los-meld-card-value').props.children).toBe('17.1');

    await fireEvent.press(getByTestId('los-submit-btn'));

    await waitFor(() => {
      expect(getByTestId('los-result-probability')).toBeTruthy();
    });
    expect(getByText('58.3%')).toBeTruthy();
    expect(getByTestId('los-result-meld').props.children.join('')).toContain(
      '17.1'
    );

    const losBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(losBody).not.toHaveProperty('jk');
    expect(losBody.kreatinin_baseline).toBe(2.7);
    expect(losBody.bilirubin_baseline).toBe(0.4);

    // Save to DB
    await fireEvent.changeText(
      getByTestId('los-result-save-token-input'),
      'tok-los'
    );
    await fireEvent.press(getByTestId('los-result-save-submit'));

    await waitFor(() => {
      expect(getByTestId('los-result-save-success')).toBeTruthy();
    });

    const saveBody = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(saveBody.meldScore).toBe(17.1);
    expect(saveBody.probability_los).toBe(0.583);
  });
});
