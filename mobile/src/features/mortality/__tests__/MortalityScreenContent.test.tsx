import React from 'react';
import { AccessibilityInfo, Dimensions } from 'react-native';
import * as ReactNative from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { MortalityScreenContent } from '../MortalityScreenContent';

async function renderMortality(width = 390, height = 844) {
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
          <MortalityScreenContent />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('MortalityScreenContent', () => {
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

  it('prevents submission when required labs are missing and displays inline errors', async () => {
    const fetchMock = jest.fn();
    globalThis.fetch = fetchMock as never;

    const { getByTestId, getAllByText } = await renderMortality(390, 844);
    await fireEvent.press(getByTestId('mortality-submit-btn'));

    expect(getAllByText('Wajib diisi.').length).toBeGreaterThanOrEqual(4);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits mortality payload with synced auto-CTP HE, displays SHAP modal, and saves to DB', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          probability: 0.697,
          predicted_class: 1,
          base_value: 0.499,
          shap_contributions: [
            { feature: 'komor_sepsis', contribution: 0.15, value_input: 1 },
            { feature: 'inr_baseline', contribution: -0.11, value_input: 1.11 },
          ],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { patient: {}, mortality: {}, los: null },
        }),
      });
    globalThis.fetch = fetchMock as never;

    const { getByTestId, getByText } = await renderMortality(390, 844);

    // Toggle sepsis = 1
    await fireEvent.press(getByTestId('mortality-sepsis-toggle-option-1'));

    // Auto CTP -> fill 5 params with encephalopathy = 2 (should sync komp_eh = 1!)
    await fireEvent.press(getByTestId('mortality-ctp-auto-toggle'));
    for (const key of [
      'bilirubin',
      'albumin',
      'inr',
      'ascites',
      'encephalopathy',
    ]) {
      await fireEvent.press(getByTestId(`mortality-ctp-param-${key}`));
      await fireEvent.press(getByTestId(`mortality-ctp-param-${key}-option-2`));
    }

    await fireEvent.changeText(getByTestId('mortality-inr-direct-input'), '1,11');
    await fireEvent.changeText(getByTestId('mortality-urea-input'), '96');
    await fireEvent.changeText(getByTestId('mortality-natrium-input'), '136');
    await fireEvent.changeText(getByTestId('mortality-sgot-input'), '70');
    await fireEvent.changeText(getByTestId('mortality-gfr-value-input'), '26');

    await fireEvent.press(getByTestId('mortality-submit-btn'));

    await waitFor(() => {
      expect(getByTestId('mortality-result-probability')).toBeTruthy();
    });

    expect(getByText('69.7%')).toBeTruthy();
    expect(getByText(/High Risk \/ Mortalitas/)).toBeTruthy();

    // Expand SHAP details
    await fireEvent.press(getByTestId('mortality-result-toggle-shap'));
    expect(getByTestId('mortality-result-shap-panel')).toBeTruthy();
    expect(getByText('Sepsis')).toBeTruthy();
    expect(getByText('+15.0%')).toBeTruthy();
    expect(getByText('-11.0%')).toBeTruthy();

    // Verify predict payload had synced komp_eh = 1 and ctp_encoded = 3 (total 10 -> Class C)
    const predictBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(predictBody).toEqual({
      komor_sepsis: 1,
      urea_baseline: 96,
      natrium_baseline: 136,
      komp_eh: 1,
      inr_baseline: 1.11,
      sgot_baseline: 70,
      gfr: 26,
      ctp_encoded: 3,
    });

    // Save to DB from modal
    await fireEvent.changeText(
      getByTestId('mortality-result-save-token-input'),
      'secret-123'
    );
    await fireEvent.press(getByTestId('mortality-result-save-submit'));

    await waitFor(() => {
      expect(getByTestId('mortality-result-save-success')).toBeTruthy();
    });
    expect(fetchMock.mock.calls[1][0]).toBe(
      'https://cirrhosmart.example.com/api/database/save'
    );
  });

  it('shows inline retry alert when offline and renders two-pane layout on tablet', async () => {
    jest
      .spyOn(NetInfo, 'fetch')
      .mockResolvedValueOnce({ isConnected: false } as never)
      .mockResolvedValueOnce({ isConnected: true } as never);

    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        probability: 0.22,
        predicted_class: 0,
        base_value: 0.49,
        shap_contributions: [],
      }),
    });
    globalThis.fetch = fetchMock as never;

    const { getByTestId, queryByTestId, getByText } = await renderMortality(
      840,
      1080
    );

    expect(getByTestId('mortality-result-empty')).toBeTruthy();

    await fireEvent.changeText(getByTestId('mortality-inr-direct-input'), '1.1');
    await fireEvent.changeText(getByTestId('mortality-urea-input'), '25');
    await fireEvent.changeText(getByTestId('mortality-natrium-input'), '138');
    await fireEvent.changeText(getByTestId('mortality-sgot-input'), '40');
    await fireEvent.changeText(getByTestId('mortality-gfr-value-input'), '85');

    await fireEvent.press(getByTestId('mortality-submit-btn'));

    await waitFor(() => {
      expect(getByTestId('mortality-api-error')).toBeTruthy();
    });

    await fireEvent.press(getByTestId('mortality-retry-btn'));

    await waitFor(() => {
      expect(getByTestId('mortality-result-container')).toBeTruthy();
    });
    expect(queryByTestId('mortality-result-modal')).toBeNull();
    expect(getByText('22.0%')).toBeTruthy();
    expect(getByTestId('mortality-result-shap-panel')).toBeTruthy();
  });
});
