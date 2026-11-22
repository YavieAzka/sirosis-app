import React from 'react';
import { AccessibilityInfo, Dimensions } from 'react-native';
import * as ReactNative from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { DoseScreenContent } from '../DoseScreenContent';

async function renderDose(width = 390, height = 844) {
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
          <DoseScreenContent />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('DoseScreenContent', () => {
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

  it('enforces diuretic mutual exclusion and validates drug selection before API call', async () => {
    const fetchMock = jest.fn();
    globalThis.fetch = fetchMock as never;

    const { getByTestId } = await renderDose(390, 844);

    // Selecting combo disables singles
    await fireEvent.press(getByTestId('dose-drug-spiro_furo'));
    expect(
      getByTestId('dose-drug-spironolakton').props.accessibilityState.disabled
    ).toBe(true);
    expect(
      getByTestId('dose-drug-furosemid').props.accessibilityState.disabled
    ).toBe(true);

    // Unselect combo, select single -> disables combo
    await fireEvent.press(getByTestId('dose-drug-spiro_furo'));
    await fireEvent.press(getByTestId('dose-drug-spironolakton'));
    expect(
      getByTestId('dose-drug-spiro_furo').props.accessibilityState.disabled
    ).toBe(true);

    // Clear single and submit without drugs -> validation error
    await fireEvent.press(getByTestId('dose-drug-spironolakton'));
    await fireEvent.press(getByTestId('dose-submit-btn'));
    expect(getByTestId('dose-drugs-error')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('selects all compatible drugs, maps CKD to gagal_ginjal_akut, and displays dose cards', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        propranolol: {
          obat: 'Propranolol',
          status: 'Avoid',
          rentang_dosis: 'Umumnya hindari',
          alasan: 'MAP 62 mmHg (< 65 mmHg).',
          peringatan: ['Pantau: HR, MAP, Cr, Na+.'],
        },
        ampisilin_sulbaktam: {
          obat: 'Ampisilin-Sulbaktam',
          status: 'Use / Reduce if CKD',
          rentang_dosis: '1,5 - 3 g IV tiap 8-12 jam',
          alasan: 'Fungsi ginjal menurun (CrCl 30-49 mL/min).',
          peringatan: ['Monitor Cr, fungsi hati.'],
        },
      }),
    });
    globalThis.fetch = fetchMock as never;

    const { getByTestId, getByText } = await renderDose(390, 844);

    await fireEvent.press(getByTestId('dose-select-all-btn'));
    expect(
      getByTestId('dose-drug-spiro_furo').props.accessibilityState.checked
    ).toBe(true);
    expect(
      getByTestId('dose-drug-spironolakton').props.accessibilityState.checked
    ).toBe(false);

    await fireEvent.changeText(getByTestId('dose-gfr-value-input'), '42');
    await fireEvent.changeText(getByTestId('dose-map-value-input'), '62');
    await fireEvent.press(getByTestId('dose-flag-ckd'));

    await fireEvent.press(getByTestId('dose-submit-btn'));

    await waitFor(() => {
      expect(getByTestId('dose-result-warning-banner')).toBeTruthy();
    });

    const sentBody = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sentBody.gagal_ginjal_akut).toBe(1);
    expect(sentBody.map_value).toBe(62);
    expect(sentBody.obat_pilihan).toEqual([
      'spiro_furo',
      'propranolol',
      'carvedilol',
      'ampisilin_sulbaktam',
      'azitromisin',
      'levofloxacin',
    ]);

    expect(getByTestId('dose-result-card-propranolol')).toBeTruthy();
    expect(getByText('Umumnya hindari')).toBeTruthy();
    expect(getByText(/MAP 62 mmHg \(< 65 mmHg\)\./)).toBeTruthy();
    expect(getByText('• Pantau: HR, MAP, Cr, Na+.')).toBeTruthy();
  });
});
