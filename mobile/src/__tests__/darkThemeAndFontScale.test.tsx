import React from 'react';
import { AccessibilityInfo, Dimensions, StyleSheet } from 'react-native';
import * as ReactNative from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ResultSheetModal } from '@/components/clinical/ResultSheetModal';
import { MaterialSelectSheet } from '@/components/ui/MaterialSelectSheet';
import { DoseScreenContent } from '@/features/dose/DoseScreenContent';
import { InfoHubScreenContent } from '@/features/info/InfoHubScreenContent';
import { LosScreenContent } from '@/features/los/LosScreenContent';
import { MortalityScreenContent } from '@/features/mortality/MortalityScreenContent';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { darkColors } from '@/theme/colors';
import { ThemeProvider } from '@/theme/ThemeProvider';

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    navigate: jest.fn(),
    back: jest.fn(),
  }),
}));

async function renderInAccessibilityEnv(
  ui: React.ReactElement,
  {
    width = 360,
    height = 740,
    fontScale = 1.3,
    colorScheme = 'dark' as 'light' | 'dark',
    reduceMotion = true,
    language = 'en' as 'id' | 'en',
  } = {}
) {
  Dimensions.set({
    window: { width, height, scale: 2, fontScale },
    screen: { width, height, scale: 2, fontScale },
  });
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(colorScheme);
  jest
    .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
    .mockResolvedValue(reduceMotion);
  jest.spyOn(AccessibilityInfo, 'addEventListener').mockReturnValue({
    remove: jest.fn(),
  } as never);

  return await render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width, height },
        insets: { top: 24, left: 0, right: 0, bottom: 24 },
      }}
    >
      <LanguageProvider initialLanguage={language}>
        <ThemeProvider>{ui}</ThemeProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

describe('Phase 6 Android Dark Theme, Reduce Motion, and Font Scale 1.3x Hardening', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('ResultSheetModal uses animationType="none" when Android Reduce Motion is enabled', async () => {
    const onClose = jest.fn();
    const { getByTestId } = await renderInAccessibilityEnv(
      <ResultSheetModal visible title="Evaluation Result" onClose={onClose}>
        <></>
      </ResultSheetModal>,
      { reduceMotion: true }
    );

    await waitFor(() => {
      expect(getByTestId('result-sheet-modal-modal').props.animationType).toBe(
        'none'
      );
    });
  });

  it('MaterialSelectSheet localizes English trigger placeholder and modal controls cleanly', async () => {
    const { getByTestId, getByText } =
      await renderInAccessibilityEnv(
        <MaterialSelectSheet
          testID="a11y-select"
          label="CTP Classification"
          value=""
          options={[
            { value: '1', label: 'Class A' },
            { value: '2', label: 'Class B' },
          ]}
          onSelect={jest.fn()}
        />,
        { language: 'en' }
      );

    expect(getByText('Select')).toBeTruthy();

    await fireEvent.press(getByTestId('a11y-select'));
    expect(getByTestId('a11y-select-backdrop').props.accessibilityLabel).toBe(
      'Close'
    );
    expect(getByTestId('a11y-select-close').props.accessibilityLabel).toBe(
      'Close'
    );
  });

  it('renders all primary clinical & Read screens cleanly in Dark Mode + 1.3x font scale on compact phones and landscape ward tablets', async () => {
    // Compact Android phone in Dark Theme + 1.3x fontScale
    const mortalityRender = await renderInAccessibilityEnv(
      <MortalityScreenContent />,
      { width: 360, height: 740, fontScale: 1.3, colorScheme: 'dark', language: 'en' }
    );
    const singlePane = mortalityRender.getByTestId('workspace-single-pane');
    expect(StyleSheet.flatten(singlePane.props.style).backgroundColor).toBe(
      darkColors.background
    );
    expect(mortalityRender.getByTestId('mortality-submit-btn')).toBeTruthy();
    await mortalityRender.unmount();

    const losRender = await renderInAccessibilityEnv(<LosScreenContent />, {
      width: 360,
      height: 740,
      fontScale: 1.3,
      colorScheme: 'dark',
      language: 'id',
    });
    expect(losRender.getByTestId('los-submit-btn')).toBeTruthy();
    await losRender.unmount();

    // Landscape Ward Tablet (1024x768) in Dark Theme + 1.3x fontScale
    const doseRender = await renderInAccessibilityEnv(<DoseScreenContent />, {
      width: 1024,
      height: 768,
      fontScale: 1.3,
      colorScheme: 'dark',
      language: 'id',
    });
    const twoPane = doseRender.getByTestId('workspace-two-pane');
    expect(StyleSheet.flatten(twoPane.props.style).backgroundColor).toBe(
      darkColors.background
    );
    expect(doseRender.getByTestId('dose-submit-btn')).toBeTruthy();
    await doseRender.unmount();

    const infoRender = await renderInAccessibilityEnv(
      <InfoHubScreenContent />,
      { width: 1024, height: 768, fontScale: 1.3, colorScheme: 'dark', language: 'en' }
    );
    expect(infoRender.getByTestId('workspace-two-pane')).toBeTruthy();
    expect(infoRender.getByTestId('info-hub-secondary')).toBeTruthy();
    await infoRender.unmount();
  });
});
