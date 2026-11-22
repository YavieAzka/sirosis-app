import React from 'react';
import { AccessibilityInfo } from 'react-native';
import * as ReactNative from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ApiError } from '@/services/api';
import { SaveToDatabaseSection } from '../SaveToDatabaseSection';

const SAFE_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 24, left: 0, right: 0, bottom: 16 },
};

async function renderSaveSection(onSave: jest.Mock) {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue('light');
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <SafeAreaProvider initialMetrics={SAFE_METRICS}>
      <LanguageProvider initialLanguage="id">
        <ThemeProvider>
          <SaveToDatabaseSection
            onSave={onSave}
            successMessage="Data berhasil disimpan!"
          />
        </ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('SaveToDatabaseSection', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('validates empty token inline without calling onSave', async () => {
    const onSave = jest.fn();
    const { getByTestId, getByText } = await renderSaveSection(onSave);

    await fireEvent.press(getByTestId('save-db-submit'));
    expect(getByText('Wajib diisi.')).toBeTruthy();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('toggles token visibility, displays 401 error without losing inputs, and saves cleanly', async () => {
    const onSave = jest
      .fn()
      .mockRejectedValueOnce(new ApiError('UNAUTHORIZED', 'Token salah', 401))
      .mockResolvedValueOnce(undefined);

    const { getByTestId, getByText, queryByTestId } =
      await renderSaveSection(onSave);

    const tokenInput = getByTestId('save-db-token-input');
    expect(tokenInput.props.secureTextEntry).toBe(true);

    await fireEvent.press(getByTestId('save-db-token-visibility'));
    expect(getByTestId('save-db-token-input').props.secureTextEntry).toBe(false);

    await fireEvent.changeText(getByTestId('save-db-name-input'), 'Budi');
    await fireEvent.changeText(getByTestId('save-db-mrn-input'), 'RM-001');
    await fireEvent.changeText(getByTestId('save-db-token-input'), 'wrong-tok');

    await fireEvent.press(getByTestId('save-db-submit'));
    await waitFor(() => {
      expect(getByTestId('save-db-error')).toBeTruthy();
    });
    expect(getByText('Token salah')).toBeTruthy();
    expect(getByTestId('save-db-name-input').props.value).toBe('Budi');

    await fireEvent.changeText(getByTestId('save-db-token-input'), 'right-tok');
    await fireEvent.press(getByTestId('save-db-submit'));

    await waitFor(() => {
      expect(getByTestId('save-db-success')).toBeTruthy();
    });
    expect(queryByTestId('save-db-error')).toBeNull();
    expect(onSave).toHaveBeenLastCalledWith({
      token: 'right-tok',
      patientName: 'Budi',
      medicalRecordNumber: 'RM-001',
    });
  });
});
